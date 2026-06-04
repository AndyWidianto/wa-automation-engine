import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import CookieParser from "cookie-parser";

async function bootstrap() {
  const whitelist = [
    'http://localhost:5173',
    process.env.BASE_URL_CLIENT,
    'https://asistenumkm.my.id',
    'https://www.asistenumkm.my.id'
  ];
  const app = await NestFactory.create(AppModule);
  app.use(CookieParser())
  app.enableCors({
    origin: whitelist,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  })
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
