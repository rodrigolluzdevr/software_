import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { UserService } from './modules/user/user.service';
import { UserController } from './modules/user/user.controller';
import { AuthService } from './modules/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your_jwt_secret', // Adicione uma chave secreta para assinatura do JWT
      signOptions: { expiresIn: '1h' }, // Defina o tempo de expiração do token
    }),
  ],
  providers: [PrismaService, UserService, AuthService],
  controllers: [UserController],
})
export class AppModule {}
