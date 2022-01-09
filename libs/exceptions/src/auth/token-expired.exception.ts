import { BadRequestException } from '@nestjs/common';

export class TokenExpiredException extends BadRequestException {
  constructor(error?: string) {
    super({
      type: 'TOKEN_EXPIRED',
      message: 'error.token.expired',
      error,
    });
  }
}
