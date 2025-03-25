import { IsBoolean, IsOptional, IsString } from "class-validator";


export class UpdateOrganizationDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;
}