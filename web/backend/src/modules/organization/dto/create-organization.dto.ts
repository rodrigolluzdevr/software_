import { IsNotEmpty, IsString } from "class-validator";

export class CreateOrganizationDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
