import { Injectable } from '@nestjs/common';
import { Organization, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async getAllOrganizations(): Promise<Organization[]> {
    return this.prisma.organization.findMany();
  }

  async getOrganizationById(id: number): Promise<Organization | null> {
    return this.prisma.organization.findUnique({
      where: { id },
    });
  }

  async createOrganization(
    organizationData: Prisma.OrganizationUncheckedCreateInput,
  ): Promise<Organization> {
    return this.prisma.organization.create({
      data: organizationData,
    });
  }

  async updateOrganization(
    id: number,
    organizationData: Prisma.OrganizationUpdateInput,
  ): Promise<Organization> {
    return this.prisma.organization.update({
      where: { id },
      data: organizationData,
    });
  }

  async deleteOrganization(id: number): Promise<Organization> {
    return this.prisma.organization.delete({
      where: { id },
    });
  }
}
