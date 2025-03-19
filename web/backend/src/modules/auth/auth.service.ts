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
    // Fetch user data
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
      },
    });
    if (!user) {
      throw new NotFoundException(
        'Usuário não encontrado, verifique suas credenciais.',
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException(
        'Credenciais inválidas, entre em contato com o admnistrador.',
      );
    }

    const payload = {
      sub: user.id,
      cpf: user.cpf,
      role: user.role,
      organizationId: user.organizationId,
      regions: user.regions && user.regions.length > 0 
        ? user.regions.map(region => ({
            id: region.id,
            name: region.name,
            organizationId: region.organizationId
          }))
        : []
    };
    const token = this.jwtService.sign(payload);

    return { token };
  }
}
