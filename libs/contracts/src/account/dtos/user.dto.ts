import { UserRole } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { ApiHideProperty } from '@nestjs/swagger';

@Exclude()
export class UserDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  public id!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  public firstName!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  public lastName!: string;

  @Expose()
  @IsEmail()
  @IsNotEmpty()
  public email!: string;

  @Expose()
  @IsEnum(UserRole)
  @IsNotEmpty()
  public role!: UserRole;

  @Exclude()
  @IsString()
  @IsNotEmpty()
  @ApiHideProperty()
  public password!: string;
}
