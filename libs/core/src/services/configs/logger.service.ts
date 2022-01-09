import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '../config.service';

@Injectable()
export class LoggerConfigService {
  constructor(private readonly configService: ConfigService) {}

  createLoggerOptions(): winston.LoggerOptions {
    return {
      transports: [
        new DailyRotateFile({
          level: 'debug',
          filename: `./logs/${this.configService.nodeEnv}/debug-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
        new DailyRotateFile({
          level: 'error',
          filename: `./logs/${this.configService.nodeEnv}/error-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxSize: '20m',
          maxFiles: '30d',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
        new winston.transports.Console({
          level: 'debug',
          handleExceptions: true,
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({
              format: 'DD-MM-YYYY HH:mm:ss',
            }),
            winston.format.simple(),
          ),
        }),
      ],
      exitOnError: false,
    };
  }
}
