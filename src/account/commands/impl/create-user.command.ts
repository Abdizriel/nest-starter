import { ICommand } from '@nestjs/cqrs';

import { CreateUserDto } from '@xyz/contracts';

export class CreateUserCommand implements ICommand {
  constructor(public readonly payload: CreateUserDto) {}
}
