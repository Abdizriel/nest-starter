import { ICommand } from '@nestjs/cqrs';

import { RegisterDto } from '@xyz/contracts';

export class RegisterCommand implements ICommand {
  constructor(public readonly payload: RegisterDto) {}
}
