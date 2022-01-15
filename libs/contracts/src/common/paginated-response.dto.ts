import { Exclude, Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  ValidateNested,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { PaginatedDataDto } from './paginated-data.dto';

@Exclude()
export class PaginatedResponseDto<T = any> {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly code!: number;

  @Expose()
  @IsObject()
  @IsNotEmpty()
  @ApiProperty()
  @ValidateNested()
  readonly data!: PaginatedDataDto<T>;
}
