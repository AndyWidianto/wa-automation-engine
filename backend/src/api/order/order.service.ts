import { EventGateway } from "@/event/event.gateway";
import { UpdateOrderDto } from "@/lib/dto/order.dto";
import { PrismaService } from "@/lib/prisma/prisma.service";
import { OrderClient } from "@/lib/types";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Notification, NotificationType, Order, OrderItem, Prisma } from "@prisma/client";



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
        const newOrder = await this.prisma.order.create({
            data: {
                id: orderId,
                totalPrice: orderData.totalPrice,
                instanceName: instanceName,
                details: {
                    ...orderData,
                    phone: number,
                    remoteJid: remoteJid
                },
                orderItems: {
                    create: dataToSave
                }
            },
            include: {
                orderItems: true
            }
        });
        this.gateway.server.emit("incoming_order", [newOrder]);
        const transactionUpdateProduct = orderData.items.map(i => this.prisma.product.update({
            where: {
                id: i.id,
                stock: { gte: 1 }
            },
            data: {
                stock: { decrement: i.quantity }
            }
        }))
        await this.prisma.$transaction([
            this.prisma.notification.create({
                data: {
                    title: "Pesanan Baru Masuk!",
                    content: `Ada pesanan baru #${newOrder.id.slice(0, 8)} dari ${orderData.customerName} sebesar Rp ${newOrder.totalPrice.toLocaleString('id-ID')}. Segera periksa dan proses!`,
                    type: "SUCCESS",
                    isRead: false,
                    metaJson: {
                        orderId: newOrder.id,
                        status: newOrder.status,
                        actionRequired: "PROCESS_NOW"
                    },
                }
            }),
            ...transactionUpdateProduct
        ]);
        return newOrder;
    }
    async update(id: string, data: UpdateOrderDto) {
        await this.findOne(id);
        const updateOrder = await this.prisma.order.update({
            where: { id },
            data: data
        });

        const orderDetails = (updateOrder.details as any) || {};
        const customerName = orderDetails.customerName || "Pelanggan";
        const orderShortId = updateOrder.id.slice(0, 8);
        const formattedPrice = updateOrder.totalPrice.toLocaleString('id-ID');
        const statusConfig: Record<string, { title: string; content: string; type: NotificationType }> = {
            pending: {
                title: "Pesanan Baru Masuk",
                content: `Pesanan #${orderShortId} dari ${customerName} senilai Rp ${formattedPrice} menunggu pembayaran atau konfirmasi.`,
                type: NotificationType.INFO
            },
            delivered: {
                title: "Order Berhasil Diproses",
                content: `Pesanan #${orderShortId} dari ${customerName} senilai Rp ${formattedPrice} telah berhasil diproses dan sedang dikirim.`,
                type: NotificationType.SUCCESS
            },
            completed: {
                title: "Pesanan Selesai",
                content: `Pesanan #${orderShortId} telah diterima oleh ${customerName}. Transaksi selesai.`,
                type: NotificationType.SUCCESS
            },
            cancelled: { // Tambahan opsional jika ada status batal
                title: "Pesanan Dibatalkan",
                content: `Pesanan #${orderShortId} dari ${customerName} telah dibatalkan.`,
                type: NotificationType.ERROR
            }
        };

        const currentStatus = data.status;
        if (currentStatus) {
            const config = statusConfig[currentStatus] || {
                title: "Pembaruan Pesanan",
                content: `Pesanan #${orderShortId} mengalami perubahan status menjadi ${currentStatus}.`,
                type: NotificationType.INFO
            };

            await this.prisma.notification.create({
                data: {
                    title: config.title,
                    content: config.content,
                    type: config.type,
                    isRead: false,
                    metaJson: {
                        orderId: updateOrder.id,
                        status: updateOrder.status,
                        total: updateOrder.totalPrice
                    },
                }
            });
        }
        return updateOrder;
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
                    status: "on_delivery"
                }
            })
        ]);
        return {
            total: totalPending + totalCompleted + totalProcess,
            totalPending,
            totalCompleted,
            totalProcess,
        }
    }
}