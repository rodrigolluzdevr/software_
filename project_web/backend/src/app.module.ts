import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import * as dotenv from 'dotenv'; // Importando dotenv

// Carregar variáveis do .env
dotenv.config();

@Module({
  imports: [
    UserModule,  // Módulo para gerenciar usuários
    AuthModule,  // Módulo para gerenciar autenticação
  ],
  providers: [PrismaService],  // Serviço para conectar ao banco de dados
})
export class AppModule {}
