import { ICommand } from '@nestjs/cqrs';

import { ForgotPasswordDto } from '@xyz/contracts';

export class ForgotPasswordCommand implements ICommand {
  constructor(public readonly payload: ForgotPasswordDto) {}
}
