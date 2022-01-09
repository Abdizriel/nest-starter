import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class ForgotPasswordDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  public email!: string;
}
