import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { FeatureDto } from '@xyz/contracts';
import { LoggerService } from '@xyz/core';

import { FeatureRepository } from '../../repositories';
import { GetFeaturesQuery } from '../impl';

@QueryHandler(GetFeaturesQuery)
export class GetFeatureHandler implements IQueryHandler<GetFeaturesQuery> {
  constructor(
    private readonly featureRepository: FeatureRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext(GetFeatureHandler.name);
  }

  async execute(command: GetFeaturesQuery): Promise<FeatureDto[]> {
    try {
      this.loggerService.log('GetFeatureHandler#execute.command', {
        command,
      });

      const features = await this.featureRepository.find();

      return features;
    } catch (error) {
      this.loggerService.error('GetFeatureHandler#execute.error', {
        error,
      });

      throw error;
    }
  }
}
