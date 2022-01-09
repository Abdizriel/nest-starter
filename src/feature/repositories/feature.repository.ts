import { Feature } from '@prisma/client';

import { Injectable } from '@nestjs/common';

import { PrismaService } from '@xyz/core';

@Injectable()
export class FeatureRepository {
  constructor(private prisma: PrismaService) {}

  async find(): Promise<Feature[]> {
    return this.prisma.feature.findMany({
      where: {
        isActive: true,
      },
    });
  }
}
