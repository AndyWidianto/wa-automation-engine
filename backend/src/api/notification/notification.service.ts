import { PrismaService } from "../../lib/prisma/prisma.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { NotificationType, Prisma } from "@prisma/client";


@Injectable()
export class NotificationService {
    constructor(
        private prisma: PrismaService
    ) { }

    async getAll(userId: string, lastId?: string, limitStr?: string, search?: string, type?: NotificationType) {
        let limit = limitStr ? Number(limitStr) : 4;
        let query: Prisma.NotificationFindManyArgs = {
            where: {
                ...search ? {
                    OR: [
                        { title: { contains: search, mode: "insensitive" } },
                        { content: { contains: search, mode: "insensitive" } }
                    ]
                } : {},
            },
            ...lastId ? {
                cursor: { id: lastId },
                skip: 1
            } : {},
            take: limit,
            orderBy: [
                { isRead: "asc" },
                { id: "desc" }
            ],
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileUrl: true
                    }
                }
            }
        };
        if (type) {
            query.where = {
                ...query.where,
                type: type
            }
        }
        const [notifications, totalNotification] = await this.prisma.$transaction([
            this.prisma.notification.findMany(query),
            this.prisma.notification.count({
                where: query.where
            })
        ])
        return {
            totalPage: Math.ceil(totalNotification / limit),
            total: totalNotification,
            nextId: notifications.length > 0 ? notifications[notifications.length - 1].id : null,
            data: notifications
        }
    }

    async countUnread(userId: string) {
        const totalUnread = await this.prisma.notification.count({
            where: {
                isRead: false
            }
        });
        return {
            totalUnread: totalUnread
        }
    }

    async findOne(id: string) {
        const notification = await this.prisma.notification.findFirst({
            where: { id }
        });
        return notification;
    }

    async markRead(ids: string[]) {
        await this.prisma.notification.updateMany({
            where: {
                id: { in: ids }
            },
            data: {
                isRead: true
            }
        })
        return { message: "update successfully" }
    }
}