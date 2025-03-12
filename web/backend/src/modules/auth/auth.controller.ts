import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from '@prisma/client'; // Importando Role corretamente

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { cpf: string; password: string }) {
    return { token: await this.authService.login(body.cpf, body.password) };
  }

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; name: string; role: string; cpf: string; address: string; cep: string; numberAdress: string; organizationId: number },
  ) {
    const roleEnum = Object.values(Role).includes(body.role as Role) 
      ? (body.role as Role) 
      : Role.USER;

    return this.authService.createUser({
      email: body.email,
      password: body.password,
      name: body.name,
      role: roleEnum,
      cpf: body.cpf, // Adicione valores padrão ou peça no body
      address: body.address,
      cep: body.cep,
      numberAdress: body.numberAdress,
      organizationId: body.organizationId, // Adicione um valor padrão ou peça no body
    });
  }
}
