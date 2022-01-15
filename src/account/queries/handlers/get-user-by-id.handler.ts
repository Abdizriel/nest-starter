import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UserDto } from '@xyz/contracts';
import { LoggerService } from '@xyz/core';

import { UserRepository } from '../../repositories';
import { GetUserByIdQuery } from '../impl';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext(GetUserByIdHandler.name);
  }

  async execute(command: GetUserByIdQuery): Promise<UserDto> {
    this.loggerService.log('GetUserByIdHandler#execute.command', {
      command,
    });

    const { id } = command;
    const user = await this.userRepository.findOne({
      id,
    });

    return user;
  }
}
