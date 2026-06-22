import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { AuthGuard } from "@nestjs/passport";
import type { RequestAndPayload } from "../../lib/types";
import { NotificationType } from "@prisma/client";
import { NotificationMarkReadDto } from "@/lib/dto/notification.dto";



@Controller("api/notifications")
export class NotificationController {
    constructor(private service: NotificationService) { }

    @Get()
    @UseGuards(AuthGuard("jwt"))
    async getNotifications(@Req() req: RequestAndPayload, @Query() query: { lastId?: string, limit?: string, search?: string, type?: NotificationType }) {
        const userId = req.user.id;
        return this.service.getAll(userId, query.lastId, query.limit, query.search, query.type);
    }

    @Get("unread")
    @UseGuards(AuthGuard("jwt"))
    async totalUnread(@Req() req: RequestAndPayload) {
        const userId = req.user.id;
        return this.service.countUnread(userId);
    }

    @Get(":id")
    @UseGuards(AuthGuard("jwt"))
    async getNotification(@Param("id") id: string) {
        const notification = await this.service.findOne(id);
        return {
            message: "Succefully",
            data: notification
        }
    }

    @Post("markread")
    @UseGuards(AuthGuard("jwt"))
    async markRead(@Body() body: NotificationMarkReadDto) {
        return this.service.markRead(body.ids);
    }
}