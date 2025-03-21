import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRegionDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  readonly organizationId: number;
}
