import { Injectable } from '@nestjs/common';
import { School, type Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class SchoolService {
  constructor(private prisma: PrismaService) {}

  async getAllSchools(regionIds: number[]): Promise<School[]> {
    return this.prisma.school.findMany({
      where: {
        regionId: {
          in: regionIds,
        },
      },
    });
  }

  async getSchoolById(id: number): Promise<School | null> {
    return this.prisma.school.findUnique({
      where: { id },
    });
  }

  async createSchool(
    schoolData: Prisma.SchoolUncheckedCreateInput,
  ): Promise<School> {
    return this.prisma.school.create({
      data: schoolData,
    });
  }

  async updateSchool(
    id: number,
    schoolData: Prisma.SchoolUpdateInput,
  ): Promise<School> {
    return this.prisma.school.update({
      where: { id },
      data: schoolData,
    });
  }

  async deleteSchool(id: number): Promise<School> {
    return this.prisma.school.delete({
      where: { id },
    });
  }

  async getAllSchoolsNoFilter(): Promise<School[]> {
    return this.prisma.school.findMany();
  }

  async getAllSchoolsByOrganization(organizationId: number): Promise<School[]> {
    return this.prisma.school.findMany({
      where: {
        region: {
          organizationId,
        },
      },
    });
  }

  async getAllSchoolsByRegisterId(Ids: number[]): Promise<School[]> {
    return this.prisma.school.findMany({
      where: {
        id: {
          in: Ids,
        },
      },
    });
  }
}
