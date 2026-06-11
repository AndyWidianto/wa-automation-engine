import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../lib/prisma/prisma.service";
import { AIService } from "../../lib/ai/aiservice";
import { Autoreply } from "@prisma/client";



export interface KnowledgeChunk {
    content: string;
    imageUrl: string | null;
    similarity: number;
    name: string;
}

@Injectable()
export class ChatbotService {
    private mappingAutoreply = new Map<string, Autoreply[]>();
    constructor(
        private prisma: PrismaService,
        private ollama: AIService,
    ) { }

    async chatbot(data: { id: string, message: string }) {
        const rawAutoreply = this.mappingAutoreply.get("ai_rag");
        let autoreply: any = null;
        if (rawAutoreply) {
            try {
                autoreply = typeof rawAutoreply === 'string' ? JSON.parse(rawAutoreply) : rawAutoreply;
            } catch (e) {
                console.error("Gagal melakukan parse JSON ai_rag:", e);
            }
        }
        if (!autoreply) {
            autoreply = await this.prisma.autoreply.findFirst({
                where: { type: "ai_rag", isActive: true }
            });
        }
        if (!autoreply) {
            return { answer: "Layanan sedang non-aktif.", sources: [] };
        }

        let searchMessage = await this.ollama.reWrite(data.id, data.message);

        const userVector = await this.ollama.embeddings(searchMessage);
        const vectorString = `[${userVector.join(',')}]`;

        const contextChunks = await this.prisma.$queryRaw<KnowledgeChunk[]>`
        SELECT content, "imageUrl", "name",  1 - (embedding <=> ${vectorString}::vector) AS similarity
        FROM knowledges
        WHERE 1 - (embedding <=> ${vectorString}::vector) > 0.6
        ORDER BY similarity DESC
        LIMIT 3
        `;
        console.log(contextChunks);
        const contextText = contextChunks.map(c => c.content).join('\n\n');
        const systemRules = `
        ${rawAutoreply?.map(raw => `${raw.aiPrompt} \n`) || 'Asisten...'}

        Aturan:
        - Gunakan data pada KONTEKS sebagai sumber informasi utama.
        - Jika informasi tidak ada di KONTEKS, katakan bahwa informasi tidak tersedia.
        - Jika pelanggan belum memberikan Nama, No HP, atau Alamat, minta data yang masih kurang.
        - Jika Nama, No HP, dan Alamat sudah lengkap, berikan konfirmasi pesanan lalu cetak JSON berikut di baris paling bawah menggunakan tag <order_data>:

        <order_data>
        {
        "isOrderValid": true,
        "customerName": "Nama user",
        "address": "Alamat lengkap user",
        "totalPrice": 225000,
        "items": [
            {
                "id": "product1",
                "price": 140000,
                "nameProduct": "celana x",
                "imageUrl": "https://...",
                "quantity": 2,
            },
            {
                "id": "product2",
                "price": 100000,
                "nameProduct": "celana y",
                "imageUrl": "https://...",
                "quantity": 2,
            }
        ]
        }
        </order_data>

        - Jangan tampilkan <order_data> sebelum semua data lengkap.
        - totalPrice harus berupa angka tanpa format Rupiah.

        KONTEKS:
        ${contextText}

        Contoh output order:

        Baik Kak, ini rincian pesanan Kakak ya:
        - 1x Gamis Syari Khalisa (Rp 245.000)
        - 1x Kopi Susu Gula Aren (Rp 15.000)

        👉 Total Belanjaan: **Rp 260.000**

        Untuk melanjutkan proses pengiriman, silakan isi:
        Nama Penerima:
        No. Handphone:
        Alamat Lengkap:
        `;

        const response = await this.ollama.chatbot(data.id, data.message, systemRules);

        return {
            answer: response,
            confidence: contextChunks[0]?.similarity,
            sources: contextChunks
        };
    }

    async autoreply(id: string, message: string) {
        const existing = await this.prisma.autoreply.findFirst({
            where: {
                name: {
                    contains: message,
                    mode: "insensitive"
                },
                type: "keyword",
                isActive: true,
            }
        });

        if (existing) {
            return {
                answer: existing.replyContent,
            }
        }
        const chatbot = await this.chatbot({ id, message });
        return chatbot;
    }
}