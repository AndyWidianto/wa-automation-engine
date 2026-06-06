import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { AccessTokenStrategy } from "../../lib/guards/access.strategy";
import { ProductController } from "./product.controller";
import { OllamaService } from "@/lib/ollama/ollama.service";


@Module({
    providers: [ProductService, AccessTokenStrategy, OllamaService],
    controllers: [ProductController],
})
export class ProductModule {}