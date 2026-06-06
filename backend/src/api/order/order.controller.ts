import { Body, Controller, Get, Param, Patch, Query } from "@nestjs/common";
import { OrderService } from "./order.service";
import { UpdateOrderDto } from "@/lib/dto/order.dto";



@Controller("api/orders")
export class OrderController {

    constructor(private service: OrderService) {}

    @Patch(":id")
    async updateOrder(@Param("id") id: string, @Body() body: UpdateOrderDto) {
        this.service.update(id, body);
    }

    @Get()
    async getAllOrder(@Query() query: { limit?: string, lastId?: string }) {
        return this.service.getAll(query.limit, query.lastId);
    }
}