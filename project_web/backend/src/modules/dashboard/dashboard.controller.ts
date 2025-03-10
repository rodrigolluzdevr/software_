import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { SetMetadata } from '@nestjs/common';
import { Request } from 'express';

@Controller('dashboard')
@UseGuards(RolesGuard)
export class DashboardController {
  private getDashboardMessage(role: string, organizationId: number): string {
    return `Bem-vindo ao painel do ${role.toLowerCase()} da organização ${organizationId}`;
  }

  @Get('admin')
  @SetMetadata('roles', ['ADMIN'])
  adminDashboard(@Req() req: Request) {
    const organizationId = req.user.organizationId;
    return { message: this.getDashboardMessage('administrador', organizationId) };
  }

  @Get('professor')
  @SetMetadata('roles', ['PROFESSOR'])
  professorDashboard(@Req() req: Request) {
    const organizationId = req.user.organizationId;
    return { message: this.getDashboardMessage('professor', organizationId) };
  }

  @Get('secretario')
  @SetMetadata('roles', ['SECRETARIO'])
  secretarioDashboard(@Req() req: Request) {
    const organizationId = req.user.organizationId;
    return { message: this.getDashboardMessage('secretário', organizationId) };
  }

  @Get('coordenador')
  @SetMetadata('roles', ['COORDENADOR'])
  coordenadorDashboard(@Req() req: Request) {
    const organizationId = req.user.organizationId;
    return { message: this.getDashboardMessage('coordenador', organizationId) };
  }

  @Get('diretor')
  @SetMetadata('roles', ['DIRETOR'])
  diretorDashboard(@Req() req: Request) {
    const organizationId = req.user.organizationId;
    return { message: this.getDashboardMessage('diretor', organizationId) };
  }

  @Get('user')
  @SetMetadata('roles', ['USER'])
  userDashboard(@Req() req: Request) {
    const organizationId = req.user.organizationId;
    return { message: this.getDashboardMessage('usuário', organizationId) };
  }
}