import { TokenType } from '@prisma/client';
import { isAfter } from 'date-fns';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { ConfirmedEvent, ConfirmedEventName } from '@xyz/contracts';
import { LoggerService } from '@xyz/core';
import {
  TokenExpiredException,
  TokenInvalidException,
  UserNotFoundException,
} from '@xyz/exceptions';

import { TokenRepository, UserRepository } from '../../repositories';
import { ConfirmCommand } from '../impl';

@CommandHandler(ConfirmCommand)
export class ConfirmHandler implements ICommandHandler<ConfirmCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly loggerService: LoggerService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.loggerService.setContext(ConfirmHandler.name);
  }

  async execute(command: ConfirmCommand): Promise<void> {
    this.loggerService.log('ConfirmHandler#execute.command', {
      command,
    });

    const { token } = command;

    const tokenEntity = await this.tokenRepository.findByToken(
      token,
      TokenType.CONFIRM_EMAIL,
    );
    if (!tokenEntity || !tokenEntity.isValid) throw new TokenInvalidException();
    if (isAfter(new Date(), new Date(tokenEntity.expireAt)))
      throw new TokenExpiredException();

    const user = await this.userRepository.findById(tokenEntity.userId);
    if (!user) throw new UserNotFoundException();

    await this.userRepository.update(tokenEntity.userId, {
      isConfirmed: true,
    });

    await this.tokenRepository.update(tokenEntity.id, {
      isValid: false,
    });

    this.eventEmitter.emit(ConfirmedEventName, new ConfirmedEvent(user));
  }
}
