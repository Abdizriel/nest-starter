import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import {
  CreateUserDto,
  GetUsersDto,
  UpdateUserDto,
  UserDto,
} from '@xyz/contracts';
import { PaginatedDataDto } from '@xyz/contracts/common';
import { LoggerService } from '@xyz/core';

import {
  CreateUserCommand,
  DeleteUserCommand,
  UpdateUserCommand,
} from '../commands/impl';
import {
  GetUserByEmailQuery,
  GetUserByIdQuery,
  GetUsersQuery,
} from '../queries/impl';

@Injectable()
export class UserService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext(UserService.name);
  }

  public async getUserById(id: string): Promise<UserDto | null> {
    this.loggerService.info('UserService#getUserById.call', {
      id,
    });

    const result = await this.queryBus.execute<
      GetUserByIdQuery,
      UserDto | null
    >(new GetUserByIdQuery(id));

    this.loggerService.info('UserService#getUserById.result', result);

    return result;
  }

  public async getUserByEmail(email: string): Promise<UserDto | null> {
    this.loggerService.info('UserService#getUserByEmail.call', {
      email,
    });

    const result = await this.queryBus.execute<
      GetUserByEmailQuery,
      UserDto | null
    >(new GetUserByEmailQuery(email));

    this.loggerService.info('UserService#getUserByEmail.result', result);

    return result;
  }

  public async getUsers(
    payload: GetUsersDto,
  ): Promise<PaginatedDataDto<UserDto>> {
    this.loggerService.info('UserService#getUsers.call');

    const { limit, page } = payload;

    const result = await this.queryBus.execute<
      GetUsersQuery,
      [UserDto[], number]
    >(new GetUsersQuery(payload));

    this.loggerService.info('UserService#getUsers.result', result);

    return {
      items: result[0],
      meta: {
        limit,
        page,
        count: result[1],
      },
    };
  }

  public async createUser(payload: CreateUserDto): Promise<UserDto> {
    this.loggerService.info('UserService#createUser.call', {
      payload,
    });

    const result = await this.commandBus.execute<CreateUserCommand, UserDto>(
      new CreateUserCommand(payload),
    );

    this.loggerService.info('UserService#createUser.result', result);

    return result;
  }

  public async updateUser(
    id: string,
    payload: UpdateUserDto,
  ): Promise<UserDto> {
    this.loggerService.info('UserService#updateUser.call', {
      payload,
    });

    const result = await this.commandBus.execute<UpdateUserCommand, UserDto>(
      new UpdateUserCommand(id, payload),
    );

    this.loggerService.info('UserService#updateUser.result', result);

    return result;
  }

  public async deleteUser(id: string): Promise<UserDto> {
    this.loggerService.info('UserService#deleteUser.call', {
      id,
    });

    const result = await this.commandBus.execute<DeleteUserCommand, UserDto>(
      new DeleteUserCommand(id),
    );

    this.loggerService.info('UserService#deleteUser.result', result);

    return result;
  }
}
