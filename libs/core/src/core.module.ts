import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';

import {
  ConfigService,
  LoggerConfigService,
  LoggerService,
  PrismaService,
} from './services';

@Global()
@Module({
  imports: [HttpModule],
  providers: [PrismaService, LoggerService, LoggerConfigService, ConfigService],
  exports: [PrismaService, LoggerService, ConfigService, HttpModule],
})
export class CoreModule {}
