import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

import { UserDto } from '../../account';

@Exclude()
export class LoginResponseDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  public accessToken!: string;

  @Expose()
  @IsObject()
  @IsNotEmpty()
  @Type(() => UserDto)
  @ValidateNested()
  public user!: UserDto;
}
