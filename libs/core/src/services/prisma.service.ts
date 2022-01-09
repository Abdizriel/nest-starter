import { Prisma, PrismaClient } from '@prisma/client';
import {
  PrismaEventDispatcher,
  PrismaEventDispatcherOptions,
} from 'prisma-event-dispatcher';

import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private eventEmmiter: EventEmitter2) {
    super();

    const softDeletable: Prisma.ModelName[] = ['Account', 'Token', 'User'];
    const emitterModels: Prisma.ModelName[] = ['User'];

    const options: PrismaEventDispatcherOptions = {
      models: emitterModels,
      actions: ['create', 'update', 'delete'],
      when: ['after', 'before'],
    };

    this.$use(async (params, next) => {
      return await PrismaEventDispatcher.setup(
        options,
        this.eventEmmiter,
      ).dispatch(params, next);
    });

    this.$use(async (params, next) => {
      // Check incoming query type
      if (softDeletable.includes(params.model)) {
        if (params.action == 'delete') {
          params.action = 'update';
          params.args['data'] = { deletedAt: new Date() };
        }
        if (params.action == 'deleteMany') {
          params.action = 'updateMany';
          if (params.args.data != undefined) {
            params.args.data['deletedAt'] = new Date();
          } else {
            params.args['data'] = { deletedAt: new Date() };
          }
        }
      }
      return next(params);
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
