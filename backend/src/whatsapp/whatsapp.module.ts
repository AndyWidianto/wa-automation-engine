import { Global, Module } from "@nestjs/common";
import { WhatsappService } from "./whatsapp.service";
import { WebhookModule } from "@/api/webhook/webhook.module";
import { EmailService } from "@/lib/email/email.service";


@Global()
@Module({
    providers: [
        WhatsappService,
        EmailService
    ],
    imports: [
        WebhookModule,
    ],
    exports: [
        WhatsappService,
    ]
})
export class WhatsappModule {}