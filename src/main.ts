import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { I18nService } from 'nestjs-i18n';

import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import {
  ConfigService,
  CoreModule,
  HttpExceptionFilter,
  LoggerService,
} from '@xyz/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  );

  const i18n = app.select(AppModule).get(I18nService);
  const loggerService = app.select(CoreModule).get(LoggerService);
  const configService = app.select(CoreModule).get(ConfigService);

  app.useLogger(loggerService);

  app.use(
    morgan('combined', {
      stream: {
        write: (message) => {
          loggerService.log(message);
        },
      },
    }),
  );
  app.use(cookieParser());
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter(loggerService, i18n));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      validationError: {
        target: false,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('XYZ')
    .setDescription('The API description of XYZ')
    .setVersion('1.0')
    .addSecurity('bearer', {
      type: 'http',
      scheme: 'bearer',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.getNumber('API_GATEWAY__SERVICE_PORT') || 3000;
  const host = configService.get('API_GATEWAY_SERVICE_HOST') || 'localhost';
  await app.listen(port, host);

  loggerService.warn(`Server running on port ${host}:${port}`);
}

bootstrap();
