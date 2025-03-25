import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { Request } from 'express';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(RolesGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}
  
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
  
  // Adicione este novo endpoint para estatísticas do dashboard
  @Get('stats')
  async getDashboardStats(@Req() req: Request) {
    const { organizationId } = req.user;
    return this.dashboardService.getStatsByOrganization(organizationId);
  }
}