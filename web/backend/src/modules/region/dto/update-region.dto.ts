import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRegionDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsNumber()
  readonly isActive?: number;
}
