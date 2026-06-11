import { Module } from "@nestjs/common";
import { ChatbotService } from "./chatbot.service";
import { AIService } from "../../lib/ai/aiservice";
import { ChatbotController } from "./chatbot.controller";
import { AccessTokenStrategy } from "../../lib/guards/access.strategy";



@Module({
    providers: [ChatbotService, AIService, AccessTokenStrategy],
    controllers: [ChatbotController],
    exports: [ChatbotService]
})
export class ChatbotModule {}