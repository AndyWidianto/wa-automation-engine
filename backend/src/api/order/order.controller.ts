import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
import { UpdateOrderDto } from "@/lib/dto/order.dto";
import { AuthGuard } from "@nestjs/passport";



@Controller("api/orders")
export class OrderController {

    constructor(private service: OrderService) {}

    @Patch(":id")
    @UseGuards(AuthGuard("jwt"))
    async updateOrder(@Param("id") id: string, @Body() body: UpdateOrderDto) {
        this.service.update(id, body);
    }

    @Get()
    async getAllOrder(@Query() query: { limit?: string, lastId?: string, search?: string, status?: string, except?: string }) {
        return await this.service.getAll(query.limit, query.lastId, query.status, query.except);
    }

    @Delete(":id")
    @UseGuards(AuthGuard("jwt"))
    async delete(@Param("id") id: string) {
        return this.service.delete(id);
    }

    @Get("stats")
    @UseGuards(AuthGuard("jwt"))
    async stats() {
        return this.service.stats();
    }
}