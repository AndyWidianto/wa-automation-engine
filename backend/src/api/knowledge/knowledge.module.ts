import { Module } from "@nestjs/common";
import { KnowledgeService } from "./knowledge.service";
import { AccessTokenStrategy } from "../../lib/guards/access.strategy";
import { AIService } from "../../lib/ai/aiservice";
import { KnowledgeController } from "./knowledge.controller";


@Module({
    providers: [KnowledgeService, AccessTokenStrategy, AIService],
    controllers: [KnowledgeController]
})
export class KnowledgeModule {}