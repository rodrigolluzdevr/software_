import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { RegionService } from './region.service';
import { RolesGuard } from '../auth/roles.guard';

@Controller('regions')
export class RegionController {
    constructor(private readonly regionService: RegionService) {}

    @Get()
    @UseGuards(RolesGuard)
    async getAllRegions(@Req() req) {
        return this.regionService.getAllRegions(req.user.organizationId);
    }
}
