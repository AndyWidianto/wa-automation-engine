import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { MessageService } from "./message.service";
import { AuthGuard } from "@nestjs/passport";
import { CreateMessageDto, SendMessageDto } from "../../lib/dto/message.dto";


@Controller("api/messages")
export class MessageController {
    constructor(private service: MessageService) {}

    @Post()
    @UseGuards(AuthGuard("jwt"))
    async createMessage(@Body() body: CreateMessageDto) {
        return this.service.create({...body, fromMe: true });
    }

    @Get("stats")
    @UseGuards(AuthGuard("jwt"))
    async getStats() {
        return this.service.Stats();
    }

    @Post("send")
    @UseGuards(AuthGuard("jwt"))
    async sendMessage(@Body() body: SendMessageDto) {
        return await this.service.sendMessage(body);
    }
}