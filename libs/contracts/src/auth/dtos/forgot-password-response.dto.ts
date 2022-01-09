import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty } from 'class-validator';

@Exclude()
export class ForgotPasswordResponseDto {
  @Expose()
  @IsBoolean()
  @IsNotEmpty()
  public success!: boolean;
}
