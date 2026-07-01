import { Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import { makeWASocket, DisconnectReason, useMultiFileAuthState, WASocket, jidNormalizedUser } from '@whiskeysockets/baileys';
import * as qrcode from 'qrcode-terminal';
import pino from 'pino';
import QRCodeNode from 'qrcode';
import { WebhookService } from "@/api/webhook/webhook.service";
import { RAM_CACHE_QR_CODE } from "@/lib/constants/constants-qrcode";
import fs from 'fs';
import path from 'path';
import { PrismaService } from "@/lib/prisma/prisma.service";
import { EmailService } from "@/lib/email/email.service";
import { OrderClient } from "@/lib/types";
import axios from "axios";
import { OrderService } from "@/api/order/order.service";
import { EventGateway } from "@/event/event.gateway";


@Injectable()
export class WhatsappService implements OnModuleInit {

    private readonly logger = new Logger(WhatsappService.name);
    private mapping: Map<string, WASocket> = new Map();
    private messageQueue: Map<string, Array<{ to: string, text: string }>> = new Map();

    constructor(
        private webhook: WebhookService,
        private prisma: PrismaService,
        private email: EmailService,
        private order: OrderService,
        private gateway: EventGateway
    ) { }

    async onModuleInit() {
        this.logger.log('Inisialisasi WhatsappService...');
        const getInstances = await this.prisma.device.findMany();
        for (const instance of getInstances) {
            this.logger.log(`Membuka instance WhatsApp: ${instance.instanceName}`);
            await this.createInstance(instance.instanceName);
        }
    }
    async createInstance(instanceName: string) {
        const { state, saveCreds } = await useMultiFileAuthState(`auth_info_baileys_${instanceName}`);
        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            connectTimeoutMs: 60000, // Naikkan jadi 60 detik
            defaultQueryTimeoutMs: 0,
            logger: pino({ level: 'silent' }), // Mematikan log internal pino agar terminal NestJS bersih
            shouldSyncHistoryMessage: () => false,
        });

        this.mapping.set(instanceName, sock);

        // event update connection
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;
            if (qr) {
                this.logger.log(`[${instanceName}] QR Code baru digenerate, perbarui di RAM.`);
                qrcode.generate(qr, { small: true });
                RAM_CACHE_QR_CODE[`${instanceName}-qrcode`] = qr;
                await this.webhook.updateConnection(instanceName, 'qr_generated');
            }
            if (connection === 'open') {
                this.logger.log(`🚀 [${instanceName}] Berhasil terhubung! Menghapus data QR dari memori.`);
                const phoneNumber = sock.user?.phoneNumber || jidNormalizedUser(sock.user?.id).split("@")[0];
                this.gateway.server.emit("update_connection_whatsapp", { status: "open", instanceName, phoneNumber });

                // delete cache qr code
                delete RAM_CACHE_QR_CODE[`${instanceName}-qrcode`];
                await this.webhook.updateConnection(instanceName, 'connected', phoneNumber);

                // mencari pesan belum terkirim
                const pendingMessages = this.messageQueue.get(instanceName) || [];
                for (const { to, text } of pendingMessages) {
                    await this.sendMessage(instanceName, to, text);
                }
                this.messageQueue.delete(instanceName);
            }
            else if (connection === 'close') {
                this.gateway.server.emit("update_connection_whatsapp", { status: "close", instanceName, phoneNumber: null });
                const lastDisconnectError = lastDisconnect?.error as any;
                const statusCode = lastDisconnectError?.output?.statusCode;
                const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

                this.logger.warn(`🛑 [${instanceName}] Koneksi terputus dengan status: ${statusCode}. Menyambung kembali: ${shouldReconnect}`);

                // Bersihkan listener agar tidak terjadi memory leak (taruh di luar if/else agar aman untuk kedua kondisi)
                try {
                    sock.ev.removeAllListeners('connection.update');
                    sock.ev.removeAllListeners('creds.update');
                    sock.end(undefined);
                } catch (e) {
                    // Ignore jika socket sudah hancur
                }

                if (shouldReconnect) {
                    await this.webhook.updateConnection(instanceName, 'disconnected');
                    this.logger.log(`🔄 [${instanceName}] Membuka instance baru...`);
                    await this.createInstance(instanceName);
                } else {
                    this.logger.error(`❌ [${instanceName}] Perangkat keluar (Logged Out).`);
                    await this.webhook.updateConnection(instanceName, 'logged_out');
                    try {
                        await this.deleteInstance(instanceName);
                        await this.createInstance(instanceName);
                        this.logger.log(`🗑️ [${instanceName}] Folder sesi lama berhasil dihapus bersih. Siap untuk QR baru!`);
                    } catch (error) {
                        this.logger.error(`⚠️ Gagal menghapus folder sesi [${instanceName}]:`, error);
                    }
                }
            }
        });
        sock.ev.on('creds.update', saveCreds);

        // event pesan masuk
        sock.ev.on('messages.upsert', async (m) => {
            if (m.type !== 'notify') return;
            for (const msg of m.messages) {
                if (msg.key.remoteJid === 'status@broadcast') return;
                if (!msg.key.fromMe) {
                    const message = msg?.message?.conversation || msg?.message?.extendedTextMessage?.text || msg?.message?.imageMessage?.caption || "";
                    const remoteJid = msg.key.remoteJidAlt || msg.key.participant || "";
                    const res = await this.webhook.autoreply(remoteJid, message);
                    const orderRegex = /<order_data>([\s\S]*?)<\/order_data>/;
                    const match = res.message?.match(orderRegex);
                    if (res.from === "ai_agent" || res.from === "system") {
                        if (match) {
                            try {
                                const jsonString = match[1].trim();
                                const orderData: OrderClient = JSON.parse(jsonString);
                                if (orderData.isOrderValid) {
                                    this.logger.log(`📥 Orderan Baru Masuk dari ${orderData.customerName}! Menyiapkan Email...`);
                                    await this.order.create(orderData, remoteJid, instanceName);
                                    await this.email.sendOrderEmail(orderData);
                                }
                            } catch (error) {
                                this.logger.error("Gagal memproses JSON order dari AI", error);
                            }
                            res.message = res.message?.replace(orderRegex, '').trim();
                        }
                        if (res.data && res.data.length > 0) {
                            for (const item of res.data) {
                                if (item.imageUrl && item.similarity > 0.70) {
                                    await this.sendMedia(instanceName, remoteJid, item.imageUrl);
                                }
                            }
                        }
                        await this.sendMessage(instanceName, remoteJid, res.message || "");
                    } else {
                        if (res.autoreply && res.autoreply.fileUrl) {
                            await this.sendMedia(instanceName, remoteJid, res.autoreply.fileUrl, res.message);
                        } else {
                            await this.sendMessage(instanceName, remoteJid, res.message || "");
                        }
                    }
                }
            }
        });
        // sock.ev.on('messages.update', async (m) => {
        //     console.log('Messages Update:', m); // Debug log untuk melihat detail pembaruan pesan
        // });
        // sock.ev.on('messages.delete', async (m) => {
        //     console.log('Messages Delete:', m); // Debug log untuk melihat detail pesan yang dihapus
        // });
        // sock.ev.on('presence.update', async (m) => {
        //     console.log('Presence Update:', m); // Debug log untuk melihat detail pembaruan status kehadiran
        // });
        // sock.ev.on('chats.update', (m) => {
        //     console.log('Chats Update:', m); // Debug log untuk melihat detail pembaruan obrolan
        // });
        // sock.ev.on('contacts.update', (m) => {
        //     console.log('Contacts Update:', m); // Debug log untuk melihat detail pembaruan kontak
        // });
    }

    async sendMessage(instanceName: string, to: string, text: string): Promise<void> {
        const sock = this.mapping.get(instanceName);
        if (!sock) {
            throw new NotFoundException(`Instance [${instanceName}] tidak aktif.`);
        }
        const formattedPhone = to.includes('@s.whatsapp.net') ? to : `${to}@s.whatsapp.net`;

        try {
            if (sock.ws.isOpen === false) {
                this.messageQueue.set(instanceName, [...(this.messageQueue.get(instanceName) || []), { to: formattedPhone, text }]);
                this.logger.warn(`Koneksi untuk instance [${instanceName}] belum siap. Pesan ke ${to} akan dicoba lagi nanti.`);
                return;
            }
            await sock.sendMessage(formattedPhone, { text });
        } catch (error) {
            this.logger.error(`Gagal mengirim pesan ke ${to}`, error);
        }
    }

    async sendMedia(instanceName: string, to: string, imageUrl: string, caption?: string): Promise<void> {
        const sock = this.mapping.get(instanceName);
        if (!sock) throw new NotFoundException(`Instance [${instanceName}] tidak aktif.`);

        const formattedPhone = to.includes('@s.whatsapp.net') ? to : `${to}@s.whatsapp.net`;

        try {
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, 'binary');

            await sock.sendMessage(formattedPhone, {
                image: buffer,
                mimetype: 'image/jpeg',
                caption: caption, // Opsional
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: false
                }
            });

        } catch (error) {
            this.logger.error(`Gagal mengirim media ke ${to}`, error);
        }
    }

    async getQrCode(instanceName: string): Promise<{ base64: string, code: string } | null> {
        const qrCode = RAM_CACHE_QR_CODE[`${instanceName}-qrcode`];
        if (qrCode) {
            this.logger.log(`QR Code untuk instance [${instanceName}] ditemukan di RAM.`);
            const qrBase64 = await QRCodeNode.toDataURL(qrCode);
            return {
                base64: qrBase64,
                code: qrCode,
            }
        } else {
            this.logger.warn(`QR Code untuk instance [${instanceName}] tidak ditemukan di RAM.`);
            return null;
        }
    }

    async deleteInstance(instanceName: string): Promise<boolean> {
        const sock = this.mapping.get(instanceName);

        if (sock) {
            try {
                await sock.logout();
            } catch (error) {
                // Jika koneksi sudah closed (Error 428), abaikan saja agar tidak nge-crash
                this.logger.warn(`⚠️ [${instanceName}] Gagal logout secara jaringan (Connection Closed). Melanjutkan pembersihan lokal...`);
            }
        }
        this.mapping.delete(instanceName);
        delete RAM_CACHE_QR_CODE[`${instanceName}-qrcode`];

        const pathname = path.join(process.cwd(), `auth_info_baileys_${instanceName}`);
        if (fs.existsSync(pathname)) {
            try {
                fs.rmSync(pathname, { recursive: true, force: true });
                this.logger.log(`🗑️ Data autentikasi untuk instance [${instanceName}] telah dihapus dari disk.`);
            } catch (fileError: any) {
                this.logger.error(`❌ Gagal menghapus folder ${pathname}: ${fileError.message}`);
            }
        }

        this.logger.log(`✅ Instance [${instanceName}] telah dibersihkan sepenuhnya.`);
        return true;
    }
} 