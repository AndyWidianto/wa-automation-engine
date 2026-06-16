import { Injectable, OnModuleInit } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import type { PayloadJWT } from "../types";


@Injectable()
export class TokenService implements OnModuleInit {
    private secretAccessToken = '';
    private secretRefreshToken = '';
    constructor(
        private readonly jwtService: JwtService,
        private readonly config: ConfigService
    ) {}

    onModuleInit() {
        this.secretAccessToken = this.config.get<string>("SECRET_ACCESS_TOKEN")!;
        this.secretRefreshToken = this.config.get<string>("SECRET_REFRESH_TOKEN")!;
    }

    async createAccessToken({ id, email, role, name }: PayloadJWT) {
        return this.jwtService.signAsync({ id, email, role, name }, { secret: this.secretAccessToken, expiresIn: "17m" })
    }

    async createRefreshToken({ id, email, role, name }: PayloadJWT) {
        return this.jwtService.signAsync({ id, email, role, name }, { secret: this.secretRefreshToken, expiresIn: "7d" })
    }
}