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
    const regionIds = req.user.regions.map((region) => region.id);

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

    const userRole = req.user.role;
    if (userRole !== 'SECRETARIO' && userRole !== 'COORDENADOR') {
      throw new ForbiddenException(
        'Você não tem permissão para criar escolas.',
      );
    }

    if (!userHasAccessToRegion(req, schoolData.regionId)) {
      throw new ForbiddenException(
        'Você não tem permissão para criar escolas fora da sua região',
      );
    }
    return this.schoolService.createSchool(schoolData);
  }

  @Get(':id')
  async getSchoolById(@Param('id') id: string, @Req() req: Request) {
    const school = await this.schoolService.getSchoolById(Number(id));

    if (!school) {
      throw new ForbiddenException('Escola não encontrada');
    }

    if (!userHasAccessToRegion(req, school.regionId)) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar essa escola',
      );
    }

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
    const school = await this.schoolService.getSchoolById(Number(id));

    if (!school) {
      throw new ForbiddenException('Escola não encontrada');
    }

    if (!userHasAccessToRegion(req, school.regionId)) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar escolas fora da sua região',
      );
    }

    return this.schoolService.updateSchool(Number(id), schoolData);
  }

  @Delete(':id')
  async deleteSchool(@Param('id') id: string, @Req() req: Request) {
    const school = await this.schoolService.getSchoolById(Number(id));

    if (!school) {
      throw new ForbiddenException('Escola não encontrada');
    }

    const userRole = req.user.role;
    if (userRole !== 'SECRETARIO' && userRole !== 'COORDENADOR') {
      throw new ForbiddenException(
        'Você não tem permissão para deletar escolas.',
      );
    }

    if (!userHasAccessToRegion(req, school.regionId)) {
      throw new ForbiddenException(
        'Você não tem permissão para deletar escolas fora da sua região',
      );
    }

    return this.schoolService.deleteSchool(Number(id));
  }
}
