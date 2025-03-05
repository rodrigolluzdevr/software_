import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';  // Importando o PrismaService
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,  // Injeção do PrismaService
    private jwtService: JwtService  // Injeção do JwtService
  ) {}

  async register(email: string, password: string, name: string) {
    // Fazendo o hash da senha antes de salvar no banco
    const hashedPassword = await bcrypt.hash(password, 10);
    // Criando o usuário no banco de dados
    return this.prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
  }

  async login(email: string, password: string) {
    // Verificando se o usuário existe
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Usuário não encontrado');

    // Comparando a senha fornecida com a senha armazenada no banco
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('Senha inválida');

    // Gerando o token JWT
    return this.jwtService.sign({ email });
  }
}
