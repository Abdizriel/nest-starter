import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsOptional, IsString } from 'class-validator';

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
}
