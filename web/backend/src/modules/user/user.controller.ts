import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  ForbiddenException,
  NotFoundException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import type { Role } from '@prisma/client';
import { Request } from 'express';
import { RolesGuard } from '../auth/roles.guard';
import { getOrganizationIdFromRequest } from 'src/utils/organization.util';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('SECRETARIO', 'COORDENADOR', 'DIRETOR', 'PROFESSOR')
  async getAllUsers(@Req() req: Request) {
    if (req.user.role === 'COORDENADOR') {
      // Regions
      const regionIds = req.user.regions.map((region) => region.id);
      
      const usersFromRegions = await this.userService.getAllUsersByRegionIds(regionIds);
      
      // Schools
      const schools = await this.userService.getSchoolsByRegionIds(regionIds);
      const schoolIds = schools.map(school => school.id);
      
      const usersFromSchools = await this.userService.getUsersBySchoolIds(schoolIds);
      
      // Classes
      const classes = await this.userService.getClassesBySchoolIds(schoolIds);
      const classIds = classes.map(cls => cls.id);
      
      const usersFromClasses = await this.userService.getAllUsersByClassIds(classIds);
      
      // Remove results duplicates
      const allUsers = [...usersFromRegions, ...usersFromSchools, ...usersFromClasses];
      
      const uniqueUsers = Array.from(
        new Map(allUsers.map(user => [user.id, user])).values()
      );
      
      return uniqueUsers;
    }

    if (req.user.role === 'DIRETOR') {
      // Schools
      const schoolIds = [...new Set(req.user.schools.map((school) => school.id))] as number[];
      
      const usersFromSchools = await this.userService.getUsersBySchoolIds(schoolIds);
      
      // Classes
      const classes = await this.userService.getClassesBySchoolIds(schoolIds);
      
      if (classes.length === 0) {
        return usersFromSchools;
      }
      
      const classIds = classes.map((cls) => cls.id);
      const usersFromClasses = await this.userService.getAllUsersByClassIds(classIds);
      
      // Remove results duplicates
      const allUsers = [...usersFromSchools, ...usersFromClasses];
      
      const uniqueUsers = Array.from(
        new Map(allUsers.map(user => [user.id, user])).values()
      );
      
      return uniqueUsers;
    }

    if (req.user.role === 'PROFESSOR') {
      const classIds = req.user.class.map((classItem) => classItem.id);
      return this.userService.getAllUsersByClassIds(classIds);
    }

    const organizationId = getOrganizationIdFromRequest(req);
    return this.userService.getAllUsersByOrganization(organizationId);
  }

  @Get(':id')
  @Roles('SECRETARIO', 'COORDENADOR', 'DIRETOR', 'PROFESSOR')
  async getUserById(@Param('id') id: string, @Req() req: Request) {
    // Busca o usuário pelo ID
    const targetUser = await this.userService.getUserById(Number(id));
    
    if (!targetUser) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    if (req.user.role === 'SECRETARIO') {
      //Organization
      const organizationId = getOrganizationIdFromRequest(req);
      if (targetUser.organizationId === organizationId) {
        return targetUser;
      }
      throw new ForbiddenException('Sem permissão para acessar este usuário');
    }
    

    if (req.user.role === 'COORDENADOR') {
      // Regions
      const regionIds = req.user.regions.map((region) => region.id);
      
      const isInRegions = await this.userService.isUserInRegions(Number(id), regionIds);
      if (isInRegions) return targetUser;
      
      // Schools
      const schools = await this.userService.getSchoolsByRegionIds(regionIds);
      const schoolIds = schools.map(school => school.id);
      const isInSchools = await this.userService.isUserInSchools(Number(id), schoolIds);
      if (isInSchools) return targetUser;
      
      // Classes
      const classes = await this.userService.getClassesBySchoolIds(schoolIds);
      const classIds = classes.map(cls => cls.id);
      const isInClasses = await this.userService.isUserInClasses(Number(id), classIds);
      if (isInClasses) return targetUser;
      
      throw new ForbiddenException('Sem permissão para acessar este usuário');
    }
    
    if (req.user.role === 'DIRETOR') {
      //Schools
      const schoolIds = [...new Set(req.user.schools.map((school) => school.id))] as number[];
      
      const isInSchools = await this.userService.isUserInSchools(Number(id), schoolIds);
      if (isInSchools) return targetUser;
      
      // Classes
      const classes = await this.userService.getClassesBySchoolIds(schoolIds);
      const classIds = classes.map(cls => cls.id);
      const isInClasses = await this.userService.isUserInClasses(Number(id), classIds);
      if (isInClasses) return targetUser;
      
      throw new ForbiddenException('Sem permissão para acessar este usuário');
    }
    
    if (req.user.role === 'PROFESSOR') {
      //Classes
      const classIds = req.user.class.map((classItem) => classItem.id);
      const isInClasses = await this.userService.isUserInClasses(Number(id), classIds);
      
      if (isInClasses) {
        return targetUser;
      }
      throw new ForbiddenException('Sem permissão para acessar este usuário');
    }
    
    const organizationId = getOrganizationIdFromRequest(req);
    if (targetUser.organizationId === organizationId) {
      return targetUser;
    }
    
    throw new ForbiddenException('Sem permissão para acessar este usuário');
  }

  @Post()
  @Roles('SECRETARIO', 'COORDENADOR', 'DIRETOR')
  async createUser(
    @Body()
    userData: {
      cpf: string;
      password: string;
      name: string;
      role: Role;
      email: string;
      address: string;
      cep: string;
      numberAdress: string;
      organizationId: number;
      registrationNumber?: string;
      birthDate?: string | Date;
      specialization?: string;
      hireDate?: string | Date;
      isActive?: boolean;
    },
    @Req() req: Request,
  ) {
    const userRole = req.user.role;
    if (
      userRole !== 'ADMIN' &&
      userData.organizationId !== getOrganizationIdFromRequest(req)
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para criar usuários fora da sua organização',
      );
    }
    return this.userService.createUser(userData);
  }

  @Patch(':id')
  @Roles('SECRETARIO', 'COORDENADOR', 'DIRETOR',)
  async updateUser(
    @Param('id') id: string,
    @Body()
    userData: {
      cpf?: string;
      password?: string;
      name?: string;
      role?: Role;
      email?: string;
      address?: string;
      cep?: string;
      numberAdress?: string;
      organizationId?: number;
      registrationNumber?: string;
      birthDate?: string | Date;
      specialization?: string;
      hireDate?: string | Date;
      isActive?: boolean;
    },
    @Req() req: Request,
  ) {
    const userRole = req.user.role;
    const user = await this.userService.getUserById(Number(id));
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    if (
      userRole !== 'ADMIN' &&
      user.organizationId !== getOrganizationIdFromRequest(req)
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar usuários fora da sua organização',
      );
    }
    return this.userService.updateUser(Number(id), userData);
  }

  @Delete(':id')
  @Roles('SECRETARIO', 'COORDENADOR', 'DIRETOR', 'PROFESSOR')
  async deleteUser(@Param('id') id: string, @Req() req: Request) {
    const userRole = req.user.role;
    const user = await this.userService.getUserById(Number(id));
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    if (
      userRole !== 'ADMIN' &&
      user.organizationId !== getOrganizationIdFromRequest(req)
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para deletar usuários fora da sua organização',
      );
    }
    return this.userService.deleteUser(Number(id));
  }
}
