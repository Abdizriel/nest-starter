import { UserDto } from '../../account';

export const RegisteredEventName = 'auth.registered';

export class RegisteredEvent {
  constructor(public readonly user: UserDto, public readonly token: string) {}
}
