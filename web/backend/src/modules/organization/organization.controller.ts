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
import { RolesGuard } from '../auth/roles.guard';
import { OrganizationService } from './organization.service';
import { Organization } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { ParseIdPipe } from '../common/pipes/parse-id.pipe';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Controller('organizations')
@UseGuards(RolesGuard)
export class OrganizationController {
  private readonly ADMIN_ROLES = ['ADMIN'];

  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  @Roles('ADMIN')
  async getAllOrganizations(@Req() req: Request): Promise<Organization[]> {
    return this.organizationService.getAllOrganizations();
  }

  @Get(':id')
  @Roles('ADMIN')
  async getOrganizationById(
    @Param('id', ParseIdPipe) id: number,
  ): Promise<Organization> {
    const organization = await this.findOrganizationOrFail(id);
    return organization;
  }

  @Post()
  @Roles('ADMIN')
  async createOrganization(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationService.createOrganization(createOrganizationDto);
  }

  @Patch(':id')
  @Roles('ADMIN')
  async updateOrganization(
    @Param('id', ParseIdPipe) id: number,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationService.updateOrganization(id, updateOrganizationDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
    async deleteOrganization(@Param('id', ParseIdPipe) id: number): Promise<Organization> {
        return this.organizationService.deleteOrganization(id);
  }
  

  // Métodos auxiliares privados
  private async findOrganizationOrFail(id: number): Promise<Organization> {
    const organization = await this.organizationService.getOrganizationById(id);

    if (!organization) {
      throw new ForbiddenException('Região não encontrada');
    }

    return organization;
  }
}
