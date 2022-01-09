import { Response } from 'express';

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  ConfirmResponseDto,
  ForgotPasswordResponseDto,
  LoginDto,
  LoginResponseDto,
  RegisterDto,
  RegisterResponseDto,
  ResetPasswordDto,
  ResetPasswordResponseDto,
} from '@xyz/contracts';
import { LocalAuthGuard, TransformInterceptor } from '@xyz/core';

import { AuthService } from '../services';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @UseInterceptors(new TransformInterceptor(LoginResponseDto))
  @Post('login')
  @ApiBody({
    type: LoginDto,
  })
  @ApiCreatedResponse({
    type: LoginResponseDto,
  })
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(req.user);

    response.cookie('accessToken', result.accessToken);

    return result;
  }

  @Post('register')
  @ApiBody({
    type: RegisterDto,
  })
  @ApiCreatedResponse({
    type: RegisterResponseDto,
  })
  @UseInterceptors(new TransformInterceptor(RegisterResponseDto))
  async register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }

  @Get('confirm/:token')
  @ApiResponse({
    type: ConfirmResponseDto,
  })
  @UseInterceptors(new TransformInterceptor(ConfirmResponseDto))
  async confirm(@Param('token') token: string) {
    return this.authService.confirm(token);
  }

  @Get('forgot-password/:email')
  @ApiResponse({
    type: ForgotPasswordResponseDto,
  })
  @UseInterceptors(new TransformInterceptor(ForgotPasswordResponseDto))
  async forgotPassword(@Param('email') email: string) {
    return this.authService.forgotPassword({
      email,
    });
  }

  @Post('reset-password')
  @ApiBody({
    type: ResetPasswordDto,
  })
  @ApiResponse({
    type: ResetPasswordResponseDto,
  })
  @UseInterceptors(new TransformInterceptor(ResetPasswordResponseDto))
  async resetPassword(@Body() payload: ResetPasswordDto) {
    return this.authService.resetPassword(payload);
  }
}
