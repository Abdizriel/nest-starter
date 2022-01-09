import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserDto } from '@xyz/contracts';
import { LoggerService } from '@xyz/core';

import { UserRepository } from '../../repositories';
import { UpdateUserCommand } from '../impl';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext(UpdateUserHandler.name);
  }

  async execute(command: UpdateUserCommand): Promise<UserDto> {
    try {
      this.loggerService.log('UpdateUserHandler#execute.command', {
        command,
      });

      const { id, payload } = command;
      const user = await this.userRepository.update({
        where: {
          id,
        },
        data: payload,
      });

      return user;
    } catch (error) {
      this.loggerService.error('UpdateUserHandler#execute.error', {
        error,
      });

      throw error;
    }
  }
}
