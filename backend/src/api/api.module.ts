import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { DeviceModule } from "./device/device.module";
import { AutoreplyModule } from "./autoreplies/auto.module";
import { ChatbotModule } from "./chatbot/chatbot.module";
import { KnowledgeModule } from "./knowledge/knowledge.module";
import { UsersModule } from "./users/users.module";
import { WebhookModule } from "./webhook/webhook.module";
import { MessageModule } from "./message/message.module";
import { NotificationModule } from "./notification/notification.module";
import { OrderModule } from "./order/order.module";
import { ProductModule } from "./product/product.module";


@Module({
    imports: [
        AuthModule,
        DeviceModule,
        AutoreplyModule,
        ChatbotModule,
        KnowledgeModule,
        UsersModule,
        WebhookModule,
        MessageModule,
        NotificationModule,
        OrderModule,
        ProductModule
    ]
})
export class ApiModule {}