import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UserDto } from '@xyz/contracts';
import { LoggerService } from '@xyz/core';

import { UserRepository } from '../../repositories';
import { GetUserByEmailQuery } from '../impl';

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler
  implements IQueryHandler<GetUserByEmailQuery>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext(GetUserByEmailHandler.name);
  }

  async execute(command: GetUserByEmailQuery): Promise<UserDto> {
    this.loggerService.log('GetUserByEmailHandler#execute.command', {
      command,
    });

    const { email } = command;
    const user = await this.userRepository.findOne({
      email,
    });

    return user;
  }
}
