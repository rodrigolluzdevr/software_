import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClassService } from './school-class.service';
import { PrismaService } from 'src/database/prisma.service';
import { ClassController } from './school-class.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [ClassService, PrismaService],
  controllers: [ClassController],
  exports: [ClassService],
})
export class SchoolClassModule {}
