import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class LoginDto {
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  public email!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  public password!: string;
}
