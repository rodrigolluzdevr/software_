import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import * as dotenv from 'dotenv'; // Importando dotenv
import { RegionModule } from './modules/region/region.module';
import { SchoolModule } from './modules/school/school.module';
import { ClassModule } from './modules/school-class/school-class.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

// Carregar variáveis do .env
dotenv.config();

@Module({
  imports: [
    UserModule,
    AuthModule,
    RegionModule,
    SchoolModule,
    ClassModule,
    OrganizationModule,
    DashboardModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
