import { Controller, Get, Req, UseGuards, Query, Logger } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { Request } from 'express';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(RolesGuard)
export class DashboardController {
  private readonly logger = new Logger(DashboardController.name);

  constructor(private dashboardService: DashboardService) {}

  private getDashboardMessage(role: string, organizationId: number): string {
    return `Bem-vindo ao painel do ${role.toLowerCase()} da organização ${organizationId}`;
  }

  @Get()
  async getDashboard(@Req() req: Request) {
    const { role, organizationId } = req.user;

    const dashboards = {
      ADMIN: {
        message: this.getDashboardMessage('administrador', organizationId),
      },
      PROFESSOR: {
        message: this.getDashboardMessage('professor', organizationId),
      },
      SECRETARIO: {
        message: this.getDashboardMessage('secretário', organizationId),
      },
      COORDENADOR: {
        message: this.getDashboardMessage('coordenador', organizationId),
      },
      DIRETOR: { message: this.getDashboardMessage('diretor', organizationId) },
      USER: { message: this.getDashboardMessage('usuário', organizationId) },
    };

    return dashboards[role] || { message: 'Role não reconhecida' };
  }

  @Get('stats')
  async getDashboardStats(
    @Req() req: Request,
    @Query('regionId') regionIdParam?: string,
    @Query('schoolId') schoolIdParam?: string,
  ) {
    const { organizationId, role, regions = [], schools = [] } = req.user;

    // Para coordenador, processar múltiplas regiões
    if (role === 'COORDENADOR') {
      try {
        // Extrair todas as regiões do token
        let regionIds = regions.map((r) => r.id);

        // Se um filtro de região específica foi solicitado
        if (regionIdParam) {
          const requestedIds = regionIdParam.includes(',')
            ? regionIdParam.split(',').map((id) => Number(id.trim()))
            : [Number(regionIdParam)];

          // Filtrar apenas IDs válidos que o coordenador tem acesso
          const validRegionIds = regions.map((r) => r.id);
          regionIds = requestedIds.filter(
            (id) => validRegionIds.includes(id) && !isNaN(id),
          );

          this.logger.log(
            `Coordenador filtrando por região(ões): ${regionIds.join(', ')}`,
          );
        } else {
          this.logger.log(
            `Coordenador acessando todas as suas regiões: ${regionIds.join(', ')}`,
          );
        }

        // Se não houver regiões válidas
        if (!regionIds.length) {
          this.logger.warn(
            `Coordenador sem regiões válidas para exibir estatísticas`,
          );
          return {
            regions: 0,
            schools: 0,
            coordinators: 0,
            directors: 0,
            classes: 0,
            teachers: 0,
            students: 0,
          };
        }

        return this.dashboardService.getStatsByCoordinator(
          organizationId,
          regionIds,
        );
      } catch (error) {
        this.logger.error(
          `Erro ao processar estatísticas: ${error.message}`,
          error.stack,
        );
        throw error;
      }
    } else if (role === 'DIRETOR') {
      let schoolIds = schools.map((s) => s.id);
      if (schoolIdParam) {
        const requestedIds = schoolIdParam.includes(',')
          ? schoolIdParam.split(',').map((id) => Number(id.trim()))
          : [Number(schoolIdParam)];
        schoolIds = requestedIds.filter(
          (id) => schoolIds.includes(id) && !isNaN(id),
        );
        if (!schoolIds.length) {
          return {
            regions: 0,
            schools: 0,
            coordinators: 0,
            directors: 0,
            classes: 0,
            teachers: 0,
            students: 0,
          };
        }
      }
      return this.dashboardService.getStatsByDirector(
        organizationId,
        schoolIds,
      );
    } else if (role === 'PROFESSOR') {
      let classIds = req.user.class.map((c) => c.id);
      if (schoolIdParam) {
        const requestedIds = schoolIdParam.includes(',')
          ? schoolIdParam.split(',').map((id) => Number(id.trim()))
          : [Number(schoolIdParam)];
        classIds = requestedIds.filter(
          (id) => classIds.includes(id) && !isNaN(id),
        );
        if (!classIds.length) {
          return {
            regions: 0,
            schools: 0,
            coordinators: 0,
            directors: 0,
            classes: 0,
            teachers: 0,
            students: 0,
          };
        }
      }
      return this.dashboardService.getStatsByTeacher(organizationId, classIds);
    } else {
      // Para outros papéis
      return this.dashboardService.getStatsByOrganization(organizationId);
    }
  }
}
