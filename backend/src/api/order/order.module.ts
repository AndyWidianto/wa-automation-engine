import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { AccessTokenStrategy } from "@/lib/guards/access.strategy";



@Module({
    providers: [OrderService, AccessTokenStrategy],
    controllers: [OrderController]
})
export class OrderModule {};