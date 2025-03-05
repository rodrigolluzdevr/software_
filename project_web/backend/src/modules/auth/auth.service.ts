import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';  // Importando o PrismaService
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,  // Injeção do PrismaService
    private jwtService: JwtService,  // Injeção do JwtService
  ) {}

  async register(
    email: string,
    password: string,
    name: string,
    role: Role = Role.USER, // Permissão padrão é USER (usando o enum Role)
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: { email, password: hashedPassword, name, role },
    });
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Usuário não encontrado');
  
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('Senha inválida');
  
    const payload = {
      sub: user.id, // ID do usuário
      email: user.email,
      role: user.role, // Role do usuário
    };
  
    const token = this.jwtService.sign(payload); // Gera o token JWT
    return { token }; // Retorna o token como uma string no campo "token"
  }
}