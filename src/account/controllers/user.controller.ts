import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreateUserDto, UpdateUserDto, UserDto } from '@xyz/contracts';
import { JwtAuthGuard, LoggerService, TransformInterceptor } from '@xyz/core';

import { UserService } from '../services';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    private loggerService: LoggerService,
    private userService: UserService,
  ) {
    this.loggerService.setContext(UserController.name);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(UserDto))
  @ApiBearerAuth()
  @Get(':id')
  public async getUser(@Param('id') id: string) {
    this.loggerService.info('UserController#getUser.call');

    const result = await this.userService.getUserById(id);

    this.loggerService.info('UserController#getUser.result', result);

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(UserDto))
  @ApiBearerAuth()
  @Get()
  public async getUsers(
    @Query('limit') limit = 10,
    @Query('page') page = 1,
    @Query('query') query?: string,
  ) {
    this.loggerService.info('UserController#getUsers.call');

    const result = await this.userService.getUsers({
      limit,
      page,
      query,
    });

    this.loggerService.info('UserController#getUsers.result', result);

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(UserDto))
  @ApiBearerAuth()
  @Patch(':id')
  public async updateUser(
    @Param('id') id: string,
    @Body() payload: UpdateUserDto,
  ) {
    this.loggerService.info('UserController#updateUser.call');

    const result = await this.userService.updateUser(id, payload);

    this.loggerService.info('UserController#updateUser.result', result);

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(UserDto))
  @ApiBearerAuth()
  @Post()
  public async createUser(@Request() req, @Body() payload: CreateUserDto) {
    this.loggerService.info('UserController#createUser.call');

    const result = await this.userService.createUser(payload);

    this.loggerService.info('UserController#createUser.result', result);

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(UserDto))
  @ApiBearerAuth()
  @Delete(':id')
  public async deleteUser(@Param('id') id: string) {
    this.loggerService.info('UserController#deleteUser.call');

    const result = await this.userService.deleteUser(id);

    this.loggerService.info('UserController#deleteUser.result', result);

    return result;
  }
}
