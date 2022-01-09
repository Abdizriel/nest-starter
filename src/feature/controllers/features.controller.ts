import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FeatureDto } from '@xyz/contracts';
import { LoggerService, TransformInterceptor } from '@xyz/core';

import { FeatureService } from '../services';

@ApiTags('Feature')
@Controller('features')
export class FeatureController {
  constructor(
    private loggerService: LoggerService,
    private featureService: FeatureService,
  ) {
    this.loggerService.setContext(FeatureController.name);
  }

  @Get()
  @UseInterceptors(new TransformInterceptor(FeatureDto))
  public async getFeatures(): Promise<FeatureDto[]> {
    this.loggerService.info('FeatureController#getFeatures.call');

    const result = await this.featureService.getFeatures();

    this.loggerService.info('FeatureController#getFeatures.result', result);

    return result;
  }
}
