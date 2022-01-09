import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TwilioModule } from 'nestjs-twilio';
import * as path from 'path';

import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ConfigService } from '@xyz/core';

import { EventHandlers } from './events/handlers';
import { MailingRepository } from './repositories';

@Module({
  imports: [
    CqrsModule,
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: configService.get('MAILER_DSN'),
        template: {
          dir: path.join(__dirname, '/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    TwilioModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        accountSid: configService.get('TWILIO_ACCOUNT_SID'),
        authToken: configService.get('TWILIO_AUTH_TOKEN'),
      }),
    }),
  ],
  providers: [MailingRepository, ...EventHandlers],
})
export class CommunicationModule {}
