import { PrismaService } from "../../lib/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { ChatbotService } from "../chatbot/chatbot.service";
import { MessageService } from "../message/message.service";



@Injectable()
export class WebhookService {
    private statusInstance: Record<string, string> = {};
    constructor(
        private prisma: PrismaService,
        private chatbotService: ChatbotService,
        private messageService: MessageService,
    ) { }
    
    async autoreply(remoteJid: string, message: string) {
        const number = remoteJid.split("@")[0];
        console.log(`Menerima pesan dari ${number}: ${message}`);
        const existing = await this.prisma.autoreply.findFirst({
            where: {
                name: {
                    contains: message,
                    mode: "insensitive"
                },
                type: "keyword"
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

    async updateConnection(instanceName: string, status: string) {
        const prevStatus = this.statusInstance[instanceName];
        if (prevStatus === status) {
            return; 
        }
        this.statusInstance[instanceName] = status;
        await this.prisma.device.updateMany({
            where: {
                instanceName: instanceName,
            },
            data: {
                status: status,
            }
        });
    }
}