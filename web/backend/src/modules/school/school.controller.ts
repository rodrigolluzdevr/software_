import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { SchoolService } from './school.service';
import { RolesGuard } from '../auth/roles.guard';

@Controller('schools')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Get()
  @UseGuards(RolesGuard)
  async getAllSchools(@Req() req) {
    // Extrair IDs de todas as regiões do usuário
    const regionIds = req.user.regions.map(region => region.id);
    
    // Passar o array de IDs para buscar todas as escolas
    return this.schoolService.getAllSchools(regionIds);
  }
}