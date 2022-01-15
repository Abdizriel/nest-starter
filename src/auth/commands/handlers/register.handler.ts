import { TokenType } from '@prisma/client';
import { add } from 'date-fns';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { RegisteredEvent, RegisteredEventName, UserDto } from '@xyz/contracts';
import { LoggerService } from '@xyz/core';
import { UserAlreadyExistsException } from '@xyz/exceptions/account/user-already-exists.exception';

import { UserService } from '../../../account/services';
import { TokenRepository } from '../../repositories';
import { RegisterCommand } from '../impl';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly userService: UserService,
    private readonly tokenRepository: TokenRepository,
    private readonly loggerService: LoggerService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.loggerService.setContext(RegisterHandler.name);
  }

  async execute(command: RegisterCommand): Promise<UserDto> {
    this.loggerService.log('RegisterHandler#execute.command', {
      command,
    });

    const { payload } = command;

    const existingUser = await this.userService.getUserByEmail(payload.email);
    if (existingUser) throw new UserAlreadyExistsException();

    const createdUser = await this.userService.createUser(payload);

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
