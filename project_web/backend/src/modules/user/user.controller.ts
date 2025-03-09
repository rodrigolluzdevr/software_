import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import type { Role } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
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
