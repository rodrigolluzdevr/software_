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
  ValidationPipe 
} from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { ClassService } from './school-class.service';
import { Class } from '@prisma/client';
import { Request } from 'express';
import { userHasAccessToSchool } from 'src/utils/school.util';
import { ParseIdPipe } from '../common/pipes/parse-id.pipe';
import { CreateClassDto } from './dto/create-class.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateClassDto } from './dto/update-class.dto';

@Controller('classes')
@UseGuards(RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class ClassController {
  private readonly ADMIN_ROLES = ['DIRETOR'];
  constructor(private readonly classService: ClassService) {}

  @Get()
  @Roles('SECRETARIO', 'COORDENADOR', 'DIRETOR', 'PROFESSOR')
  async getAllClass(@Req() req: Request): Promise<Class[]> {
    if (req.user.role === 'SECRETARIO') {
      return this.classService.getAllClassByOrganization(req.user.organizationId);
    }

    if (req.user.role === 'COORDENADOR') {
      const regionIds = req.user.regions.map(region => region.id);
      return this.classService.getAllClassByRegionIds(regionIds);
    }

    if (req.user.role === 'PROFESSOR') {
      const classIds = req.user.class.map((classItem) => classItem.id);
      return this.classService.getAllClassByClassIds(classIds);
    }

    const schoolIds = this.extractSchoolIds(req);
    return this.classService.getAllClass(schoolIds);
  }

  @Get(':id')
  @Roles('SECRETARIO', 'COORDENADOR', 'DIRETOR', 'PROFESSOR')
  async getClassById(
    @Param('id', ParseIdPipe) id: number,
    @Req() req: Request,
  ): Promise<Class> {
    const schoolClass = await this.findClassOrFail(id);
    this.validateSchoolAccess(req, schoolClass.schoolId, 'acessar');
    return schoolClass;
  }

  @Post()
  @Roles('SECRETARIO', 'COORDENADOR', 'DIRETOR')
  async createClass(
    @Body() createClassDto: CreateClassDto,
    @Req() req: Request,
  ): Promise<Class> {
    this.validateSchoolAccess(req, createClassDto.schoolId, 'criar');
    return this.classService.createClass(createClassDto);
  }

  @Patch(':id')
  @Roles('SECRETARIO', 'COORDENADOR', 'DIRETOR')
  async updateClass(
    @Param('id', ParseIdPipe) id: number,
    @Body() updateClassDto: UpdateClassDto,
    @Req() req: Request,
  ): Promise<Class> {
    const schoolClass = await this.findClassOrFail(id);
    this.validateSchoolAccess(req, schoolClass.schoolId, 'atualizar');
    return this.classService.updateClass(id, updateClassDto);
  }

  @Delete(':id')
  @Roles('SECRETARIO', 'COORDENADOR', 'DIRETOR')
  async deleteClass(
    @Param('id', ParseIdPipe) id: number,
    @Req() req: Request,
  ): Promise<Class> {
    const schoolClass = await this.findClassOrFail(id);
    this.validateSchoolAccess(req, schoolClass.schoolId, 'deletar');
    return this.classService.deleteClass(id);
  }

  // Métodos auxiliares privados
  private extractSchoolIds(req: Request): number[] {
    return req.user.schools.map((school) => school.id);
  }

  private async findClassOrFail(id: number): Promise<Class> {
    const schoolClass = await this.classService.getClassById(id);
    if (!schoolClass) {
      throw new NotFoundException('Turma não encontrada');
    }
    return schoolClass;
  }

  private validateSchoolAccess(req: Request, schoolId: number, action: string): void {
    if (!userHasAccessToSchool(req, schoolId)) {
      throw new ForbiddenException(
        `Usuário não tem permissão para ${action} turmas dessa escola`,
      );
    }
  }
}
