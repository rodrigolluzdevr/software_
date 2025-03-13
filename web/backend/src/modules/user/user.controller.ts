import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
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
    @Req() req: Request,
  ) {
    const userRole = req.user.role;
    if (
      userRole !== 'ADMIN' &&
      userData.organizationId !== getOrganizationIdFromRequest(req)
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para criar usuários fora da sua organização',
      );
    }
    return this.userService.createUser(userData);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string, @Req() req: Request) {
    const user = await this.userService.getUserById(Number(id));
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body()
    userData: {
      cpf?: string;
      password?: string;
      name?: string;
      role?: Role;
      email?: string;
      address?: string;
      cep?: string;
      numberAdress?: string;
      organizationId?: number;
    },
    @Req() req: Request,
  ) {
    const userRole = req.user.role;
    const user = await this.userService.getUserById(Number(id));
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    if (
      userRole !== 'ADMIN' &&
      user.organizationId !== getOrganizationIdFromRequest(req)
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar usuários fora da sua organização',
      );
    }
    return this.userService.updateUser(Number(id), userData);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Req() req: Request) {
    const userRole = req.user.role;
    const user = await this.userService.getUserById(Number(id));
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    if (
      userRole !== 'ADMIN' &&
      user.organizationId !== getOrganizationIdFromRequest(req)
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para deletar usuários fora da sua organização',
      );
    }
    return this.userService.deleteUser(Number(id));
  }
}
