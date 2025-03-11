import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { AuthMiddleware } from '../../middleware/auth.middleware';

@Module({
  controllers: [DashboardController],
})
export class DashboardModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(DashboardController);
  }
}
