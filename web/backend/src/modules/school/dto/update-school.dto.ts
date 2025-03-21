import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateSchoolDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;
}