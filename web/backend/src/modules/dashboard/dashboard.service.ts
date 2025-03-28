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
      // Regiões que contêm as escolas gerenciadas pelo diretor
      this.prisma.region.count({
        where: {
          isActive: true,
          schools: { 
            some: { 
              id: { in: schoolIds },
              isActive: true
            } 
          },
        },
      }),
      
      // Escolas gerenciadas pelo diretor
      this.prisma.school.count({
        where: {
          id: { in: schoolIds },
          isActive: true,
        },
      }),
      
      // Coordenadores associados às escolas gerenciadas ou turmas dessas escolas
      this.prisma.user.count({
        where: {
          OR: [
            { schools: { some: { id: { in: schoolIds }, isActive: true } } },
            { 
              class: { 
                some: { 
                  schoolId: { in: schoolIds },
                  isActive: true 
                } 
              } 
            },
          ],
          organizationId,
          role: 'COORDENADOR',
          isActive: true,
        },
      }),
      
      // Diretores associados às escolas gerenciadas
      this.prisma.user.count({
        where: {
          schools: { some: { id: { in: schoolIds }, isActive: true } },
          organizationId,
          role: 'DIRETOR',
          isActive: true,
        },
      }),
      
      // Turmas pertencentes às escolas gerenciadas pelo diretor
      this.prisma.class.count({
        where: {
          schoolId: { in: schoolIds },
          isActive: true,
        },
      }),
      
      // Professores associados às escolas gerenciadas ou a turmas dessas escolas
      this.prisma.user.count({
        where: {
          OR: [
            { schools: { some: { id: { in: schoolIds }, isActive: true } } },
            { 
              class: { 
                some: { 
                  schoolId: { in: schoolIds },
                  isActive: true 
                } 
              } 
            },
          ],
          organizationId,
          role: 'PROFESSOR',
          isActive: true,
        },
      }),
      
      // Alunos associados às escolas gerenciadas ou a turmas dessas escolas
      this.prisma.user.count({
        where: {
          OR: [
            { schools: { some: { id: { in: schoolIds }, isActive: true } } },
            { 
              class: { 
                some: { 
                  schoolId: { in: schoolIds },
                  isActive: true 
                } 
              } 
            },
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

  async getStatsByTeacher(organizationId: number, classIds: number[]) {
    const [
      regionsCount,
      schoolsCount,
      coordinatorsCount,
      directorsCount,
      classesCount,
      teachersCount,
      studentsCount,
    ] = await Promise.all([
      // Contagem de regiões ativas com escolas que possuam as turmas do professor
      this.prisma.region.count({
        where: {
          isActive: true,
          schools: {
            some: {
              isActive: true,
              classes: {
                some: { id: { in: classIds }, isActive: true },
              },
            },
          },
        },
      }),
  
      // Contagem de escolas ativas que tenham as turmas do professor
      this.prisma.school.count({
        where: {
          isActive: true,
          classes: {
            some: { id: { in: classIds }, isActive: true },
          },
        },
      }),
  
      // SOMENTE coordenadores diretamente ligados às turmas do professor
      this.prisma.user.count({
        where: {
          class: {
            some: { id: { in: classIds }, isActive: true },
          },
          organizationId,
          role: 'COORDENADOR',
          isActive: true,
        },
      }),
  
      // SOMENTE diretores diretamente ligados às turmas do professor
      this.prisma.user.count({
        where: {
          class: {
            some: { id: { in: classIds }, isActive: true },
          },
          organizationId,
          role: 'DIRETOR',
          isActive: true,
        },
      }),
  
      // Contar as turmas do professor
      this.prisma.class.count({
        where: {
          id: { in: classIds },
          isActive: true,
        },
      }),
  
      // SOMENTE professores diretamente ligados às turmas
      this.prisma.user.count({
        where: {
          class: {
            some: { id: { in: classIds }, isActive: true },
          },
          organizationId,
          role: 'PROFESSOR',
          isActive: true,
        },
      }),
  
      // SOMENTE alunos diretamente ligados às turmas
      this.prisma.user.count({
        where: {
          class: {
            some: { id: { in: classIds }, isActive: true },
          },
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