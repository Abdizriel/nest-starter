import { I18nService } from 'nestjs-i18n';

import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { ForgotPasswordEvent, ForgotPasswordEventName } from '@xyz/contracts';
import { ConfigService, LoggerService } from '@xyz/core';

import { MailingRepository } from '../../../repositories';

@Injectable()
export class ForgotPasswordHandler {
  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
    private readonly mailingRepository: MailingRepository,
    private readonly i18n: I18nService,
  ) {
    this.loggerService.setContext(ForgotPasswordHandler.name);
  }

  @OnEvent(ForgotPasswordEventName)
  async execute(event: ForgotPasswordEvent) {
    try {
      this.loggerService.log('ForgotPasswordHandler#execute - event', {
        event,
      });

      const {
        user: { email },
        token,
      } = event;

      const link = `${this.configService.get(
        'WEB_URL',
      )}/auth/reset-password?token=${token}`;

      const context = {
        subject: await this.i18n.translate('email.forgot_password.subject'),
        description: await this.i18n.translate(
          'email.forgot_password.description',
        ),
        reset: await this.i18n.translate('email.forgot_password.link.reset'),
        link,
      };

      this.loggerService.log('ForgotPasswordHandler#execute - context', {
        context,
      });

      await this.mailingRepository.sendMail({
        to: email,
        template: 'auth/forgot-password',
        subject: context.subject,
        context,
      });
    } catch (err) {
      this.loggerService.log('ForgotPasswordHandler#error', err);
    }
  }
}
