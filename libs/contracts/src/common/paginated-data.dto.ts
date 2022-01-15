import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { PaginatedMeta } from './paginated-meta.dto';

@Exclude()
export class PaginatedDataDto<T = any> {
  @Expose()
  @IsObject({ each: true })
  @IsNotEmpty()
  @ApiProperty()
  readonly items!: T[];

  @Expose()
  @IsObject()
  @IsOptional()
  @ApiProperty()
  @ValidateNested()
  @Type(() => PaginatedMeta)
  readonly meta!: PaginatedMeta;
}
