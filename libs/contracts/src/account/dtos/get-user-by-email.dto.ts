import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

@Exclude()
export class GetUserByEmail {
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  public email!: string;
}
