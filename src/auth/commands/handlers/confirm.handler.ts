import { TokenType } from '@prisma/client';
import { isAfter } from 'date-fns';
import { I18nService } from 'nestjs-i18n';

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { ConfirmedEvent, ConfirmedEventName } from '@xyz/contracts';
import { LoggerService } from '@xyz/core';

import { TokenRepository, UserRepository } from '../../repositories';
import { ConfirmCommand } from '../impl';

@CommandHandler(ConfirmCommand)
export class ConfirmHandler implements ICommandHandler<ConfirmCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly loggerService: LoggerService,
    private readonly i18n: I18nService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.loggerService.setContext(ConfirmHandler.name);
  }

  async execute(command: ConfirmCommand): Promise<void> {
    this.loggerService.log('ConfirmHandler#execute.command', {
      command,
    });

    const { token } = command;

    const entry = await this.tokenRepository.findByToken(
      token,
      TokenType.CONFIRM_EMAIL,
    );

    if (!entry) {
      throw new NotFoundException(
        await this.i18n.translate('error.token.not_found'),
      );
    }

    if (!entry.isValid) {
      throw new BadRequestException(
        await this.i18n.translate('error.token.invalid'),
      );
    }

    if (isAfter(new Date(), new Date(entry.expireAt))) {
      throw new BadRequestException(
        await this.i18n.translate('error.token.expired'),
      );
    }

    const user = await this.userRepository.findById(entry.userId);

    if (!user) {
      throw new NotFoundException(
        await this.i18n.translate('error.user.not_found'),
      );
    }

    await this.userRepository.update(entry.userId, {
      isConfirmed: true,
    });

    await this.tokenRepository.update(entry.id, {
      isValid: false,
    });

    this.eventEmitter.emit(ConfirmedEventName, new ConfirmedEvent(user));
  }
}
