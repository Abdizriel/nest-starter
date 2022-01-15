import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class PaginatedMeta {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly limit: number;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly page: number;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly count: number;
}
