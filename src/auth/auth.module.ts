import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ConfigService } from '@xyz/core';

import { AccountModule } from '../account/account.module';
import { UserService } from '../account/services';
import { CommandHandlers } from './commands/handlers';
import { AuthController } from './controllers';
import { TokenRepository } from './repositories';
import { AuthService } from './services';
import { JwtStrategy, LocalStrategy } from './strategies';

const Strategies = [LocalStrategy, JwtStrategy];

@Module({
  imports: [
    CqrsModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [
    AccountModule,
    AuthService,
    UserService,
    TokenRepository,
    ...Strategies,
    ...CommandHandlers,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
