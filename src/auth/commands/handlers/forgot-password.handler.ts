import { TokenType } from '@prisma/client';
import { add } from 'date-fns';
import { I18nService } from 'nestjs-i18n';

import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';

import {
  ForgotPasswordEvent,
  ForgotPasswordEventName,
} from '@xyz/contracts/auth/events/forgot-password.event';
import { LoggerService } from '@xyz/core';

import { TokenRepository, UserRepository } from '../../repositories';
import { ForgotPasswordCommand } from '../impl';

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler
  implements ICommandHandler<ForgotPasswordCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly loggerService: LoggerService,
    private readonly i18n: I18nService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.loggerService.setContext(ForgotPasswordHandler.name);
  }

  async execute(command: ForgotPasswordCommand): Promise<void> {
    this.loggerService.log('ForgotPasswordHandler#execute.command', {
      command,
    });

    const { email } = command.payload;

    const user = await this.userRepository.findByEmail(email.toLowerCase());

    if (!user) {
      throw new NotFoundException(
        await this.i18n.translate('account.user.not_found'),
      );
    }

    const { token } = await this.tokenRepository.create({
      user: {
        connect: {
          id: user.id,
        },
      },
      type: TokenType.RESET_PASSWORD,
      token: Math.random().toString(36).slice(2),
      expireAt: add(new Date(), {
        minutes: 15,
      }),
    });

    this.eventEmitter.emit(
      ForgotPasswordEventName,
      new ForgotPasswordEvent(user, token),
    );
  }
}
