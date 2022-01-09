import { I18nService } from 'nestjs-i18n';

import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { RegisteredEvent, RegisteredEventName } from '@xyz/contracts';
import { ConfigService, LoggerService } from '@xyz/core';

import { MailingRepository } from '../../../repositories';

@Injectable()
export class RegisteredHandler {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly mailingRepository: MailingRepository,
    private readonly i18n: I18nService,
    private readonly configService: ConfigService,
  ) {
    this.loggerService.setContext(RegisteredHandler.name);
  }

  @OnEvent(RegisteredEventName)
  async execute(event: RegisteredEvent) {
    try {
      this.loggerService.log('RegisteredHandler#execute - event', {
        event,
      });

      const { user, token } = event;
      const { email } = user;

      const link = `${this.configService.get(
        'WEB_URL',
      )}/auth/confirm?token=${token}`;

      const context = {
        subject: await this.i18n.translate(
          'email.confirm_registration.subject',
        ),
        description: await this.i18n.translate(
          'email.confirm_registration.description',
        ),
        confirm: await this.i18n.translate(
          'email.confirm_registration.link.confirm',
        ),
        link,
      };
      this.loggerService.log('RegisteredHandler#execute - context', {
        context,
      });

      await this.mailingRepository.sendMail({
        to: email,
        template: 'auth/confirm-registration',
        subject: context.subject,
        context,
      });
    } catch (err) {
      this.loggerService.log('RegisteredHandler#error', err);
    }
  }
}
