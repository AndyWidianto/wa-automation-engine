import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ProductService } from "./product.service";
import { AuthGuard } from "@nestjs/passport";
import { CreateProductDto, UpdateProductDto } from "@/lib/dto/product.dto";
import { FileInterceptor } from "@nestjs/platform-express";



@Controller("api/products")
export class ProductController {
    constructor(
        private service: ProductService
    ) {}

    @Get()
    @UseGuards(AuthGuard("jwt"))
    async getAll(@Query() query: { search?: string, limit?: string, lastId?: string, stockStatus?: string; priceRange?: string }) {
        return this.service.getAll(query.search, query.lastId, query.limit, query.priceRange, query.stockStatus);
    }

    @Post()
    @UseInterceptors(FileInterceptor("file"))
    @UseGuards(AuthGuard("jwt"))
    async create(@Body() body: CreateProductDto, @UploadedFile("file") file?: Express.Multer.File) {
        return this.service.create(body, file);
    }

    @Patch(":id")
    @UseGuards(AuthGuard("jwt"))
    @UseInterceptors(FileInterceptor("file"))
    async update(@Param("id") id: string, @Body() body: UpdateProductDto, @UploadedFile("file") file: Express.Multer.File) {
        return this.service.update(id, body, file);
    }

    @Delete(":id")
    @UseGuards(AuthGuard("jwt"))
    async delete(@Param("id") id: string) {
        return this.service.delete(id);
    }
}