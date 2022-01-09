import { Prisma, Token, TokenType } from '@prisma/client';

import { Injectable } from '@nestjs/common';

import { PrismaService } from '@xyz/core';

@Injectable()
export class TokenRepository {
  constructor(private prisma: PrismaService) {}

  async findByToken(token: string, type: TokenType): Promise<Token | null> {
    return this.prisma.token.findFirst({
      where: {
        token,
        type,
        deletedAt: null,
      },
    });
  }

  async create(data: Prisma.TokenCreateInput): Promise<Token> {
    return this.prisma.token.create({
      data,
    });
  }

  async update(id: string, data: Prisma.TokenUpdateInput): Promise<Token> {
    return this.prisma.token.update({
      where: { id },
      data,
    });
  }
}
