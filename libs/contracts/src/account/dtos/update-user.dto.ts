import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

import { ApiHideProperty } from '@nestjs/swagger';

@Exclude()
export class UpdateUserDto {
  @Expose()
  @IsString()
  @IsOptional()
  public firstName?: string;

  @Expose()
  @IsString()
  @IsOptional()
  public lastName?: string;

  @Expose()
  @IsEmail()
  @IsOptional()
  public email?: string;

  @Exclude()
  @IsBoolean()
  @IsOptional()
  @ApiHideProperty()
  public isConfirmed?: boolean;

  @Exclude()
  @IsString()
  @IsOptional()
  @ApiHideProperty()
  public password?: string;
}
