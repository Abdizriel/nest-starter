import { BadRequestException } from '@nestjs/common';

export class UserNotFoundException extends BadRequestException {
  constructor(error?: string) {
    super({
      type: 'USER_NOT_FOUND',
      message: 'error.user.not_found',
      error,
    });
  }
}
