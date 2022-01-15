import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { UserDto } from '.';
import { PaginatedMeta } from '../../common';

@Exclude()
export class GetUsersResponseDto {
  @Expose()
  @IsObject({ each: true })
  @IsNotEmpty()
  @ApiProperty()
  @ValidateNested()
  @Type(() => UserDto)
  readonly items!: UserDto[];

  @Expose()
  @IsObject()
  @IsOptional()
  @ApiProperty()
  @ValidateNested()
  @Type(() => PaginatedMeta)
  readonly meta!: PaginatedMeta;
}
