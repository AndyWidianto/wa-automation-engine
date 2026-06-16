import { WhatsappService } from "@/whatsapp/whatsapp.service";
import { EventGateway } from "../../event/event.gateway";
import { PrismaService } from "../../lib/prisma/prisma.service";
import { CreateMessage } from "../../lib/types";
import { Injectable } from "@nestjs/common";


interface Stat {
    label: string;
    count: number;
}
@Injectable()
export class MessageService {
    constructor(
        private prisma: PrismaService,
        private gatewat: EventGateway,
        private whatsapp: WhatsappService
    ) { }

    async create(data: CreateMessage) {
        const number = data.remoteJid.split("@")[0];
        const receiver = {
            name: data.pushName,
            number: number,
            message: data.content
        }
        this.gatewat.server.emit("receiver_message", receiver);
        const message = await this.prisma.message.create({
            data: { ...data }
        });
        console.log(message);
        return message;
    }

    async Stats() {
        const stats: Stat[] = [];
        const now = new Date();

        // Loop untuk 7 hari terakhir (termasuk hari ini)
        for (let i = 6; i >= 0; i--) {
            const startOfDay = new Date(now);
            startOfDay.setDate(now.getDate() - i);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(now);
            endOfDay.setDate(now.getDate() - i);
            endOfDay.setHours(23, 59, 59, 999);

            // Hitung jumlah pesan di hari tersebut
            const count = await this.prisma.message.count({
                where: {
                    createdAt: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                },
            });

            // Format tanggal untuk label ApexCharts (contoh: "29 Apr")
            const label = startOfDay.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
            });

            stats.push({ label, count });
        }

        return {
            labels: stats.map(s => s.label),
            data: stats.map(s => s.count),
        };
    }

    async sendMessage(data: { number: string, message: string, instanceName: string }, file?: Express.Multer.File) {
        await this.whatsapp.sendMessage(data.instanceName, data.number, data.message);
        return {
            success: true,
            message: "send message successfully"
        }
    }
}