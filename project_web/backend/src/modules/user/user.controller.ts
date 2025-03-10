import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import type { Role } from '@prisma/client';
import { Request } from 'express';
import { RolesGuard } from '../auth/roles.guard';
import { getOrganizationIdFromRequest } from 'src/utils/organization.util';

@Controller('users')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(@Req() req: Request) {
    const organizationId = getOrganizationIdFromRequest(req);
    return this.userService.getAllUsersByOrganization(organizationId);
  }

  @Post()
  async createUser(
    @Body()
    userData: {
      cpf: string;
      password: string;
      name: string;
      role: Role;
      email: string;
      address: string;
      cep: string;
      numberAdress: string;
      organizationId: number;
    },
  ) {
    return this.userService.createUser(userData);
  }
}