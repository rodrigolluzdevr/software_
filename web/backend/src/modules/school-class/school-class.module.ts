import { Module, type MiddlewareConsumer, type NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClassService } from './school-class.service';
import { PrismaService } from 'src/database/prisma.service';
import { ClassController } from './school-class.controller';
import { AuthMiddleware } from 'src/middleware/auth.middleware';

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
export class ClassModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ClassController);
  }
}