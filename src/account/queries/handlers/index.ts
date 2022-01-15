import { GetUserByEmailHandler } from './get-user-by-email.handler';
import { GetUserByIdHandler } from './get-user-by-id.handler';
import { GetUserHandler } from './get-user.handler';
import { GetUsersHandler } from './get-users.handler';

export const QueryHandlers = [
  GetUserByEmailHandler,
  GetUserByIdHandler,
  GetUserHandler,
  GetUsersHandler,
];
