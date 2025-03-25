import { Injectable } from '@nestjs/common';
import { Class, type Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ClassService {
  constructor(private prisma: PrismaService) {}

  async getAllClass(schoolIds: number[]): Promise<Class[]> {
    return this.prisma.class.findMany({
      where: {
        schoolId: {
          in: schoolIds,
        },
      },
    });
  }

  async getClassById(id: number): Promise<Class | null> {
    return this.prisma.class.findUnique({
      where: { id },
    });
  }

  async createClass(
    classData: Prisma.ClassUncheckedCreateInput,
  ): Promise<Class> {
    return this.prisma.class.create({
      data: classData,
    });
  }

  async updateClass(
    id: number,
    classData: Prisma.ClassUpdateInput,
  ): Promise<Class> {
    return this.prisma.class.update({
      where: { id },
      data: classData,
    });
  }

  async deleteClass(id: number): Promise<Class> {
    return this.prisma.class.delete({
      where: { id },
    });
  }
}
