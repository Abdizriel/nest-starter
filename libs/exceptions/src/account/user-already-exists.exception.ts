import { BadRequestException } from '@nestjs/common';

export class UserAlreadyExistsException extends BadRequestException {
  constructor(error?: string) {
    super({
      type: 'USER_ALREADY_EXISTS',
      message: 'error.user.already_exists',
      error,
    });
  }
}
