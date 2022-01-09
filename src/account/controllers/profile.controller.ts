import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UpdateUserDto, UserDto } from '@xyz/contracts';
import { JwtAuthGuard, LoggerService, TransformInterceptor } from '@xyz/core';

import { UserService } from '../services';

@ApiTags('User')
@Controller('profile')
export class ProfileController {
  constructor(
    private loggerService: LoggerService,
    private userService: UserService,
  ) {
    this.loggerService.setContext(ProfileController.name);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(UserDto))
  @ApiBearerAuth()
  @Get()
  public async getProfile(@Request() req) {
    this.loggerService.info('ProfileController#getProfile.call');

    const result = await this.userService.getUser(req.user.id);

    this.loggerService.info('ProfileController#getProfile.result', result);

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(UserDto))
  @ApiBearerAuth()
  @Patch()
  public async updateUser(@Request() req, @Body() payload: UpdateUserDto) {
    this.loggerService.info('ProfileController#updateUser.call');

    const result = await this.userService.updateUser(req.user.id, payload);

    this.loggerService.info('ProfileController#updateUser.result', result);

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(UserDto))
  @ApiBearerAuth()
  @Delete()
  public async deleteUser(@Request() req) {
    this.loggerService.info('ProfileController#deleteUser.call');

    const result = await this.userService.deleteUser(req.user.id);

    this.loggerService.info('ProfileController#deleteUser.result', result);

    return result;
  }
}
