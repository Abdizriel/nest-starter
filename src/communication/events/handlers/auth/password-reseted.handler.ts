import { I18nService } from 'nestjs-i18n';

import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { PasswordResetedEvent, PasswordResetedEventName } from '@xyz/contracts';
import { ConfigService, LoggerService } from '@xyz/core';

import { MailingRepository } from '../../../repositories';

@Injectable()
export class PasswordResetedHandler {
  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
    private readonly mailingRepository: MailingRepository,
    private readonly i18n: I18nService,
  ) {
    this.loggerService.setContext(PasswordResetedHandler.name);
  }

  @OnEvent(PasswordResetedEventName)
  async execute(event: PasswordResetedEvent) {
    try {
      this.loggerService.log('PasswordResetedHandler#execute - event', {
        event,
      });

      const {
        user: { email },
      } = event;

      const context = {
        subject: await this.i18n.translate('email.password_reseted.subject'),
        description: await this.i18n.translate(
          'email.password_reseted.description',
        ),
      };

      this.loggerService.log('PasswordResetedHandler#execute - context', {
        context,
      });

      await this.mailingRepository.sendMail({
        to: email,
        template: 'auth/password-reseted',
        subject: context.subject,
        context,
      });
    } catch (err) {
      this.loggerService.log('PasswordResetedHandler#error', err);
    }
  }
}
