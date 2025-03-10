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

  async createUser(userData: Prisma.UserUncheckedCreateInput) {
    return this.prisma.user.create({
      data: userData,
    });
  }
}
