import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { FeatureController } from './controllers';
import { QueryHandlers } from './queries/handlers';
import { FeatureRepository } from './repositories';
import { FeatureService } from './services';

@Module({
  imports: [CqrsModule],
  providers: [...QueryHandlers, FeatureService, FeatureRepository],
  controllers: [FeatureController],
})
export class FeatureModule {}
