import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../../database/prisma.service'; // Ajuste o caminho para o módulo
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [DashboardService, PrismaService],
  controllers: [DashboardController],
  exports: [DashboardService],
})
export class DashboardModule {}
