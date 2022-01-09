import { BadRequestException } from '@nestjs/common';

export class TokenInvalidException extends BadRequestException {
  constructor(error?: string) {
    super({
      type: 'TOKEN_INVALID',
      message: 'error.token.invalid',
      error,
    });
  }
}
