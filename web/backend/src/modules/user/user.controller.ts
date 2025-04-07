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
      // regions
      const regionIds = req.user.regions.map((region) => region.id);
      
      const usersFromRegions = await this.userService.getAllUsersByRegionIds(regionIds);
      
      // schools
      const schools = await this.userService.getSchoolsByRegionIds(regionIds);
      const schoolIds = schools.map(school => school.id);
      
      const usersFromSchools = await this.userService.getUsersBySchoolIds(schoolIds);
      
      // classes
      const classes = await this.userService.getClassesBySchoolIds(schoolIds);
      const classIds = classes.map(cls => cls.id);
      
      const usersFromClasses = await this.userService.getAllUsersByClassIds(classIds);
      
      // remove results duplicates
      const allUsers = [...usersFromRegions, ...usersFromSchools, ...usersFromClasses];
      
      const uniqueUsers = Array.from(
        new Map(allUsers.map(user => [user.id, user])).values()
      );
      
      return uniqueUsers;
    }

    if (req.user.role === 'DIRETOR') {
      // schools
      const schoolIds = [...new Set(req.user.schools.map((school) => school.id))] as number[];
      
      const usersFromSchools = await this.userService.getUsersBySchoolIds(schoolIds);
      
      // classes
      const classes = await this.userService.getClassesBySchoolIds(schoolIds);
      
      if (classes.length === 0) {
        return usersFromSchools;
      }
      
      const classIds = classes.map((cls) => cls.id);
      const usersFromClasses = await this.userService.getAllUsersByClassIds(classIds);
      
      // remove results duplicates
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
    // busca o usuário pelo ID
    const targetUser = await this.userService.getUserById(Number(id));
    
    if (!targetUser) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    if (req.user.role === 'SECRETARIO') {
      // organization
      const organizationId = getOrganizationIdFromRequest(req);
      if (targetUser.organizationId === organizationId) {
        return targetUser;
      }
      throw new ForbiddenException('Sem permissão para acessar este usuário');
    }
    

    if (req.user.role === 'COORDENADOR') {
      // regions
      const regionIds = req.user.regions.map((region) => region.id);
      
      const isInRegions = await this.userService.isUserInRegions(Number(id), regionIds);
      if (isInRegions) return targetUser;
      
      // schools
      const schools = await this.userService.getSchoolsByRegionIds(regionIds);
      const schoolIds = schools.map(school => school.id);
      const isInSchools = await this.userService.isUserInSchools(Number(id), schoolIds);
      if (isInSchools) return targetUser;
      
      // classes
      const classes = await this.userService.getClassesBySchoolIds(schoolIds);
      const classIds = classes.map(cls => cls.id);
      const isInClasses = await this.userService.isUserInClasses(Number(id), classIds);
      if (isInClasses) return targetUser;
      
      throw new ForbiddenException('Sem permissão para acessar este usuário');
    }
    
    if (req.user.role === 'DIRETOR') {
      //schools
      const schoolIds = [...new Set(req.user.schools.map((school) => school.id))] as number[];
      
      const isInSchools = await this.userService.isUserInSchools(Number(id), schoolIds);
      if (isInSchools) return targetUser;
      
      // classes
      const classes = await this.userService.getClassesBySchoolIds(schoolIds);
      const classIds = classes.map(cls => cls.id);
      const isInClasses = await this.userService.isUserInClasses(Number(id), classIds);
      if (isInClasses) return targetUser;
      
      throw new ForbiddenException('Sem permissão para acessar este usuário');
    }
    
    if (req.user.role === 'PROFESSOR') {
      // classes
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
    const orgId = getOrganizationIdFromRequest(req);
    
    // verificação básica de organização para todos
    if (userRole !== 'ADMIN' && userData.organizationId !== orgId) {
      throw new ForbiddenException(
        'Você não tem permissão para criar usuários fora da sua organização'
      );
    }
    
    // validações específicas por papel
    
    if (userRole === 'SECRETARIO') {
      // secretário pode cadastrar tudo menos ADMIN ou outro SECRETARIO
      if (['ADMIN', 'SECRETARIO'].includes(userData.role)) {
        throw new ForbiddenException(
          'Secretários não podem cadastrar administradores ou outros secretários'
        );
      }
    } 
    else if (userRole === 'COORDENADOR') {
      // coordenador só pode cadastrar diretores e professores
      if (!['DIRETOR', 'PROFESSOR'].includes(userData.role)) {
        throw new ForbiddenException(
          'Coordenadores só podem cadastrar diretores e professores.'
        );
      }
    } 
    else if (userRole === 'DIRETOR') {
      // diretor só pode cadastrar alunos (USER) e professores
      if (!['PROFESSOR', 'USER'].includes(userData.role)) {
        throw new ForbiddenException(
          'Diretores só podem cadastrar professores e alunos.'
        );
      }
    }
    
    return this.userService.createUser(userData);
  }

  @Patch(':id')
  @Roles('SECRETARIO', 'COORDENADOR', 'DIRETOR', 'PROFESSOR')
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
      schoolId?: number;
      classId?: number;
      regionId?: number;
    },
    @Req() req: Request,
  ) {
    const userRole = req.user.role;
    const user = await this.userService.getUserById(Number(id));
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    // verificação básica de organização para todos
    if (userRole !== 'ADMIN' && user.organizationId !== getOrganizationIdFromRequest(req)) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar usuários fora da sua organização'
      );
    }
    
    // validações específicas por papel

    if (userRole === 'SECRETARIO') {
      // secretário não pode editar ADMIN ou SECRETARIO
      if (['ADMIN', 'SECRETARIO'].includes(user.role)) {
        throw new ForbiddenException(
          'Secretários não podem editar administradores ou outros secretários'
        );
      }
      
      // secretário não pode mudar papel para ADMIN ou SECRETARIO
      if (userData.role && ['ADMIN', 'SECRETARIO'].includes(userData.role)) {
        throw new ForbiddenException(
          'Secretários não podem alterar usuários para serem administradores ou secretários'
        );
      }
    } 
    else if (userRole === 'COORDENADOR') {
      // coordenador não pode editar SECRETARIO e COORDENADOR
      if (!['DIRETOR', 'PROFESSOR'].includes(user.role)) {
        throw new ForbiddenException(
          'Coordenadores só podem editar diretores e professores.'
        );
      }
      
      // coordenador só pode mudar papel para DIRETOR ou PROFESSOR
      if (userData.role && !['DIRETOR', 'PROFESSOR'].includes(userData.role)) {
        throw new ForbiddenException(
          'Coordenadores não podem alterar usuários que não sejam diretores ou professores.'
        );
      }
      
      // verificar se usuário está nas regiões do coordenador
      const regionIds = req.user.regions.map(region => region.id);
      
      // regions
      const isInRegions = await this.userService.isUserInRegions(Number(id), regionIds);
      if (!isInRegions) {
        // schools
        const schools = await this.userService.getSchoolsByRegionIds(regionIds);
        const schoolIds = schools.map(school => school.id);
        const isInSchools = await this.userService.isUserInSchools(Number(id), schoolIds);
        
        if (!isInSchools) {
          // classes
          const classes = await this.userService.getClassesBySchoolIds(schoolIds);
          const classIds = classes.map(cls => cls.id);
          const isInClasses = await this.userService.isUserInClasses(Number(id), classIds);
          
          if (!isInClasses) {
            throw new ForbiddenException(
              'Você não tem permissão para editar usuários fora das suas regiões'
            );
          }
        }
      }
    } 
    else if (userRole === 'DIRETOR') {
      // diretor só pode editar alunos e professores
      if (!['PROFESSOR', 'USER'].includes(user.role)) {
        throw new ForbiddenException(
          'Diretores só podem editar professores e alunos'
        );
      }
      
      // diretor não pode mudar papel para algo diferente de aluno ou professor
      if (userData.role && !['PROFESSOR', 'USER'].includes(userData.role)) {
        throw new ForbiddenException(
          'Diretores não podem alterar usuários que não sejam professores ou alunos'
        );
      }
      
      // schools
      const schoolIds = req.user.schools.map(school => school.id);
      
      const isInSchools = await this.userService.isUserInSchools(Number(id), schoolIds);
      if (!isInSchools) {
        // classes
        const classes = await this.userService.getClassesBySchoolIds(schoolIds);
        const classIds = classes.map(cls => cls.id);
        const isInClasses = await this.userService.isUserInClasses(Number(id), classIds);
        
        if (!isInClasses) {
          throw new ForbiddenException(
            'Você não tem permissão para editar usuários fora das suas escolas'
          );
        }
      }
    }
    
    return this.userService.updateUser(Number(id), userData);
  }

  @Delete(':id')
  @Roles('SECRETARIO', 'COORDENADOR', 'DIRETOR')
  async deleteUser(@Param('id') id: string, @Req() req: Request) {
    const userRole = req.user.role;
    const user = await this.userService.getUserById(Number(id));
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    if (userRole !== 'ADMIN' && user.organizationId !== getOrganizationIdFromRequest(req)) {
      throw new ForbiddenException(
        'Você não tem permissão para deletar usuários fora da sua organização'
      );
    }
    
    // regras de exclusão por papel
    switch (user.role) {
      case 'COORDENADOR':
        // apenas secretários podem deletar coordenadores
        if (userRole !== 'SECRETARIO') {
          throw new ForbiddenException(
            'Apenas secretários podem deletar coordenadores'
          );
        }
        break;
        
      case 'DIRETOR':
        // apenas secretários e coordenadores podem deletar diretores
        if (userRole !== 'SECRETARIO' && userRole !== 'COORDENADOR') {
          throw new ForbiddenException(
            'Apenas secretários e coordenadores podem deletar diretores'
          );
        }
        break;
        
      case 'PROFESSOR':
        // apenas secretários, coordenadores podem deletar professores
        if (userRole !== 'SECRETARIO' && userRole !== 'COORDENADOR') {
          throw new ForbiddenException(
            'Apenas secretários, coordenadores e diretores podem deletar professores'
          );
        }
        break;
        
      case 'USER': // alunos
        // apenas diretores podem deletar alunos
        if (userRole !== 'DIRETOR') {
          throw new ForbiddenException(
            'Apenas diretores podem deletar alunos'
          );
        }
        break;
        
      default:
        throw new ForbiddenException(
          'Você não tem permissão para deletar este tipo de usuário'
        );
    }
    
    return this.userService.deleteUser(Number(id));
  }
}
