import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AutoreplyService } from "./auto.service";
import { CreateAutoreplyDto, UpdateAutoreplyDto } from "../../lib/dto/autoreply.dto";
import { AuthGuard } from "@nestjs/passport";
import type { RequestAndPayload } from "../../lib/types";
import { FileInterceptor } from "@nestjs/platform-express";



@Controller("api/autoreplies")
export class AutoreplyController {

    constructor(private service: AutoreplyService) { }

    @Post()
    @UseGuards(AuthGuard("jwt"))
    async createAutoreply(@Req() req: RequestAndPayload, @Body() body: CreateAutoreplyDto) {
        const user = req.user;
        return this.service.create(user, body);
    }

    @Post(":id/upload")
    @UseGuards(AuthGuard("jwt"))
    @UseInterceptors(FileInterceptor("file"))
    async uploadFile(@Req() req: RequestAndPayload, @Param("id") id: string, @UploadedFile() file: Express.Multer.File) {
        const user = req.user;
        return this.service.uploadFile(user, id, file);
    }

    @Patch(":id")
    @UseGuards(AuthGuard("jwt"))
    async updateAutoreply(@Req() req: RequestAndPayload, @Body() body: UpdateAutoreplyDto, @Param("id") id: string) {
        const user = req.user;
        return this.service.update(user, id, body);
    }

    @Get()
    @UseGuards(AuthGuard("jwt"))
    async getAutoreplies(@Query() query: { limit?: string, lastId?: string, search?: string, status?: string, type?: string }) {
        return this.service.getAll(query.lastId, query.limit, query.search, query.status, query.type);
    }

    @Get(":id")
    @UseGuards(AuthGuard("jwt"))
    async getAutoreply(@Param("id") id: string) {
        return this.service.getOne(id);
    }

    @Delete(":id")
    @UseGuards(AuthGuard("jwt"))
    async deleteAutoreply(@Req() req: RequestAndPayload, @Param("id") id: string) {
        const user = req.user;
        return this.service.delete(user, id);
    }
}