import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './lib/prisma/prisma.module';
import { ApiModule } from './api/api.module';
import { EventModule } from './event/event.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { StorageModule } from './lib/storage/storage.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    ApiModule,
    EventModule,
    WhatsappModule,
    StorageModule,
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
