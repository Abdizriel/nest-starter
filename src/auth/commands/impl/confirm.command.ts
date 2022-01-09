import { ICommand } from '@nestjs/cqrs';

export class ConfirmCommand implements ICommand {
  constructor(public readonly token: string) {}
}
