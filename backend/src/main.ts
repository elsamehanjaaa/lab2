import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.json()); // usually auto-enabled

  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000', // Your Next.js frontend URL

    credentials: true,
  });
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
