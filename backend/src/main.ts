import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import CookieParser from "cookie-parser";
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const baseOrigin = configService.get("BASE_URL_CLIENT")
  const whitelist = [
    'http://localhost:5173',
    baseOrigin,
    'https://asistenumkm.my.id',
    'https://www.asistenumkm.my.id'
  ];
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
  await app.listen(configService.get("PORT") ?? 3000);
}
bootstrap();
