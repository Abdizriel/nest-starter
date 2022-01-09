import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

export interface ClassType<T> {
  new (): T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ClassType<T>>
{
  constructor(private readonly classType: ClassType<T>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map((data) => plainToInstance(this.classType, data)));
  }
}
