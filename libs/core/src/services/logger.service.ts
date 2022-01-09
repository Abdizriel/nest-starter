import winston from 'winston';

import { ConsoleLogger, Injectable } from '@nestjs/common';

import { ConfigService } from './config.service';
import { LoggerConfigService } from './configs/logger.service';

@Injectable()
export class LoggerService extends ConsoleLogger {
  private readonly logger: winston.Logger;

  constructor(
    private readonly configService: ConfigService,
    private readonly loggerConfigService: LoggerConfigService,
  ) {
    super(LoggerService.name, { timestamp: true });
    this.logger = winston.createLogger(
      this.loggerConfigService.createLoggerOptions(),
    );
    if (this.configService.nodeEnv !== 'production') {
      this.logger.debug('Logging initialized at debug level');
    }
  }
  log(message: string, ...meta: any[]): void {
    this.logger.info(message, ...meta);
  }
  info(message: string, ...meta: any[]): void {
    this.logger.info(message, ...meta);
  }
  debug(message: string, ...meta: any[]): void {
    this.logger.debug(message, ...meta);
  }
  error(message: string, trace?: any, context?: string): void {
    this.logger.error(
      `${context || ''} ${message} -> (${trace || 'trace not provided !'})`,
    );
  }
  warn(message: string): void {
    this.logger.warn(message);
  }
}
