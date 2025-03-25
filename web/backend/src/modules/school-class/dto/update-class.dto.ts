import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateClassDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsNumber()
  readonly year?: number;

  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;
}
