import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

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

  async getStatsByCoordinator(organizationId: number, regionIds: number[]) {
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
        where: { 
          id: { in: regionIds }, 
          isActive: true 
        },
      }),
      
      // Contagem de escolas
      this.prisma.school.count({
        where: {
          regionId: { in: regionIds },
          isActive: true,
        },
      }),
      
      // Contagem de coordenadores 
      this.prisma.user.count({
        where: {
          OR: [
            { regions: { some: { id: { in: regionIds } } } },
            { schools: { some: { regionId: { in: regionIds } } } }
          ],
          organizationId,
          role: 'COORDENADOR',
          isActive: true,
        },
      }),
      
      // Contagem de diretores
      this.prisma.user.count({
        where: {
          OR: [
            { regions: { some: { id: { in: regionIds } } } },
            { schools: { some: { regionId: { in: regionIds } } } }
          ],
          organizationId,
          role: 'DIRETOR',
          isActive: true,
        },
      }),
      
      // Contagem de turmas
      this.prisma.class.count({
        where: {
          school: {
            regionId: { in: regionIds },
          },
          isActive: true,
        },
      }),
      
      // Contagem de professores - verificando tanto relações diretas quanto indiretas
      this.prisma.user.count({
        where: {
          OR: [
            // Professores diretamente associados a regiões
            { regions: { some: { id: { in: regionIds } } } },
            // Professores associados a escolas nas regiões
            { schools: { some: { regionId: { in: regionIds } } } },
            // Professores associados a turmas em escolas nas regiões
            { class: { some: { school: { regionId: { in: regionIds } } } } },
          ],
          organizationId,
          role: 'PROFESSOR',
          isActive: true,
        },
      }),
      
      // Contagem de alunos - verificando tanto relações diretas quanto indiretas
      this.prisma.user.count({
        where: {
          OR: [
            // Alunos diretamente associados a regiões
            { regions: { some: { id: { in: regionIds } } } },
            // Alunos associados a escolas nas regiões
            { schools: { some: { regionId: { in: regionIds } } } },
            // Alunos associados a turmas em escolas nas regiões
            { class: { some: { school: { regionId: { in: regionIds } } } } },
          ],
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

  async getStatsByDirector(organizationId: number, schoolIds: number[]) {
    const [
      regionsCount,
      schoolsCount,
      coordinatorsCount,
      directorsCount,
      classesCount,
      teachersCount,
      studentsCount,
    ] = await Promise.all([
      this.prisma.region.count({
        where: {
          isActive: true,
          schools: { some: { id: { in: schoolIds } } },
        },
      }),
      this.prisma.school.count({
        where: {
          id: { in: schoolIds },
          isActive: true,
        },
      }),
      this.prisma.user.count({
        where: {
          OR: [
            { schools: { some: { id: { in: schoolIds } } } },
            { class: { some: { schoolId: { in: schoolIds } } } },
          ],
          organizationId,
          role: 'COORDENADOR',
          isActive: true,
        },
      }),
      this.prisma.user.count({
        where: {
          schools: { some: { id: { in: schoolIds } } },
          organizationId,
          role: 'DIRETOR',
          isActive: true,
        },
      }),
      this.prisma.class.count({
        where: {
          schoolId: { in: schoolIds },
          isActive: true,
        },
      }),
      this.prisma.user.count({
        where: {
          OR: [
            { schools: { some: { id: { in: schoolIds } } } },
            { class: { some: { schoolId: { in: schoolIds } } } },
          ],
          organizationId,
          role: 'PROFESSOR',
          isActive: true,
        },
      }),
      this.prisma.user.count({
        where: {
          OR: [
            { schools: { some: { id: { in: schoolIds } } } },
            { class: { some: { schoolId: { in: schoolIds } } } },
          ],
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

  // Método adicional que pode ser útil para obter estatísticas gerais
  async getOverallStats() {
    const [
      organizationsCount,
      regionsCount,
      schoolsCount,
      usersCount,
      classesCount,
    ] = await Promise.all([
      this.prisma.organization.count({ where: { isActive: true } }),
      this.prisma.region.count({ where: { isActive: true } }),
      this.prisma.school.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.class.count({ where: { isActive: true } }),
    ]);

    return {
      organizations: organizationsCount,
      regions: regionsCount,
      schools: schoolsCount,
      users: usersCount,
      classes: classesCount,
    };
  }
}