import { Prisma, PrismaClient } from '@prisma/client';
import path from 'path';
import * as XLSX from 'xlsx';
import { v4 as uuid } from "uuid";
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ExcelProductRow {
    'ID Produk'?: string | number;
    'Nama Produk': string;
    'Harga': number;
    'Stok': number;
    'Deskripsi': string;
    'Url Image': string;
}

const modelsEmbedding = [
    process.env.MODEL_EMBEDDING_PRIMARY || "gemini-embedding-001",
    process.env.MODEL_EMBEDDING_SECONDARY || "gemini-embedding-001",
    process.env.MODEL_EMBEDDING_TERTIARY!
];


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
async function embeddings(text: string) {
    // const response = await this.ollama.embeddings({
    //     model: 'bge-m3',
    //     prompt: text,
    // });

    // const embedding = response.embedding;
    // return embedding;
    for (const modelName of modelsEmbedding) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.embedContent({
                content: {
                    parts: [{ text: text }]
                },
                outputDimensionality: 1024,
            } as any);

            const embedding = result.embedding;
            return embedding.values;
        } catch (err) {
            console.error(`Gagal mendapatkan embedding dari model ${modelName}:`, err);
        }
    }
    throw new Error("Gagal mendapatkan embedding dari semua model yang tersedia.");
}

export async function seedProducts() {
    const prisma = new PrismaClient();
    try {
        const productsFilePath = path.join(__dirname, '../public/data_dummy_products.xlsx');
        const workbook = XLSX.readFile(productsFilePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json<ExcelProductRow>(worksheet);

        let dataToEmbedding: { content: string, imageUrl: string | null }[] = [];

        if (rawData.length > 0) {
            dataToEmbedding = rawData.map((row) => {
                return {
                    content: `id: ${uuid()}, ${Object.entries(row)
                        .map(([key, val]) => `${key}: ${val}`)
                        .join(", ")}`,
                    imageUrl: row["Url Image"]
                }
            });
        }

        if (rawData.length === 0) {
            console.log('⚠️ File Excel kosong, tidak ada data untuk di-seed.');
            return;
        }
        const formattedProducts = rawData.map((row) => {
            return {
                id: row['ID Produk'] ? String(row['ID Produk']) : undefined,
                name: row['Nama Produk'],
                price: Number(row['Harga']) || 0,
                stock: Number(row['Stok']) || 0,
                description: row['Deskripsi'] || '',
                imageUrl: row['Url Image']
            };
        });

        console.log(`⏳ Sedang memasukkan ${formattedProducts.length} produk ke database...`);

        await prisma.product.createMany({
            data: formattedProducts,
            skipDuplicates: true,
        });

        const batchSize = 100;
        const chunkData: { content: string; vector: string, imageUrl: string | null }[] = [];
        for (let i = 0; i < dataToEmbedding.length; i += batchSize) {
            const batch = dataToEmbedding.slice(i, i + batchSize);

            console.log(`Memproses batch ${Math.floor(i / batchSize) + 1}...`);

            const results = await Promise.all(batch.map(async (chunk) => {
                const vector = await embeddings(chunk.content);
                return {
                    content: chunk.content,
                    vector: `[${vector.join(',')}]`,
                    imageUrl: chunk.imageUrl
                };
            }));

            chunkData.push(...results);
            if (i + batchSize < dataToEmbedding.length) {
                console.log("Limit batch tercapai. Menunggu 60 detik agar tidak 429...");
            }
        }

        const values = chunkData.map((d) => {
            return Prisma.sql`(
                        gen_random_uuid(), 
                        ${"Product"},
                        ${d.content}, 
                        ${d.vector}::vector, 
                        ${d.imageUrl},
                        now(), 
                        now()
                    )`;
        });

        await prisma.$executeRaw`
                    INSERT INTO "knowledges" (
                        "id", 
                        "name",
                        "content", 
                        "embedding", 
                        "imageUrl",
                        "created_at", 
                        "updated_at"
                    ) 
                    VALUES ${Prisma.join(values)}
                `;

        console.log('✅ Product seeding completed.');
    } catch (error) {
        console.error('❌ Gagal melakukan seeding product:', error);
    } finally {
        await prisma.$disconnect();
    }
}