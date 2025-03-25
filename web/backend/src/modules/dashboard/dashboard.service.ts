import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';  // Ajuste o caminho conforme sua estrutura

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
      studentsCount
    ] = await Promise.all([
      // Contagem de regiões
      this.prisma.region.count({
        where: { organizationId, isActive: true }
      }),
      
      // Contagem de escolas (de todas as regiões da organização)
      this.prisma.school.count({
        where: { 
          region: { organizationId },
          isActive: true 
        }
      }),
      
      // Contagem de coordenadores
      this.prisma.user.count({
        where: { 
          organizationId,
          role: 'COORDENADOR',
          isActive: true 
        }
      }),
      
      // Contagem de diretores
      this.prisma.user.count({
        where: { 
          organizationId,
          role: 'DIRETOR',
          isActive: true 
        }
      }),
      
      // Contagem de turmas
      this.prisma.class.count({
        where: {
          school: {
            region: { organizationId }
          },
          isActive: true
        }
      }),
      
      // Contagem de professores
      this.prisma.user.count({
        where: { 
          organizationId,
          role: 'PROFESSOR',
          isActive: true 
        }
      }),
      
      // Contagem de professores
      this.prisma.user.count({
        where: { 
          organizationId,
          role: 'USER',
          isActive: true 
        }
      })
    ]);

    return {
      regions: regionsCount,
      schools: schoolsCount,
      coordinators: coordinatorsCount,
      directors: directorsCount,
      classes: classesCount,
      teachers: teachersCount,
      students: studentsCount
    };
  }
}