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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RegionService } from './region.service';
import { RolesGuard } from '../auth/roles.guard';
import {
  getOrganizationIdFromRequest,
  userHasAccessToOrganization,
} from 'src/utils/organization.util';
import { Request } from 'express';
import { Region } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateRegionDto } from './dto/create-region.dto';
import { ParseIdPipe } from '../common/pipes/parse-id.pipe';
import { UpdateRegionDto } from './dto/update-region.dto';

@Controller('regions')
@UseGuards(RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class RegionController {
  private readonly ADMIN_ROLES = ['SECRETARIO'];

  constructor(private readonly regionService: RegionService) {}

  @Get()
  async getAllRegions(@Req() req: Request): Promise<Region[]> {
    const organizationId = this.extractRegionIds(req);
    return this.regionService.getAllRegions(organizationId);
  }

  @Get(':id')
  async getRegionById(
    @Param('id', ParseIdPipe) id: number,
    @Req() req: Request,
  ): Promise<Region> {
    const region = await this.findRegionOrFail(id);
    this.validateOrganizationAccess(req, region.organizationId, 'acessar');
    return region;
  }

  @Post()
  @Roles('SECRETARIO')
  async createRegion(
    @Body() createRegionDto: CreateRegionDto,
    @Req() req: Request,
  ): Promise<Region> {
    this.validateOrganizationAccess(req, createRegionDto.organizationId, 'criar',
    );
    return this.regionService.createRegion(createRegionDto);
  }

  @Patch(':id')
  @Roles('SECRETARIO')
  async updateRegion(
    @Param('id', ParseIdPipe) id: number,
    @Body() updateRegionDto: UpdateRegionDto,
    @Req() req: Request,
  ): Promise<Region> {
    const region = await this.findRegionOrFail(id);
    this.validateOrganizationAccess(req, region.organizationId, 'atualizar');
    return this.regionService.updateRegion(id, updateRegionDto);
  }

  @Delete(':id')
  @Roles('SECRETARIO')
  async deleteRegion(
    @Param('id', ParseIdPipe) id: number,
    @Req() req: Request,
  ): Promise<Region> {
    const region = await this.findRegionOrFail(id);
    this.validateOrganizationAccess(req, region.organizationId, 'deletar');
    return this.regionService.deleteRegion(id);
  }

  // Métodos auxiliares privados
  private extractRegionIds(req: Request): number {
    return getOrganizationIdFromRequest(req);
  }

  private async findRegionOrFail(id: number): Promise<Region> {
    const region = await this.regionService.getRegionById(id);

    if (!region) {
      throw new ForbiddenException('Região não encontrada');
    }

    return region;
  }

  private validateOrganizationAccess(
    req: Request,
    organizationId: number,
    action: string,
  ): void {
    if (!userHasAccessToOrganization(req, organizationId)) {
      throw new ForbiddenException(
        `Você não tem permissão para ${action} regiões fora da sua organização`,
      );
    }
  }
}
