import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getAllUsersByOrganization(organizationId: number): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { organizationId },
    });
  }

  async createUser(userData: Prisma.UserUncheckedCreateInput): Promise<User> {
    return this.prisma.user.create({
      data: userData,
    });
  }

  async getUserById(id: number): Promise<User | null> { // Permitir retorno null
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updateUser(id: number, userData: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: userData,
    });
  }

  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}