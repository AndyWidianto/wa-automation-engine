import { CreateProductDto, UpdateProductDto } from "@/lib/dto/product.dto";
import { OllamaService } from "@/lib/ollama/ollama.service";
import { PrismaService } from "@/lib/prisma/prisma.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Product, Prisma } from "@prisma/client";

@Injectable()
export class ProductService {
    constructor(
        private prisma: PrismaService,
        private aiService: OllamaService
    ) { }

    async create(data: CreateProductDto, file?: Express.Multer.File) {
        const dataToSave: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
            name: data.name,
            description: data.description,
            price: data.price,
            imageUrl: null,
            fileName: null,
            stock: data.stock
        }

        const product = await this.prisma.product.create({
            data: dataToSave
        });
        const contentProduct = Object.entries(product).map(([key, val]) => `${key}: ${val}`).join(", ");
        const embeddings = await this.aiService.embeddings(contentProduct);
        const values = [
            Prisma.sql`(
                gen_random_uuid(), 
                ${product.name},
                ${contentProduct}, 
                ${`[${embeddings.join(",")}]`}::vector, 
                ${product.id},
                now(), 
                now()
            )`
        ]

        await this.prisma.$executeRaw`
            INSERT INTO "knowledges" (
                "id", 
                "name",
                "content", 
                "embedding", 
                "productId",
                "created_at", 
                "updated_at"
            ) 
            VALUES ${Prisma.join(values)}
        `;
        return product;
    }
    async getAll(search?: string, lastId?: string, limitStr?: string) {
        const limit = limitStr ? Number(limitStr) : 20;
        let query: Prisma.ProductFindManyArgs = {
            where: {
                ...search ? {
                    name: {
                        contains: search,
                        mode: "insensitive"
                    },
                    description: {
                        contains: search,
                        mode: "insensitive",
                    }
                } : {}
            },
            ...lastId ? {
                cursor: {
                    id: lastId
                },
                skip: 1
            } : {},
            take: limit,
            orderBy: {
                id: "desc",
            }
        }
        const [products, totalProduct] = await this.prisma.$transaction([
            this.prisma.product.findMany(query),
            this.prisma.product.count({
                where: query.where
            })
        ]);
        return {
            data: products,
            totalPage: Math.ceil(totalProduct / limit),
            total: totalProduct,
            nextId: products.length > 0 ? products[products.length - 1].id : null,
        }
    }
    async update(id: string, data: UpdateProductDto) {
        const existing = await this.findOne(id);

        const knowledge = await this.prisma.knowledge.findFirst({
            where: {
                productId: existing.id
            }
        });

        const update = await this.prisma.product.update({
            where: { id },
            data: data
        });
        const contentEmbedding = Object.entries(update).map(([key, val]) => `${key}: ${val}`).join(", ");
        const embedding = await this.aiService.embeddings(contentEmbedding);
        if (knowledge) {
            const values = [
                Prisma.sql`(
                gen_random_uuid(), 
                ${update.name},
                ${contentEmbedding}, 
                ${`[${embedding.join(",")}]`}::vector, 
                ${existing.id},
                now(), 
                now()
            )`
            ]

            await this.prisma.$executeRaw`
            INSERT INTO "knowledges" (
                "id", 
                "name",
                "content", 
                "embedding", 
                "productId",
                "created_at", 
                "updated_at"
            ) 
            VALUES ${Prisma.join(values)}
        `;
        } else {
            await this.prisma.$executeRaw`
                UPDATE products 
                SET 
                    name = ${update.name},
                    content = ${contentEmbedding},
                    embedding = ${`[${embedding.join(",")}]`}::vector,
                    created_at = now(),
                    updated_at = now()
                WHERE id = ${existing.id};
            `;
        }
        return update;
    }
    async findOne(id: string) {
        const existing = await this.prisma.product.findUnique({
            where: { id }
        });
        if (!existing) {
            throw new NotFoundException("Product not found");
        }
        return existing;
    }
    async delete(id: string) {
        const existing = await this.findOne(id);
        const knowledge = await this.prisma.knowledge.findFirst({
            where: {
                productId: existing.id
            }
        })
        if (knowledge) {
            console.log(knowledge);
            await this.prisma.knowledge.delete({
                where: {
                    id: knowledge?.id
                }
            })
        }
        await this.prisma.$transaction([
            this.prisma.product.delete({
                where: { id: existing.id }
            })
        ]);
        return { message: "Delete product successfully" };
    }
}