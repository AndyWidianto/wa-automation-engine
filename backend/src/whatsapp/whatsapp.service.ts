import { Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import { makeWASocket, DisconnectReason, useMultiFileAuthState, WASocket } from '@whiskeysockets/baileys';
import * as qrcode from 'qrcode-terminal';
import pino from 'pino';
import QRCodeNode from 'qrcode';
import { WebhookService } from "@/api/webhook/webhook.service";
import { RAM_CACHE_QR_CODE } from "@/lib/constants/constants-qrcode";
import fs from 'fs';
import path from 'path';
import { PrismaService } from "@/lib/prisma/prisma.service";
import { EmailService } from "@/lib/email/email.service";


@Injectable()
export class WhatsappService implements OnModuleInit {

    private readonly logger = new Logger(WhatsappService.name);
    private mapping: Map<string, WASocket> = new Map();
    private messageQueue: Map<string, Array<{ to: string, text: string }>> = new Map();

    constructor(
        private webhook: WebhookService,
        private prisma: PrismaService,
        private email: EmailService
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
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;
            if (qr) {
                this.logger.log(`[${instanceName}] QR Code baru digenerate, perbarui di RAM.`);
                qrcode.generate(qr, { small: true });
                RAM_CACHE_QR_CODE[`${instanceName}-qrcode`] = qr;
                await this.webhook.updateConnection(instanceName, 'qr_generated');
            }
            if (connection === 'open') {
                console.log("Connection Update:", update); // Debug log untuk melihat detail pembaruan koneksi
                this.logger.log(`🚀 [${instanceName}] Berhasil terhubung! Menghapus data QR dari memori.`);
                delete RAM_CACHE_QR_CODE[`${instanceName}-qrcode`];
                await this.webhook.updateConnection(instanceName, 'connected');
                const pendingMessages = this.messageQueue.get(instanceName) || [];
                for (const { to, text } of pendingMessages) {
                    await this.sendMessage(instanceName, to, text);
                }
                this.messageQueue.delete(instanceName);
            }
            else if (connection === 'close') {
                const lastDisconnectError = lastDisconnect?.error as any;
                const statusCode = lastDisconnectError?.output?.statusCode;
                const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

                this.logger.warn(`🛑 [${instanceName}] Koneksi terputus dengan status: ${statusCode}. Menyambung kembali: ${shouldReconnect}`);

                if (shouldReconnect) {
                    await this.webhook.updateConnection(instanceName, 'disconnected');
                    try {
                        sock.ev.removeAllListeners('connection.update');
                        sock.ev.removeAllListeners('creds.update');
                        sock.end(undefined);
                    } catch (e) {
                        // Ignore jika socket sudah hancur
                    }
                    this.logger.log(`🔄 [${instanceName}] Membuka instance baru...`);
                    await this.createInstance(instanceName);
                } else {
                    this.logger.error(`❌ [${instanceName}] Perangkat keluar (Logged Out).`);
                    delete RAM_CACHE_QR_CODE[`${instanceName}-qrcode`];
                    await this.webhook.updateConnection(instanceName, 'logged_out');
                }
            }
        });
        sock.ev.on('creds.update', saveCreds);
        sock.ev.on('messages.upsert', async (m) => {
            if (m.type !== 'notify') return;

            for (const msg of m.messages) {
                const message = msg?.message?.conversation || msg?.message?.extendedTextMessage?.text || msg?.message?.imageMessage?.caption || "";
                const remoteJid = msg.key.remoteJidAlt || msg.key.participant || "";
                const res = await this.webhook.autoreply(remoteJid, message);
                const orderRegex = /<order_data>([\s\S]*?)<\/order_data>/;
                const match = res.message?.match(orderRegex);
                if (match) {
                    try {
                        const jsonString = match[1].trim();
                        const orderData = JSON.parse(jsonString);
                        if (orderData.isOrderValid) {
                            this.logger.log(`📥 Orderan Baru Masuk dari ${orderData.customerName}! Menyiapkan Email...`);
                            await this.email.sendOrderEmail(orderData);
                        }
                    } catch (error) {
                        this.logger.error("Gagal memproses JSON order dari AI", error);
                    }
                    res.message = res.message?.replace(orderRegex, '').trim();
                }
                await this.sendMessage(instanceName, remoteJid, res.message || ""); // Kirim balasan ke WhatsApp
            }
        });
        sock.ev.on('messages.update', async (m) => {
            console.log('Messages Update:', m); // Debug log untuk melihat detail pembaruan pesan
        });
        sock.ev.on('messages.delete', async (m) => {
            console.log('Messages Delete:', m); // Debug log untuk melihat detail pesan yang dihapus
        });
        sock.ev.on('presence.update', async (m) => {
            console.log('Presence Update:', m); // Debug log untuk melihat detail pembaruan status kehadiran
        });
        sock.ev.on('chats.update', (m) => {
            console.log('Chats Update:', m); // Debug log untuk melihat detail pembaruan obrolan
        });
        sock.ev.on('contacts.update', (m) => {
            console.log('Contacts Update:', m); // Debug log untuk melihat detail pembaruan kontak
        });
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

    async sendMedia(
        instanceName: string,
        to: string,
        mediaType: 'image' | 'video' | 'document' | 'audio',
        mediaSource: string | Buffer, // Bisa berupa URL string atau Buffer file
        mimetype: string,            // Opsional untuk dokumen (misal: "application/pdf")
        caption: string,             // Opsional untuk gambar/video
        fileName?: string             // Opsional untuk dokumen (misal: "tugas.pdf")
    ) {
        const sock = this.mapping.get(instanceName);
        if (!sock) {
            throw new Error(`Instance [${instanceName}] tidak aktif.`);
        }
        const formattedPhone = to.includes('@s.whatsapp.net') ? to : `${to}@s.whatsapp.net`;
        const mediaPayload = typeof mediaSource === 'string' ? { url: mediaSource } : mediaSource;

        try {
            let messageOptions: any = {};
            if (mediaType === 'image') {
                messageOptions = { image: mediaPayload, caption: caption };
            }
            else if (mediaType === 'video') {
                messageOptions = { video: mediaPayload, caption: caption };
            }
            else if (mediaType === 'audio') {
                messageOptions = { audio: mediaPayload, ptt: false }; // ptt: true jika ingin jadi VN (Voice Note)
            }
            else if (mediaType === 'document') {
                messageOptions = {
                    document: mediaPayload,
                    mimetype: mimetype || 'application/pdf',
                    fileName: fileName || 'Document.pdf'
                };
            }
            await sock.sendMessage(formattedPhone, messageOptions);
            this.logger.log(`[${instanceName}] Berhasil mengirim media (${mediaType}) ke ${to}`);
        } catch (error) {
            this.logger.error(`[${instanceName}] Gagal mengirim media ke ${to}`, error);
            throw error;
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
        if (this.mapping.has(instanceName)) {
            const sock = this.mapping.get(instanceName);
            await sock?.logout();
            this.mapping.delete(instanceName);
            delete RAM_CACHE_QR_CODE[`${instanceName}-qrcode`];
            const pathname = path.join(process.cwd(), `auth_info_baileys_${instanceName}`);
            if (fs.existsSync(pathname)) {
                fs.rmSync(pathname, { recursive: true, force: true });
                this.logger.log(`Data autentikasi untuk instance [${instanceName}] telah dihapus dari disk.`);
            }
            this.logger.log(`Instance [${instanceName}] telah dihapus.`);
            return true;
        } else {
            this.logger.warn(`Instance [${instanceName}] tidak ditemukan, tidak dapat dihapus.`);
            return false;
        }
    }
} 