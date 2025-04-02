import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { RolesGuard } from '../auth/roles.guard';
import { userHasAccessToRegion } from 'src/utils/region.util';
import { Request } from 'express';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { ParseIdPipe } from '../common/pipes/parse-id.pipe';
import { Roles } from '../auth/decorators/roles.decorator';
import { School } from '@prisma/client';

@Controller('schools')
@UseGuards(RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class SchoolController {
  private readonly ADMIN_ROLES = ['SECRETARIO', 'COORDENADOR'];

  constructor(private readonly schoolService: SchoolService) {}

  @Get()
  @Roles('SECRETARIO', 'COORDENADOR', 'DIRETOR', 'PROFESSOR')
  async getAllSchools(@Req() req: Request): Promise<School[]> {
    if (req.user.role === 'SECRETARIO') {
      return this.schoolService.getAllSchoolsByOrganization(req.user.organizationId);
    }
    if (req.user.role === 'DIRETOR', 'PROFESSOR') {
      const schoolIds = req.user.schools.map((school) => school.id);
      return this.schoolService.getAllSchools(schoolIds);
    }
    const regionIds = this.extractRegionIds(req);
    return this.schoolService.getAllSchools(regionIds);
  }

  @Get(':id')
  @Roles('SECRETARIO', 'COORDENADOR', 'DIRETOR', 'PROFESSOR')
  async getSchoolById(
    @Param('id', ParseIdPipe) id: number,
    @Req() req: Request,
  ): Promise<School> {
    const school = await this.findSchoolOrFail(id);
    this.validateRegionAccess(req, school.regionId, 'acessar');
    return school;
  }

  @Post()
  @Roles('SECRETARIO', 'COORDENADOR')
  async createSchool(
    @Body() createSchoolDto: CreateSchoolDto,
    @Req() req: Request,
  ): Promise<School> {
    this.validateRegionAccess(req, createSchoolDto.regionId, 'criar');
    return this.schoolService.createSchool(createSchoolDto);
  }

  @Patch(':id')
  @Roles('SECRETARIO', 'COORDENADOR')
  async updateSchool(
    @Param('id', ParseIdPipe) id: number,
    @Body() updateSchoolDto: UpdateSchoolDto,
    @Req() req: Request,
  ): Promise<School> {
    const school = await this.findSchoolOrFail(id);
    this.validateRegionAccess(req, school.regionId, 'atualizar');
    return this.schoolService.updateSchool(id, updateSchoolDto);
  }

  @Delete(':id')
  @Roles('SECRETARIO', 'COORDENADOR')
  async deleteSchool(
    @Param('id', ParseIdPipe) id: number,
    @Req() req: Request,
  ): Promise<School> {
    const school = await this.findSchoolOrFail(id);
    this.validateRegionAccess(req, school.regionId, 'deletar');
    return this.schoolService.deleteSchool(id);
  }

  // Métodos auxiliares privados
  private extractRegionIds(req: Request): number[] {
    return req.user.regions.map((region) => region.id);
  }

  private async findSchoolOrFail(id: number): Promise<School> {
    const school = await this.schoolService.getSchoolById(id);
    if (!school) {
      throw new NotFoundException('Escola não encontrada');
    }
    return school;
  }

  private validateRegionAccess(req: Request, regionId: number, action: string): void {
    if (req.user.role === 'SECRETARIO') {
      return;
    }
    if (!userHasAccessToRegion(req, regionId)) {
      throw new ForbiddenException(
        `Você não tem permissão para ${action} escolas fora da sua região`,
      );
    }
  }
}