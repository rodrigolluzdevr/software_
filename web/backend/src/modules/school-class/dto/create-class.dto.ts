import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateClassDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  readonly year: number;

  @IsNotEmpty()
  @IsNumber()
  readonly schoolId: number;
}
