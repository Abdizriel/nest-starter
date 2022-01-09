import { UserDto } from '../../account';

export const ConfirmedEventName = 'auth.confirmed';

export class ConfirmedEvent {
  constructor(public readonly user: UserDto) {}
}
