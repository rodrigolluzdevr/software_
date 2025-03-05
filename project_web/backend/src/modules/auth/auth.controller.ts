import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from '@prisma/client'; // Importando Role corretamente

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return { token: await this.authService.login(body.email, body.password) };
  }

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; name: string; role?: string },
  ) {
    // Converte a string recebida para o enum Role ou usa USER como padrão
    const roleEnum = Object.values(Role).includes(body.role as Role) 
      ? (body.role as Role) 
      : Role.USER;

    return this.authService.register(body.email, body.password, body.name, roleEnum);
  }
}
