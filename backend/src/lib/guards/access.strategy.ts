import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SECRET_ACCESS_TOKEN! || "SECRET_ACCESS_TOKEN",
        });
    }

    validate(payload: { id: string, email: string, iat: number, exp: number }) {
        return payload;
    }
}