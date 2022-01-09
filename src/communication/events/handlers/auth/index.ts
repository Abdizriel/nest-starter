import { ConfirmedHandler } from './confirmed.handler';
import { ForgotPasswordHandler } from './forgot-password.handler';
import { PasswordResetedHandler } from './password-reseted.handler';
import { RegisteredHandler } from './registered.handler';

export const EventHandlers = [
  ConfirmedHandler,
  ForgotPasswordHandler,
  RegisteredHandler,
  PasswordResetedHandler,
];
