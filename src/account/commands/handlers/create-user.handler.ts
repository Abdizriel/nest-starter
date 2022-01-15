import bcrypt from 'bcrypt';
import { generate } from 'generate-password';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserDto } from '@xyz/contracts';
import { ConfigService, LoggerService } from '@xyz/core';
import { UserAlreadyExistsException } from '@xyz/exceptions';

import { UserRepository } from '../../repositories';
import { CreateUserCommand } from '../impl';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
  ) {
    this.loggerService.setContext(CreateUserHandler.name);
  }

  async execute(command: CreateUserCommand): Promise<UserDto> {
    this.loggerService.log('CreateUserHandler#execute.command', {
      command,
    });

    const { payload } = command;
    let { password, email } = payload;
    email = email.toLowerCase();

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new UserAlreadyExistsException();

    if (!password) {
      password = generate({
        length: 8,
        numbers: true,
        symbols: true,
        strict: true,
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      this.configService.getNumber('SALT_ROUNDS'),
    );

    return this.userRepository.create({
      ...payload,
      email,
      password: hashedPassword,
      account: {
        create: {},
      },
    });
  }
}
