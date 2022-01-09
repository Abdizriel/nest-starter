import { UserDto } from '../../account';

export const ForgotPasswordEventName = 'auth.forgot-password';

export class ForgotPasswordEvent {
  constructor(public readonly user: UserDto, public readonly token: string) {}
}
