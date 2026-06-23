import { CreateProductDto, UpdateProductDto } from "@/lib/dto/product.dto";
import { AIService } from "@/lib/ai/aiservice";
import { PrismaService } from "@/lib/prisma/prisma.service";
import { StorageService } from "@/lib/storage/storage.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Product, Prisma } from "@prisma/client";

@Injectable()
export class ProductService {
    constructor(
        private prisma: PrismaService,
        private aiService: AIService,
        private storage: StorageService
    ) { }

    async create(data: CreateProductDto, file?: Express.Multer.File) {
        const dataToSave = {
            name: data.name,
            description: data.description,
            price: data.price,
            stock: data.stock
        }

        let bucket: { publicId: string | null, fileName: string | null, imageUrl: string | null } = {
            publicId: null,
            fileName: null,
            imageUrl: null
        }
        if (file) {
            const filesave = await this.storage.uploadImage(file);
            bucket = {
                publicId: filesave.public_id,
                fileName: filesave.original_filename,
                imageUrl: filesave.url
            }
        }

        const product = await this.prisma.product.create({
            data: {
                ...dataToSave,
                ...bucket
            }
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
    async getAll(search?: string, lastId?: string, limitStr?: string, priceRange?: string, stockStatus?: string) {
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
        let priceFilter: Prisma.ProductWhereInput['price'] = undefined;

        if (priceRange) {
            switch (priceRange) {
                case "low":
                    priceFilter = { lt: 150000 };
                    break;
                case "medium":
                    priceFilter = { gte: 150000, lte: 500000 };
                    break;
                case "high":
                    priceFilter = { gte: 500000 };
                    break;
                default:
                    break;
            }
        }
        if (priceFilter) {
            query.where = {
                ...query.where,
                price: priceFilter
            }
        }
        let stockFilter: Prisma.ProductWhereInput["stock"] = undefined;
        if (stockStatus) {
            switch (stockStatus) {
                case "low": 
                    stockFilter = { lte: 40 };
                    break;
                case "medium": 
                    stockFilter = { gt: 40, lte: 100 };
                    break;
                case "high": 
                    stockFilter = { gt: 100 }
                    break;
                default: 
                    break;
            }
        }
        if (stockFilter) {
            query.where = {
                ...query.where,
                stock: stockFilter
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
    async update(id: string, data: UpdateProductDto, file: Express.Multer.File) {
        const existing = await this.findOne(id);

        const knowledge = await this.prisma.knowledge.findFirst({
            where: {
                productId: existing.id
            }
        });
        let dataToSave: Partial<Product> = {
            ...data
        }
        if (file) {
            if (existing.publicId) {
                await this.storage.deleteImage(existing.publicId);
            }
            const saveFile = await this.storage.uploadImage(file);
            dataToSave = {
                publicId: saveFile.public_id,
                fileName: saveFile.original_filename,
                imageUrl: saveFile.url
            }
        }
        const update = await this.prisma.product.update({
            where: { id },
            data: dataToSave
        });
        const contentEmbedding = Object.entries(update).map(([key, val]) => `${key}: ${val}`).join(", ");
        const embedding = await this.aiService.embeddings(contentEmbedding);
        if (!knowledge) {
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
                WHERE id = ${knowledge.id};
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