import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@Exclude()
export class GenericFilterDto {
  @Expose()
  @IsNumber()
  @IsOptional()
  readonly limit?: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  readonly page?: number;

  @Expose()
  @IsString()
  @IsOptional()
  readonly query?: string;
}
