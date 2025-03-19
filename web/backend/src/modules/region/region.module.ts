import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RegionService } from './region.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { RegionController } from './region.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [RegionService, PrismaService],
  controllers: [RegionController],
  exports: [RegionService],
})
export class RegionModule {}
