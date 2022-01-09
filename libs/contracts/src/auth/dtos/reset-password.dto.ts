import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class ResetPasswordDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  public password!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  public token!: string;
}
