import { UpdateOrderDto } from "@/lib/dto/order.dto";
import { PrismaService } from "@/lib/prisma/prisma.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";



@Injectable()
export class OrderService {
    constructor(
        private prisma: PrismaService
    ) {}

    async update(id: string, data: UpdateOrderDto) {
        await this.findOne(id);
        return await this.prisma.order.update({
            where: { id },
            data: data
        })
    }
    async findOne(id: string) {
        const existing = await this.prisma.order.findUnique({
            where: { id }
        });
        if (!existing) {
            throw new NotFoundException("order not found");
        }
        return existing;
    }

    async getAll(limitStr?: string, lastId?: string) {
        const limit = limitStr ? Number(limitStr) : 20;
        let query: Prisma.OrderFindManyArgs = {
            ...lastId ? {
                cursor: {
                    id: lastId,
                },
                skip: 1,
            } : {},
            take: limit,
            orderBy: {
                id: "desc"
            }
        };
        const [orders, totalOrder] = await this.prisma.$transaction([
            this.prisma.order.findMany(query),
            this.prisma.order.count()
        ]);
        return {
            orders: orders,
            totalOrder,
            nextId: orders.length > 0 ? orders[orders.length -1].id : null,
            totalPage: Math.ceil(totalOrder / limit)
        }
    }
}