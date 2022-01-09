import { User } from '@prisma/client';
import bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

import {
  ConfirmResponseDto,
  ForgotPasswordDto,
  ForgotPasswordResponseDto,
  LoginResponseDto,
  RegisterDto,
  RegisterResponseDto,
  ResetPasswordDto,
  ResetPasswordResponseDto,
  UserDto,
} from '@xyz/contracts';
import { LoggerService } from '@xyz/core';

import {
  ConfirmCommand,
  ForgotPasswordCommand,
  RegisterCommand,
  ResetPasswordCommand,
} from '../commands/impl';
import { UserRepository } from '../repositories';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private loggerService: LoggerService,
    private commandBus: CommandBus,
  ) {
    this.loggerService.setContext(AuthService.name);
  }

  async validateUser(email: string, plainPassword: string): Promise<UserDto> {
    this.loggerService.info('AuthService#validateUser.call', {
      email,
    });

    const user = await this.userRepository.findOne({
      email,
    });
    if (!user) {
      this.loggerService.info('AuthService#validateUser - user not exist');
      return null;
    }

    const isSame = await bcrypt.compare(plainPassword, user.password);
    if (!isSame) {
      this.loggerService.info('AuthService#validateUser - password not match');
      return null;
    }

    this.loggerService.info('AuthService#validateUser - user valdiated', {
      user,
    });
    return user;
  }

  async getById(id: string): Promise<UserDto> {
    this.loggerService.info('AuthService#getById.call', {
      id,
    });
    const user = await this.userRepository.findOne({
      id,
    });
    if (!user) {
      this.loggerService.info('AuthService#getById - user not exist');
      return null;
    }

    this.loggerService.info('AuthService#getById - user', {
      user,
    });
    return user;
  }

  async login(user: User): Promise<LoginResponseDto> {
    const payload = { sub: user.id };

    this.loggerService.info('AuthService#login - user', {
      user,
    });

    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  public async register(payload: RegisterDto): Promise<RegisterResponseDto> {
    this.loggerService.info('AuthService#register.call', {
      payload,
    });

    const user = await this.commandBus.execute<RegisterCommand, UserDto>(
      new RegisterCommand(payload),
    );

    const tokenPayload = { sub: user.id };

    this.loggerService.info('AuthService#register - user', {
      user,
    });

    return {
      accessToken: this.jwtService.sign(tokenPayload),
      user,
    };
  }

  public async confirm(token: string): Promise<ConfirmResponseDto> {
    this.loggerService.info('AuthService#confirm.call', {
      token,
    });

    await this.commandBus.execute<ConfirmCommand, UserDto>(
      new ConfirmCommand(token),
    );

    return {
      success: true,
    };
  }

  public async forgotPassword(
    payload: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto> {
    this.loggerService.info('AuthService#forgotPassword.call', {
      payload,
    });

    await this.commandBus.execute<ForgotPasswordCommand>(
      new ForgotPasswordCommand(payload),
    );

    return {
      success: true,
    };
  }

  public async resetPassword(
    payload: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto> {
    this.loggerService.info('AuthService#resetPassword.call', {
      payload,
    });

    return this.commandBus.execute<
      ResetPasswordCommand,
      ResetPasswordResponseDto
    >(new ResetPasswordCommand(payload));
  }
}
