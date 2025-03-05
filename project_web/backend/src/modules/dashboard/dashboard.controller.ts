import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { SetMetadata } from '@nestjs/common';

@Controller('dashboard')
@UseGuards(RolesGuard)
export class DashboardController {
  @Get('admin')
  @SetMetadata('roles', ['ADMIN'])
  adminDashboard() {
    return { message: 'Bem-vindo ao painel de administração' };
  }

  @Get('professor')
  @SetMetadata('roles', ['PROFESSOR'])
  professorDashboard() {
    return { message: 'Bem-vindo ao painel do professor' };
  }

  @Get('secretario')
  @SetMetadata('roles', ['SECRETARIO'])
  secretarioDashboard() {
    return { message: 'Bem-vindo ao painel do secretário' };
  }

  @Get('coordenador')
  @SetMetadata('roles', ['COORDENADOR'])
  coordenadorDashboard() {
    return { message: 'Bem-vindo ao painel do coordenador' };
  }

  @Get('diretor')
  @SetMetadata('roles', ['DIRETOR'])
  diretorDashboard() {
    return { message: 'Bem-vindo ao painel do diretor' };
  }

  @Get('user')
  @SetMetadata('roles', ['USER'])
  userDashboard() {
    return { message: 'Bem-vindo ao painel do usuário' };
  }
}