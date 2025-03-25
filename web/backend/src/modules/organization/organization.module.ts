import { Module, type MiddlewareConsumer, type NestModule } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
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
  providers: [OrganizationService, PrismaService],
  controllers: [OrganizationController],
  exports: [OrganizationService],
})
export class OrganizationModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(OrganizationController);
    }
}
