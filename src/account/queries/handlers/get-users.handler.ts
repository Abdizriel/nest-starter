import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UserDto } from '@xyz/contracts';
import { LoggerService } from '@xyz/core';

import { UserFindOptions, UserRepository } from '../../repositories';
import { GetUsersQuery } from '../impl';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext(GetUsersHandler.name);
  }

  async execute(command: GetUsersQuery): Promise<[UserDto[], number]> {
    this.loggerService.log('GetUsersHandler#execute.command', {
      command,
    });

    const { limit, page, query } = command.payload;

    const filter: UserFindOptions = {
      take: limit,
      skip: (page - 1) * limit,
    };

    if (query) {
      filter.where = {
        OR: [
          {
            firstName: { contains: query },
          },
          {
            lastName: { contains: query },
          },
          {
            email: { contains: query },
          },
        ],
      };
    }

    console.log('filter', filter);

    const users = await this.userRepository.find(filter);
    const count = await this.userRepository.count(filter);

    return [users, count];
  }
}
