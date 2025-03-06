import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { AuthMiddleware } from '../../middleware/auth.middleware'; // Importe o middleware de autenticação

@Module({
  controllers: [DashboardController], // Controller que contém as rotas do painel
})
export class DashboardModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Aplicando o AuthMiddleware para todas as rotas do DashboardController
    consumer.apply(AuthMiddleware).forRoutes(DashboardController); // Protege todas as rotas do DashboardController
  }
}
