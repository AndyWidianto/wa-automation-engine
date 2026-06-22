import { PrismaService } from "../../lib/prisma/prisma.service";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateKnowledgeAI, PayloadJWT } from "../../lib/types";
import * as XLSX from 'xlsx';
import { Prisma } from "@prisma/client";
import { AIService } from "../../lib/ai/aiservice";
import { notificationTemplates } from "@/lib/shared/notification";

const pdf = require('pdf-parse-fork');



@Injectable()
export class KnowledgeService {
    constructor(
        private prisma: PrismaService,
        private ollama: AIService
    ) { }

    async createKnowledge(user: PayloadJWT, data: CreateKnowledgeAI) {
        if (user.role === "review") {
            throw new BadRequestException("Akses ditolak. Role Review hanya diperbolehkan melihat data.")
        }
        let rawText = data.content || '';
        let chunks: string[] = [];
        const chunkSize = 1000;
        const chunkOverlap = 200;

        if (data.file) {
            const mimetype = data.file.mimetype;

            if (mimetype === 'application/pdf') {
                const pdfData = await pdf(data.file.buffer);
                rawText = pdfData.text;
            }
            else if (mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || mimetype === 'application/vnd.ms-excel') {
                const workbook = XLSX.read(data.file.buffer, { type: 'buffer' });
                const allRows = workbook.SheetNames.flatMap(sheetName => {
                    return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                });

                if (allRows.length > 0) {
                    chunks = allRows.map((row: any) => {
                        return Object.entries(row)
                            .map(([key, val]) => `${key}: ${val}`)
                            .join(", ");
                    });
                }
            }
            else if (mimetype === 'text/plain') {
                rawText = data.file.buffer.toString('utf-8');
            }
            else {
                throw new BadRequestException("Format file tidak didukung (Gunakan PDF, Excel, atau TXT)");
            }
        }

        if (rawText && rawText.trim()) {
            chunks = this.splitText(rawText, chunkSize, chunkOverlap);
        }
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms * 1000));
        const chunkData: { content: string; vector: string }[] = [];
        // if (chunks.length > 95) {
        //     throw new BadRequestException({
        //         statusCode: 400,
        //         message: 'Data terlalu besar, Mas! Maksimal 95 chunk sekali jalan biar server nggak meledak.',
        //         error: 'Bad Request',
        //         hint: 'Coba pecah dokumen Anda menjadi beberapa bagian kecil atau upload secara bertahap.'
        //     });
        // }
        const batchSize = 10;
        for (let i = 0; i < chunks.length; i += batchSize) {
            const batch = chunks.slice(i, i + batchSize);

            console.log(`Memproses batch ${Math.floor(i / batchSize) + 1}...`);

            const results = await Promise.all(batch.map(async (chunk) => {
                const vector = await this.ollama.embeddings(chunk);
                return {
                    content: chunk,
                    vector: `[${vector.join(',')}]`
                };
            }));

            chunkData.push(...results);
            if (i + batchSize < chunks.length) {
                console.log("Limit batch tercapai. Menunggu 60 detik agar tidak 429...");
            }
        }

        const values = chunkData.map((d) => {
            return Prisma.sql`(
                gen_random_uuid(), 
                ${data.name},
                ${d.content}, 
                ${d.vector}::vector, 
                now(), 
                now()
            )`;
        });

        await this.prisma.$executeRaw`
            INSERT INTO "knowledges" (
                "id", 
                "name",
                "content", 
                "embedding", 
                "created_at", 
                "updated_at"
            ) 
            VALUES ${Prisma.join(values)}
        `;

        const dataNotif = notificationTemplates.knowledge.create;

        await this.prisma.notification.create({
            data: {
                title: dataNotif.title,
                content: dataNotif.getContent(data.name),
                type: "SUCCESS",
                isRead: false,
                userId: user.id,
                metaJson: {
                    name: data.name,
                    content: data.content,
                    filename: data.file?.filename,
                }
            }
        });

        return {
            message: "Knowledge processed and vectorized",
            totalChunks: chunks.length
        };
    }

    private splitText(text: string, size: number, overlap: number): string[] {
        const chunks: string[] = [];
        let i = 0;
        const cleanText = text.replace(/\0/g, '').trim();

        while (i < cleanText.length) {
            chunks.push(cleanText.slice(i, i + size));
            i += size - overlap;
        }
        return chunks;
    }


    async getAllKnowledge(lastId?: string, limitStr?: string, search?: string) {
        let limit = 10;
        if (limitStr && limitStr.trim()) {
            limit = Number(limitStr);
        }

        const query: Prisma.KnowledgeFindManyArgs = {
            take: limit,
            orderBy: { id: 'asc' },
        };

        if (lastId) {
            query.cursor = { id: lastId };
            query.skip = 1;
        }
        if (search) {
            query.where = {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    },
                    {
                        content: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    },
                ]
            };
        }

        const [knowledges, totalKnowledge] = await this.prisma.$transaction([
            this.prisma.knowledge.findMany(query),
            this.prisma.knowledge.count({
                where: query.where
            })
        ]);
        const totalPage = Math.ceil(totalKnowledge / limit);
        const nextCursor = knowledges.length === limit ? knowledges[knowledges.length - 1].id : null;

        return {
            knowledges,
            totalPage,
            nextCursor,
            totalData: totalKnowledge
        };
    }

    async findOne(id: string) {
        const existing = await this.prisma.knowledge.findFirst({
            where: { id }
        });
        if (!existing) {
            throw new NotFoundException("Knowledge not found");
        }
        return existing;
    }

    async deleteKnowledge(user: PayloadJWT, id: string) {
        if (user.role === "review") {
            throw new BadRequestException("Akses ditolak. Role Review hanya diperbolehkan melihat data.")
        }
        const exisitng = await this.findOne(id);
        await this.prisma.knowledge.delete({
            where: { id: exisitng.id }
        });
        const dataNotif = notificationTemplates.knowledge.delete;
        await this.prisma.notification.create({
            data: {
                title: dataNotif.title,
                content: dataNotif.getContent(exisitng.name),
                type: "SUCCESS",
                isRead: false,
                metaJson: exisitng
            }
        });
        return { message: "Delete knowledge successfully" };
    }

    async updateKnowledge(user: PayloadJWT, id: string, data: Partial<CreateKnowledgeAI>) {
        if (user.role === "review") {
            throw new BadRequestException("Akses ditolak. Role Review hanya diperbolehkan melihat data.")
        }
        const existing = await this.findOne(id);
        const updateKnowledge = await this.prisma.knowledge.update({
            where: { id: existing.id },
            data: data
        });
        const dataNotif = notificationTemplates.knowledge.update;
        await this.prisma.notification.create({
            data: {
                title: dataNotif.title,
                content: dataNotif.getContent(existing.name),
                type: "SUCCESS",
                isRead: false,
                userId: user.id,
                metaJson: existing
            }
        });
        return updateKnowledge;
    }
}