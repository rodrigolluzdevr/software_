import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RegionService } from './region.service';
import { RolesGuard } from '../auth/roles.guard';
import { getOrganizationIdFromRequest } from 'src/utils/organization.util';
import { Request } from 'express';

@Controller('regions')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Get()
  @UseGuards(RolesGuard)
  async getAllRegions(@Req() req) {
    return this.regionService.getAllRegions(req.user.organizationId);
  }

  @Post()
  async createRegion(
    @Body()
    regionData: {
      name: string;
      organizationId: number;
    },
    @Req() req: Request,
  ) {
    const organizationId = getOrganizationIdFromRequest(req);
    const userRole = req.user.role;
    {
      if (
        userRole !== 'ADMIN' &&
        regionData.organizationId !== organizationId
      ) {
        throw new ForbiddenException(
          'Você não tem permissão para criar usuários fora da sua organização',
        );
      }
      return this.regionService.createRegion(regionData);
    }
  }

  @Get(':id')
  async getRegionById(@Param('id') id: string, @Req() req: Request) {
    const organizationId = getOrganizationIdFromRequest(req);
    const region = await this.regionService.getRegionById(Number(id));
    if (!region) {
      throw new ForbiddenException('Região não encontrada');
    }
    if (region.organizationId !== organizationId) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar essa região',
      );
    }
    return region;
  }

  @Patch(':id')
  async updateRegion(
    @Param('id') id: string,
    @Body()
    regionData: {
      name: string;
      isActive: boolean;
    },
    @Req() req: Request,
  ) {
    const organizationId = getOrganizationIdFromRequest(req);
    const userRole = req.user.role;
    const region = await this.regionService.getRegionById(Number(id));
    if (!region) {
      throw new ForbiddenException('Região não encontrada');
    }
    if (userRole !== 'ADMIN' && region.organizationId !== organizationId) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar regiões fora da sua organização',
      );
    }
    return this.regionService.updateRegion(Number(id), regionData);
  }
  
  @Delete(':id')
  async deleteRegion(@Param('id') id: string, @Req() req: Request) {
    const organizationId = getOrganizationIdFromRequest(req);
    const userRole = req.user.role;
    const region = await this.regionService.getRegionById(Number(id));
    if (!region) {
      throw new ForbiddenException('Região não encontrada');
    }
    if (userRole !== 'ADMIN' && region.organizationId !== organizationId) {
      throw new ForbiddenException(
        'Você não tem permissão para deletar regiões fora da sua organização',
      );
    }
    return this.regionService.deleteRegion(Number(id));
  }
}
