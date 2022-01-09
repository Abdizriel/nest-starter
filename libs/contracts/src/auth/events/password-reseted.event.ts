import { UserDto } from '../../account';

export const PasswordResetedEventName = 'auth.password-reseted';

export class PasswordResetedEvent {
  constructor(public readonly user: UserDto) {}
}
