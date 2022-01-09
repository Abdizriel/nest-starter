import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UserDto } from '@xyz/contracts';
import { LoggerService } from '@xyz/core';

import { UserRepository } from '../../repositories';
import { GetUserQuery } from '../impl';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext(GetUserHandler.name);
  }

  async execute(command: GetUserQuery): Promise<UserDto> {
    try {
      this.loggerService.log('GetUserHandler#execute.command', {
        command,
      });

      const { id } = command;
      const user = await this.userRepository.findOne({
        id,
      });

      return user;
    } catch (error) {
      this.loggerService.error('GetUserHandler#execute.error', {
        error,
      });

      throw error;
    }
  }
}
