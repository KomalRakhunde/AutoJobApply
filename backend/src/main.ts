import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000', 'http://127.0.0.1:3001'],
    credentials: true,
  });

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`Backend server running on http://localhost:${port}`);
}
bootstrap();