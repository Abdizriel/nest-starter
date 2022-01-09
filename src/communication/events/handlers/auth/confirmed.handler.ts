import { I18nService } from 'nestjs-i18n';

import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { ConfirmedEvent, ConfirmedEventName } from '@xyz/contracts';
import { LoggerService } from '@xyz/core';

import { MailingRepository } from '../../../repositories';

@Injectable()
export class ConfirmedHandler {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly mailingRepository: MailingRepository,
    private readonly i18n: I18nService,
  ) {
    this.loggerService.setContext(ConfirmedHandler.name);
  }

  @OnEvent(ConfirmedEventName)
  async execute(event: ConfirmedEvent) {
    try {
      this.loggerService.log('ConfirmedHandler#execute - event', {
        event,
      });

      const {
        user: { email },
      } = event;

      const context = {
        subject: await this.i18n.translate('email.welcome_user.subject'),
        description: await this.i18n.translate(
          'email.welcome_user.description',
        ),
      };
      this.loggerService.log('ConfirmedHandler#execute - context', {
        context,
      });

      await this.mailingRepository.sendMail({
        to: email,
        template: 'auth/welcome-user',
        subject: context.subject,
        context,
      });
    } catch (err) {
      this.loggerService.log('ConfirmedHandler#error', err);
    }
  }
}
