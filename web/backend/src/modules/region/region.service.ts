import { Injectable } from '@nestjs/common';
import { Prisma, Region } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class RegionService {
  constructor(private prisma: PrismaService) {}

  async getAllRegions(organizationId: number): Promise<Region[]> {
    return this.prisma.region.findMany({
      where: { organizationId },
    });
  }

  async getRegionById(id: number): Promise<Region | null> {
    return this.prisma.region.findUnique({
      where: { id },
    });
  }

  async createRegion(
    regionData: Prisma.RegionUncheckedCreateInput,
  ): Promise<Region> {
    return this.prisma.region.create({
      data: regionData,
    });
  }

  async updateRegion(
    id: number,
    regionData: Prisma.RegionUpdateInput,
  ): Promise<Region> {
    return this.prisma.region.update({
      where: { id },
      data: regionData,
    });
  }

  async deleteRegion(id: number): Promise<Region> {
    return this.prisma.region.delete({
      where: { id },
    });
  }
}
