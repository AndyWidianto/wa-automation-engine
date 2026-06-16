import { Module } from "@nestjs/common";
import { MessageService } from "./message.service";
import { AccessTokenStrategy } from "../../lib/guards/access.strategy";
import { MessageController } from "./message.controller";
import { EventModule } from "../../event/event.module";
import { WhatsappModule } from "@/whatsapp/whatsapp.module";


@Module({
    providers: [MessageService, AccessTokenStrategy],
    controllers: [MessageController],
    imports: [
        EventModule,
        WhatsappModule
    ],
    exports: [MessageService]
})
export class MessageModule {}