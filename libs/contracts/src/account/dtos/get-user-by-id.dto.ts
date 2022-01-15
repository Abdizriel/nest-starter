import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class GetUserById {
  @Expose()
  @IsString()
  @IsNotEmpty()
  public id!: string;
}
