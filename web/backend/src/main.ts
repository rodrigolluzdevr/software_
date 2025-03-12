import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';


dotenv.config({ path: '../infra/.env' });


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para localhost:3000
  app.enableCors({
    origin: 'http://localhost:3000',
  });

  await app.listen(4000);
}

bootstrap();
