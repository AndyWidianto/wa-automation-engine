import { PrismaService } from "../../lib/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { ChatbotService } from "../chatbot/chatbot.service";



@Injectable()
export class WebhookService {
    private statusInstance: Record<string, string> = {};
    private phoneNumber: Record<string, string | null> = {};
    constructor(
        private prisma: PrismaService,
        private chatbotService: ChatbotService,
    ) { }

    async autoreply(remoteJid: string, message: string) {
        const existing = await this.prisma.autoreply.findFirst({
            where: {
                name: {
                    contains: message,
                    mode: "insensitive"
                },
                type: "keyword",
                isActive: true
            }
        });

        if (existing) {
            return {
                success: true,
                message: existing.replyContent,
            }
        }
        const chatbot = await this.chatbotService.chatbot({ id: remoteJid, message: message });
        if (chatbot?.answer) {
            const parseAIChat = this.convertMarkdownToWhatsApp(chatbot.answer);
            return {
                success: true,
                message: parseAIChat,
                data: chatbot.sources ? chatbot.sources : []
            }
        }

        return { success: false };
    }
    convertMarkdownToWhatsApp(text: string) {
        if (!text) return "";

        let formattedText = text;
        formattedText = formattedText.replace(/`{1,3}([\s\S]*?)`{1,3}/g, '```$1```');
        formattedText = formattedText.replace(/\*\*\*(.*?)\*\*\*/g, '*_$1_*');
        formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '*$1*');
        formattedText = formattedText.replace(/~~(.*?)\s*~~/g, '~$1~');
        formattedText = formattedText.replace(/(^|[^\*\s])\*([^\*\s][^\*]*[^\*\s])\*([^\*\s]|$)/g, '$1_$2_$3');
        formattedText = formattedText.replace(/^>\s+/gm, '> ');
        formattedText = formattedText.replace(/^[ \t]*[*+-][ \t]+/gm, '• ');
        formattedText = formattedText.replace(/^[ \t]*(\d+)\.[ \t]+/gm, '$1. ');

        return formattedText.trim();
    }

    async updateConnection(instanceName: string, status: string, phoneNumber?: string) {
        const prevStatus = this.statusInstance[instanceName];
        const prevPhoneNumber = this.phoneNumber[instanceName];
        if (prevStatus === status && prevPhoneNumber === phoneNumber) {
            return;
        }
        this.statusInstance[instanceName] = status;
        this.phoneNumber[instanceName] = phoneNumber || null;
        await this.prisma.device.updateMany({
            where: {
                instanceName: instanceName,
            },
            data: {
                status: status,
                number: phoneNumber
            }
        });
    }
}