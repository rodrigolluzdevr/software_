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

  @Get()
  async getDashboard(@Req() req: Request) {
    const { role, organizationId } = req.user;

    const dashboards = {
      ADMIN: { message: this.getDashboardMessage('administrador', organizationId) },
      PROFESSOR: { message: this.getDashboardMessage('professor', organizationId) },
      SECRETARIO: { message: this.getDashboardMessage('secretário', organizationId) },
      COORDENADOR: { message: this.getDashboardMessage('coordenador', organizationId) },
      DIRETOR: { message: this.getDashboardMessage('diretor', organizationId) },
      USER: { message: this.getDashboardMessage('usuário', organizationId) },
    };

    // Retorna as informações específicas para a Role
    return dashboards[role] || { message: 'Role não reconhecida' };
  }
}
