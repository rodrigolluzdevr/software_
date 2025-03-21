import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseIdPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const id = Number(value);
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('ID deve ser um número válido e positivo');
    }
    return id;
  }
}