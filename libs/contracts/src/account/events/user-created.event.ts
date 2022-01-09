import { UserDto } from '..';
import { PrismaEvent } from '../../common';

export class UserCreatedEvent extends PrismaEvent<UserDto> {}
