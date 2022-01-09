import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class FeatureDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  public id!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @Expose()
  @IsBoolean()
  @IsNotEmpty()
  public isActive!: boolean;
}
