import type { PrismaAction } from 'prisma-event-dispatcher';

export class PrismaEvent<T = any> {
  model?: string;
  action: PrismaAction;
  args: {
    data: T;
  };
  dataPath: string[];
  runInTransaction: boolean;
}
