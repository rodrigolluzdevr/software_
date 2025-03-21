import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { RolesGuard } from '../auth/roles.guard';
import {
  getRegionIdFromRequest,
  userHasAccessToRegion,
} from 'src/utils/region.util';
import { Request } from 'express';

@Controller('schools')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Get()
  @UseGuards(RolesGuard)
  async getAllSchools(@Req() req) {
    // Extrair IDs de todas as regiões do usuário
    const regionIds = req.user.regions.map((region) => region.id);

    // Passar o array de IDs para buscar todas as escolas
    return this.schoolService.getAllSchools(regionIds);
  }

  @Post()
  async createSchool(
    @Body()
    schoolData: {
      name: string;
      regionId: number;
    },
    @Req() req: Request,
  ) {
    // Extrair o ID da região do usuário
    const regionId = getRegionIdFromRequest(req);

    // Verificar se o usuário tem permissões para criar escolas
    const userRole = req.user.role;
    if (userRole !== 'SECRETARIO' && userRole !== 'COORDENADOR') {
      throw new ForbiddenException(
        'Você não tem permissão para criar escolas.',
      );
    }
    if (schoolData.regionId !== regionId) {
      throw new ForbiddenException(
        'Você não tem permissão para criar escolas fora da sua região.',
      );
    }
    // Criar a escola
    return this.schoolService.createSchool(schoolData);
  }

  @Get(':id')
  async getSchoolById(@Param('id') id: string, @Req() req: Request) {
    // Buscar a escola
    const school = await this.schoolService.getSchoolById(Number(id));

    // Verificar se a escola existe
    if (!school) {
      throw new ForbiddenException('Escola não encontrada');
    }

    // Verificar se o usuário tem permissões para acessar a escola
    if (!userHasAccessToRegion(req, school.regionId)) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar essa escola',
      );
    }

    // Retornar a escola
    return school;
  }

  @Patch(':id')
  async updateSchool(
    @Param('id') id: string,
    @Body()
    schoolData: {
      name: string;
      isActive: boolean;
    },
    @Req() req: Request,
  ) {
    // Buscar a escola
    const school = await this.schoolService.getSchoolById(Number(id));

    // Verificar se a escola existe
    if (!school) {
      throw new ForbiddenException('Escola não encontrada');
    }

    // Verificar se o usuário tem acesso à região da escola
    if (!userHasAccessToRegion(req, school.regionId)) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar escolas fora da sua região',
      );
    }

    // Atualizar a escola
    return this.schoolService.updateSchool(Number(id), schoolData);
  }

  @Delete(':id')
  async deleteSchool(@Param('id') id: string, @Req() req: Request) {
    // Buscar a escola
    const school = await this.schoolService.getSchoolById(Number(id));

    // Verificar se a escola existe
    if (!school) {
      throw new ForbiddenException('Escola não encontrada');
    }

    // Verificar se o usuário tem permissões para deletar escolas
    const userRole = req.user.role;
    if (userRole !== 'SECRETARIO' && userRole !== 'COORDENADOR') {
      throw new ForbiddenException(
        'Você não tem permissão para deletar escolas.',
      );
    }

    // Verificar se o usuário tem acesso à região da escola
    if (!userHasAccessToRegion(req, school.regionId)) {
      throw new ForbiddenException(
        'Você não tem permissão para deletar escolas fora da sua região',
      );
    }

    // Deletar a escola
    return this.schoolService.deleteSchool(Number(id));
  }
}
