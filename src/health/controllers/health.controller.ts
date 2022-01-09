import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

import { LoggerService } from '@xyz/core';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private loggerService: LoggerService,
  ) {
    this.loggerService.setContext(HealthController.name);
  }

  @Get()
  @HealthCheck()
  public async check() {
    this.loggerService.info('HealthController#check.call');

    const result = await this.health.check([]);

    this.loggerService.info('HealthController#check.result', result);

    return result;
  }
}
