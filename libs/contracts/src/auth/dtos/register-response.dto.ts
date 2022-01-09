import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { UserDto } from '../../account';

@Exclude()
export class RegisterResponseDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public accessToken!: string;

  @Expose()
  @IsObject()
  @IsNotEmpty()
  @Type(() => UserDto)
  @ValidateNested()
  public user!: UserDto;
}
