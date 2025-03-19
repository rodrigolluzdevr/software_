import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { SchoolService } from './school.service';
import { RolesGuard } from '../auth/roles.guard';

@Controller('schools')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Get()
  @UseGuards(RolesGuard)
  async getAllSchools(@Req() req) {
    return this.schoolService.getAllSchools(req.user.regionId);
  }
}
