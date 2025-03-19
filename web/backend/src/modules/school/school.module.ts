import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { AuthMiddleware } from 'src/middleware/auth.middleware';

@Module({
  imports: [
      JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '24h' },
      }),
    ],
  providers: [SchoolService, PrismaService],
  controllers: [SchoolController],
  exports: [SchoolService],
})
export class SchoolModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(SchoolController);
  }
}
