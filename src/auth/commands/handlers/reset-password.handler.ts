import { TokenType } from '@prisma/client';
import bcrypt from 'bcrypt';
import { isAfter } from 'date-fns';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';

import {
  PasswordResetedEvent,
  PasswordResetedEventName,
  ResetPasswordResponseDto,
} from '@xyz/contracts';
import { ConfigService, LoggerService } from '@xyz/core';
import {
  TokenExpiredException,
  TokenInvalidException,
  UserNotFoundException,
} from '@xyz/exceptions';

import { TokenRepository, UserRepository } from '../../repositories';
import { ResetPasswordCommand } from '../impl';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler
  implements ICommandHandler<ResetPasswordCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly loggerService: LoggerService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.loggerService.setContext(ResetPasswordHandler.name);
  }

  async execute(
    command: ResetPasswordCommand,
  ): Promise<ResetPasswordResponseDto> {
    this.loggerService.log('ResetPasswordHandler#execute.command', {
      command,
    });

    const { token, password } = command.payload;

    const tokenEntity = await this.tokenRepository.findByToken(
      token,
      TokenType.RESET_PASSWORD,
    );
    if (!tokenEntity || !tokenEntity.isValid) throw new TokenInvalidException();
    if (isAfter(new Date(), new Date(tokenEntity.expireAt)))
      throw new TokenExpiredException();

    let user = await this.userRepository.findById(tokenEntity.userId);
    if (!user) throw new UserNotFoundException();

    const hashedPassword = await bcrypt.hash(
      password,
      this.configService.getNumber('SALT_ROUNDS'),
    );

    user = await this.userRepository.update(user.id, {
      password: hashedPassword,
    });

    this.eventEmitter.emit(
      PasswordResetedEventName,
      new PasswordResetedEvent(user),
    );

    return {
      user,
      accessToken: this.jwtService.sign({ sub: user.id }),
    };
  }
}
