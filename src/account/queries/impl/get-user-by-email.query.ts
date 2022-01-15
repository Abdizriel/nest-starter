import { IQuery } from '@nestjs/cqrs';

export class GetUserByEmailQuery implements IQuery {
  constructor(public readonly email: string) {}
}
