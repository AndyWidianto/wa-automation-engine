import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { AccessTokenStrategy } from "../../lib/guards/access.strategy";
import { ProductController } from "./product.controller";
import { AIService } from "@/lib/ai/aiservice";


@Module({
    providers: [ProductService, AccessTokenStrategy, AIService],
    controllers: [ProductController],
})
export class ProductModule {}