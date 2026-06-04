import { Module } from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import { WebhookController } from "./webhook.controller";
import { EvolutionModule } from "../../lib/evolutions/evolutions.module";
import { ChatbotModule } from "../chatbot/chatbot.module";
import { MessageModule } from "../message/message.module";


@Module({
    providers: [WebhookService],
    controllers: [WebhookController],
    imports: [EvolutionModule, ChatbotModule, MessageModule],
    exports: [WebhookService],
})
export class WebhookModule {}

