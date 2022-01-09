import { TokenType } from '@prisma/client';
import bcrypt from 'bcrypt';
import { isAfter } from 'date-fns';
import { I18nService } from 'nestjs-i18n';

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';

import {
  PasswordResetedEvent,
  PasswordResetedEventName,
  ResetPasswordResponseDto,
} from '@xyz/contracts';
import { ConfigService, LoggerService } from '@xyz/core';

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
    private readonly i18n: I18nService,
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

    if (!tokenEntity) {
      throw new NotFoundException(
        await this.i18n.translate('auth.token.not_found'),
      );
    }

    if (!tokenEntity.isValid) {
      throw new BadRequestException(
        await this.i18n.translate('auth.token.invalid'),
      );
    }

    if (isAfter(new Date(), new Date(tokenEntity.expireAt))) {
      throw new BadRequestException(
        await this.i18n.translate('auth.token.expired'),
      );
    }

    let user = await this.userRepository.findById(tokenEntity.userId);

    if (!user) {
      throw new NotFoundException(
        await this.i18n.translate('account.user.not_found'),
      );
    }

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
