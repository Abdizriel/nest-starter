import { Request, Response } from 'express';
import { I18nService } from 'nestjs-i18n';

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { LoggerService } from '../services';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly loggerService: LoggerService,
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
        return exception.message
          ? await this.i18n.translate(exception.message)
          : null;
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
          ? (exception.getResponse() as any).error
          : exception.getResponse(),
      type: (exception.getResponse() as any)?.type ?? null,
    };

    console.log('errorResponse', errorResponse);

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.loggerService.error('ExceptionFilter', exception.stack);
    } else {
      this.loggerService.error(
        'ExceptionFilter',
        JSON.stringify(errorResponse),
      );
    }

    return response.status(status).json(errorResponse);
  }
}
