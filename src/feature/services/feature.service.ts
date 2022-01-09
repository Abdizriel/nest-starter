import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { FeatureDto } from '@xyz/contracts';
import { LoggerService } from '@xyz/core';

import { GetFeaturesQuery } from '../queries/impl';

@Injectable()
export class FeatureService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext(FeatureService.name);
  }

  public async getFeatures(): Promise<FeatureDto[]> {
    this.loggerService.info('FeatureService#getFeatures.call');

    const result = await this.queryBus.execute<GetFeaturesQuery, FeatureDto[]>(
      new GetFeaturesQuery(),
    );

    this.loggerService.info('FeatureService#getFeatures.result', result);

    return result;
  }
}
