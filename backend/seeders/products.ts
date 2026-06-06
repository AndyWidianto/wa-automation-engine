import { OllamaService } from '@/lib/ollama/ollama.service';
import { Prisma, PrismaClient } from '@prisma/client';
import path from 'path';
import * as XLSX from 'xlsx';
import { v4 as uuid } from "uuid";

const prisma = new PrismaClient();
const ollama = new OllamaService();


interface ExcelProductRow {
    'ID Produk'?: string | number;
    'Nama Produk': string;
    'Harga': number;
    'Stok': number;
    'Deskripsi Produk'?: string;
}

export async function seedProducts() {
    try {
        const productsFilePath = path.join(__dirname, '../public/data_dummy_products.xlsx');
        const workbook = XLSX.readFile(productsFilePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json<ExcelProductRow>(worksheet);

        let chunks: string[] = [];
        const allRows = workbook.SheetNames.flatMap(sheetName => {
            return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        });

        if (allRows.length > 0) {
            chunks = allRows.map((row: any) => {
                return `id: ${uuid()}, ${Object.entries(row)
                    .map(([key, val]) => `${key}: ${val}`)
                    .join(", ")}`;
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
                description: row['Deskripsi Produk'] || '',
            };
        });

        console.log(`⏳ Sedang memasukkan ${formattedProducts.length} produk ke database...`);

        await prisma.product.createMany({
            data: formattedProducts,
            skipDuplicates: true,
        });

        const batchSize = 100;
        const chunkData: { content: string; vector: string }[] = [];
        const knowledgeIds = chunks.map(_c => uuid());
        for (let i = 0; i < chunks.length; i += batchSize) {
            const batch = chunks.slice(i, i + batchSize);

            console.log(`Memproses batch ${Math.floor(i / batchSize) + 1}...`);

            const results = await Promise.all(batch.map(async (chunk) => {
                const vector = await ollama.embeddings(chunk);
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
                        ${"Product"},
                        ${d.content}, 
                        ${d.vector}::vector, 
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