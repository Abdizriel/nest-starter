import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@Exclude()
export class RegisterDto {
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
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  public password!: string;
}
