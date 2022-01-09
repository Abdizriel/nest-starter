import { I18nJsonParser, I18nModule } from 'nestjs-i18n';
import * as path from 'path';

import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { CoreModule } from '@xyz/core';

import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { CommunicationModule } from './communication/communication.module';
import { FeatureModule } from './feature/feature.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    AccountModule,
    AuthModule,
    CoreModule,
    CommunicationModule,
    CqrsModule,
    EventEmitterModule.forRoot(),
    FeatureModule,
    HealthModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
    }),
  ],
})
export class AppModule {}
