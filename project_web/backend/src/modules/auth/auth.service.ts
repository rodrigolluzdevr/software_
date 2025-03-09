import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service'; // Importando o PrismaService
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService, // Injeção do PrismaService
    private jwtService: JwtService, // Injeção do JwtService
  ) {}

  
  async createUser(userData: {
    cpf: string;
    password: string;
    name: string;
    role: Role;
    email: string;
    address: string;
    cep: string;
    numberAdress: string;
    organizationId: number;
  }) {
    const hashPassword = await bcrypt.hash(userData.password, 10)
    return this.prisma.user.create({
      data: {
        cpf: userData.cpf,
        password: hashPassword,
        name: userData.name,
        role: userData.role,
        email: userData.email,
        address: userData.address,
        cep: userData.cep,
        numberAdress: userData.numberAdress,
        organization: {
          connect: { id: userData.organizationId }, // Conecta à organização existente
        },
      },
    });
  }

  async login(cpf: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { cpf },
      select: {
        id: true,
        cpf: true,
        password: true,
        role: true,
      },
    });

    if (!user) throw new Error('Usuário não encontrado');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('Senha inválida');

    const payload = {
      sub: user.id, // ID do usuário
      cpf: user.cpf,
      role: user.role, // Role do usuário
    };

    const token = this.jwtService.sign(payload); // Gera o token JWT
    return { token }; // Retorna o token como uma string no campo "token"
  }
}
