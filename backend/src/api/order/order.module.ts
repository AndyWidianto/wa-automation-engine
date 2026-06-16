import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { AccessTokenStrategy } from "@/lib/guards/access.strategy";
import { EventModule } from "@/event/event.module";



@Module({
    providers: [OrderService, AccessTokenStrategy],
    controllers: [OrderController],
    exports: [OrderService],
    imports: [EventModule]
})
export class OrderModule {};