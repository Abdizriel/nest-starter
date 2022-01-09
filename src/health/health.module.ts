import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { CoreModule } from '@xyz/core';

import { HealthController } from './controllers';

@Module({
  imports: [CoreModule, TerminusModule],
  controllers: [HealthController],
})
export class HealthModule {}
