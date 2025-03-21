import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateRegionDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;
}
