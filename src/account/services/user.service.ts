import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { UpdateUserDto, UserDto } from '@xyz/contracts';
import { LoggerService } from '@xyz/core';

import { DeleteUserCommand, UpdateUserCommand } from '../commands/impl';
import { GetUserQuery } from '../queries/impl';

@Injectable()
export class UserService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext(UserService.name);
  }

  public async getUser(id: string): Promise<UserDto | null> {
    this.loggerService.info('UserService#getUser.call', {
      id,
    });

    const result = await this.queryBus.execute<GetUserQuery, UserDto | null>(
      new GetUserQuery(id),
    );

    this.loggerService.info('UserService#getUser.result', result);

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
