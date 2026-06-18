import { EventGateway } from "@/event/event.gateway";
import { UpdateOrderDto } from "@/lib/dto/order.dto";
import { PrismaService } from "@/lib/prisma/prisma.service";
import { OrderClient } from "@/lib/types";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Order, OrderItem, Prisma } from "@prisma/client";



@Injectable()
export class OrderService {
    constructor(
        private readonly prisma: PrismaService,
        private gateway: EventGateway
    ) { }


    async create(orderData: OrderClient, remoteJid: string, instanceName: string) {
        const dataToSave: Omit<OrderItem, "id" | "orderId">[] = orderData.items.map(item => ({
            price: item.price,
            productId: item.id,
            quantity: item.quantity
        }));
        const totalOrder = await this.prisma.order.count();
        const orderId = `ORDER-${totalOrder >= 100 ? totalOrder : totalOrder >= 10 ? `0${totalOrder}` : `00${totalOrder}`}`
        const number = remoteJid.split("@")[0];
        const newOrders = this.prisma.order.create({
            data: {
                id: orderId,
                totalPrice: orderData.totalPrice,
                instanceName: instanceName,
                details: JSON.stringify({
                    ...orderData,
                    phone: number,
                    remoteJid: remoteJid
                }),
                orderItems: {
                    create: dataToSave
                }
            },
            include: {
                orderItems: true
            }
        });
        this.gateway.server.emit("incoming_order", [newOrders]);
        return newOrders;
    }
    async update(id: string, data: UpdateOrderDto) {
        await this.findOne(id);
        return await this.prisma.order.update({
            where: { id },
            data: data
        });
    }
    async findOne(id: string) {
        const existing = await this.prisma.order.findUnique({
            where: { id }
        });
        if (!existing) {
            throw new NotFoundException("order not found");
        }
        existing.details = existing.details ? JSON.parse(existing.details.toString()) : existing.details;
        return existing;
    }

    async getAll(limitStr?: string, lastId?: string, status?: string, except?: string) {
        const limit = limitStr ? Number(limitStr) : 20;
        const conditions: Prisma.Sql[] = [];
        if (lastId) {
            conditions.push(Prisma.sql`id < ${lastId}`);
        }
        if (status) {
            conditions.push(Prisma.sql`status = ${status}`);
        }
        if (except) {
            conditions.push(Prisma.sql`status != ${except}`);
        }
        const whereClause = conditions.length > 0
            ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`
            : Prisma.empty;
        const [orders, totalResult] = await this.prisma.$transaction([
            this.prisma.$queryRaw<Order[]>`
                SELECT "totalPrice", id, status, details, updated_at as "updatedAt", created_at as "createdAt", "instanceName" FROM orders
                ${whereClause}
                ORDER BY 
                    CASE 
                    WHEN status = 'pending' THEN 1 
                    WHEN status = 'process' THEN 2
                    WHEN status = 'on_delivery' THEN 3
                    ELSE 4 
                    END ASC,
                    id DESC
                LIMIT ${limit};
                `,
            this.prisma.$queryRaw<{ count: BigInt }[]>`
                SELECT COUNT(*) as count FROM orders ${whereClause};`
        ]);
        const totalOrder = Number(totalResult[0]?.count || 0);
        return {
            orders: orders,
            totalOrder,
            nextId: orders.length > 0 ? orders[orders.length - 1].id : null,
            totalPage: Math.ceil(totalOrder / limit)
        }
    }
    async delete(id: string) {
        const existing = await this.findOne(id);
        await this.prisma.order.delete({
            where: { id: existing.id }
        });
        return { message: "Delete successfully" };
    }

    async stats() {
        const [totalPending, totalCompleted, totalProcess] = await this.prisma.$transaction([
            this.prisma.order.count({
                where: {
                    status: "pending"
                }
            }),
            this.prisma.order.count({
                where: {
                    status: "completed"
                }
            }),
            this.prisma.order.count({
                where: {
                    status: "process"
                }
            })
        ]);
        return {
            total: totalPending + totalCompleted + totalProcess,
            totalPending,
            totalCompleted,
            totalProcess
        }
    }
}