import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CommandHandlers } from './commands/handlers';
import { ProfileController } from './controllers';
import { QueryHandlers } from './queries/handlers';
import { UserRepository } from './repositories';
import { UserService } from './services';

@Module({
  imports: [CqrsModule],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    UserService,
    UserRepository,
  ],
  controllers: [ProfileController],
  exports: [UserService],
})
export class AccountModule {}
