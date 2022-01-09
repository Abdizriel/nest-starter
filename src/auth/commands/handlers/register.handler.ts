import { TokenType } from '@prisma/client';
import bcrypt from 'bcrypt';
import { add } from 'date-fns';
import { I18nService } from 'nestjs-i18n';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { RegisteredEvent, RegisteredEventName, UserDto } from '@xyz/contracts';
import { ConfigService, LoggerService } from '@xyz/core';
import { UserAlreadyExistsException } from '@xyz/exceptions/account/user-already-exists.exception';

import { TokenRepository, UserRepository } from '../../repositories';
import { RegisterCommand } from '../impl';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    private readonly i18n: I18nService,
  ) {
    this.loggerService.setContext(RegisterHandler.name);
  }

  async execute(command: RegisterCommand): Promise<UserDto> {
    this.loggerService.log('RegisterHandler#execute.command', {
      command,
    });

    const { payload } = command;
    let { password, email } = payload;
    email = email.toLowerCase();

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new UserAlreadyExistsException();

    password = await bcrypt.hash(
      password,
      this.configService.getNumber('SALT_ROUNDS'),
    );

    const createdUser = await this.userRepository.create({
      ...payload,
      password,
      email,
      account: {
        create: {},
      },
    });

    const { token } = await this.tokenRepository.create({
      user: {
        connect: {
          id: createdUser.id,
        },
      },
      type: TokenType.CONFIRM_EMAIL,
      token: Math.random().toString(36).slice(2),
      expireAt: add(new Date(), {
        minutes: 15,
      }),
    });

    this.eventEmitter.emit(
      RegisteredEventName,
      new RegisteredEvent(createdUser, token),
    );

    return createdUser;
  }
}
