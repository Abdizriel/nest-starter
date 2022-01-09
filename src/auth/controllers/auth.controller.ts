import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
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
import { LocalAuthGuard } from '@xyz/core';

import { AuthService } from '../services';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({
    type: LoginDto,
  })
  @ApiCreatedResponse({
    type: LoginResponseDto,
  })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiBody({
    type: RegisterDto,
  })
  @ApiCreatedResponse({
    type: RegisterResponseDto,
  })
  async register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }

  @Get('confirm/:token')
  @ApiResponse({
    type: ConfirmResponseDto,
  })
  async confirm(@Param('token') token: string) {
    return this.authService.confirm(token);
  }

  @Get('forgot-password/:email')
  @ApiResponse({
    type: ForgotPasswordResponseDto,
  })
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
  async resetPassword(@Body() payload: ResetPasswordDto) {
    return this.authService.resetPassword(payload);
  }
}
