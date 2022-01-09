import { Request, Response } from 'express';
import { I18nService } from 'nestjs-i18n';

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { LoggerService } from '../services/logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    private readonly i18n: I18nService,
  ) {}

  async getError(
    status: number,
    exception: HttpException,
  ): Promise<string | null> {
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      return this.i18n.translate('error.internal');
    }

    switch (status) {
      case HttpStatus.UNAUTHORIZED:
        return await this.i18n.translate('error.unauthorized');

      default:
        return exception.name ?? null;
    }
  }

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: await this.getError(status, exception),
      message:
        typeof exception.getResponse() === 'object'
          ? (exception.getResponse() as any).message
          : exception.getResponse(),
      code: (exception.getResponse() as any)?.code,
    };

    console.log('errorResponse', errorResponse);

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error('ExceptionFilter', exception.stack);
    } else {
      this.logger.error('ExceptionFilter', JSON.stringify(errorResponse));
    }

    return response.status(status).json(errorResponse);
  }
}
