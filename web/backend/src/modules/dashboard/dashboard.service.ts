import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service'; // Ajuste o caminho conforme sua estrutura

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStatsByOrganization(organizationId: number) {
    // Buscar todas as contagens em paralelo
    const [
      regionsCount,
      schoolsCount,
      coordinatorsCount,
      directorsCount,
      classesCount,
      teachersCount,
      studentsCount,
    ] = await Promise.all([
      // Contagem de regiões
      this.prisma.region.count({
        where: { organizationId, isActive: true },
      }),

      this.prisma.school.count({
        where: {
          region: { organizationId },
          isActive: true,
        },
      }),

      this.prisma.user.count({
        where: {
          organizationId,
          role: 'COORDENADOR',
          isActive: true,
        },
      }),

      this.prisma.user.count({
        where: {
          organizationId,
          role: 'DIRETOR',
          isActive: true,
        },
      }),

      this.prisma.class.count({
        where: {
          school: {
            region: { organizationId },
          },
          isActive: true,
        },
      }),

      this.prisma.user.count({
        where: {
          organizationId,
          role: 'PROFESSOR',
          isActive: true,
        },
      }),

      this.prisma.user.count({
        where: {
          organizationId,
          role: 'USER',
          isActive: true,
        },
      }),
    ]);

    return {
      regions: regionsCount,
      schools: schoolsCount,
      coordinators: coordinatorsCount,
      directors: directorsCount,
      classes: classesCount,
      teachers: teachersCount,
      students: studentsCount,
    };
  }
}
