import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserDto } from '@xyz/contracts';
import { LoggerService } from '@xyz/core';

import { UserRepository } from '../../repositories';
import { DeleteUserCommand } from '../impl';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext(DeleteUserHandler.name);
  }

  async execute(command: DeleteUserCommand): Promise<UserDto> {
    try {
      this.loggerService.log('DeleteUserHandler#execute.command', {
        command,
      });

      const { id } = command;
      const user = await this.userRepository.delete({
        id,
      });

      return user;
    } catch (error) {
      this.loggerService.error('DeleteUserHandler#execute.error', {
        error,
      });

      throw error;
    }
  }
}
