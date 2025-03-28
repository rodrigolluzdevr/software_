import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
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
    // ...existing code...
    const hashPassword = await bcrypt.hash(userData.password, 10);
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
          connect: { id: userData.organizationId },
        },
      },
    });
  }

  async login(cpf: string, password: string) {
    // Buscar usuário por CPF e selecionar regiões, escolas e classes
    const user = await this.prisma.user.findUnique({
      where: { cpf },
      select: {
        id: true,
        cpf: true,
        password: true,
        role: true,
        organizationId: true,
        regions: {
          select: {
            id: true,
            name: true,
            organizationId: true,
          },
        },
        schools: {
          select: {
            id: true,
            name: true,
            regionId: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
            schoolId: true,
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado, verifique suas credenciais.');
    }

    // Conferir senha
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException(
        'Credenciais inválidas, entre em contato com o administrador.',
      );
    }

    // Montar payload do token
    const payload = {
      sub: user.id,
      cpf: user.cpf,
      role: user.role,
      organizationId: user.organizationId,
      regions: user.regions?.length
        ? user.regions.map((region) => ({
            id: region.id,
            name: region.name,
            organizationId: region.organizationId,
          }))
        : [],
      schools: user.schools?.length
        ? user.schools.map((school) => ({
            id: school.id,
            name: school.name,
            regionId: school.regionId,
          }))
        : [],
      class: user.class?.length
        ? user.class.map((cls) => ({
            id: cls.id,
            name: cls.name,
            schoolId: cls.schoolId,
          }))
        : [],
    };

    // Assinar token
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        cpf: user.cpf,
        role: user.role,
        organizationId: user.organizationId,
        regions: payload.regions,
        schools: payload.schools,
        class: payload.class,
      },
    };
  }
}