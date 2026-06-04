import { Body, Controller, Param, Post, Req } from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import type { Request } from "express";



@Controller("api/webhook")
export class WebhookController {

    constructor(private service: WebhookService) {}

}