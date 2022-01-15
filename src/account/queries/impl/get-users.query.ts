import { IQuery } from '@nestjs/cqrs';

import { GetUsersDto } from '@xyz/contracts';

export class GetUsersQuery implements IQuery {
  constructor(public readonly payload: GetUsersDto) {}
}
