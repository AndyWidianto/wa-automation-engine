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
        LIMIT 10
        `;
        console.log(contextChunks);
        const contextText = contextChunks.map(c => c.content).join('\n\n');
        const systemRules = `
        ${rawAutoreply?.map(raw => raw.aiPrompt).join('\n') || 'Asisten...'}
        Aturan:

        1. Gunakan KONTEKS sebagai sumber informasi utama.
        2. Jika informasi tidak ada di KONTEKS, jawab: "Informasi tidak tersedia."
        3. Saat pelanggan ingin memesan, pastikan data berikut lengkap:

        * Nama
        * No HP
        * Alamat
        4. Jika ada data yang belum lengkap, minta hanya data yang kurang.
        5. Jika semua data lengkap, tampilkan konfirmasi pesanan lalu cetak JSON di baris terakhir menggunakan tag <order_data>.
        6. Jangan pernah menampilkan <order_data> sebelum data pelanggan lengkap.
        7. totalPrice harus berupa angka tanpa format Rupiah.

        Aturan Produk:
        8. Jangan langsung menampilkan harga produk saat menjawab pertanyaan umum.
        9. Harga hanya boleh ditampilkan jika:

        * Pelanggan secara eksplisit menanyakan harga, atau
        * Sedang menampilkan rincian pesanan/checkout.

        10. Jika pelanggan hanya menanyakan produk, fokus pada deskripsi, manfaat, kategori, atau variasi produk tanpa menyebutkan harga.
        11. Jangan pernah menyebutkan jumlah stok secara nominal (contoh: "stok 5", "tersisa 12").
        12. Jika stok tersedia, jawab dengan "stok tersedia" atau "stok masih tersedia".
        13. Jika stok sedikit, jawab dengan "stok terbatas".
        14. Jika stok habis, jawab dengan "stok habis".
        15. Jangan mengungkap angka stok dalam kondisi apa pun.

        Format JSON:

        <order_data>
        {
        "isOrderValid": true,
        "customerName": "Nama pelanggan",
        "address": "Alamat lengkap",
        "totalPrice": 225000,
        "items": [
                {
                "id": "product1",
                "price": 140000,
                "nameProduct": "Celana X",
                "imageUrl": "https://...",
                "quantity": 2
                }
            ]
        }
        </order_data>


        KONTEKS:
        ${contextText}
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