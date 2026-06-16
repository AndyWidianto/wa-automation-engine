import { Global, Module } from "@nestjs/common";
import { WhatsappService } from "./whatsapp.service";
import { WebhookModule } from "@/api/webhook/webhook.module";
import { EmailService } from "@/lib/email/email.service";
import { OrderModule } from "@/api/order/order.module";
import { EventModule } from "@/event/event.module";


@Global()
@Module({
    providers: [
        WhatsappService,
        EmailService
    ],
    imports: [
        WebhookModule,
        OrderModule,
        EventModule
    ],
    exports: [
        WhatsappService,
    ]
})
export class WhatsappModule {}