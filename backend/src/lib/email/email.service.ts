import { Injectable, Logger } from "@nestjs/common";
import { Resend } from "resend";
import { PrismaService } from "../prisma/prisma.service";
import { OrderClient } from "../types";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class EmailService {
    private resend: Resend;
    private logger = new Logger(EmailService.name);

    constructor(private readonly configService: ConfigService) {
        const apikey = this.configService.get<string>("RESEND_API_KEY") || "";
        this.resend = new Resend(apikey);
    }
    async sendOrderEmail(orderData: OrderClient) {
        try {
            const formattedPrice = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(orderData.totalPrice);
            const htmlContent = `
                <div style="font-family: sans-serif; background-color: #0f172a; color: #ffffff; padding: 40px 20px; min-height: 100vh;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; padding: 30px; border: 1px solid rgba(255,255,255,0.1);;">
                    
                    <!-- Header -->
                    <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; margin-bottom: 20px;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #34d399;">
                        UMKM HUB — NOTIFIKASI ORDERAN
                    </h1>
                    <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 14px;">Ada pesanan baru masuk dari WhatsApp Bot AI!</p>
                    </div>

                    <!-- Data Pelanggan -->
                    <div style="background-color: rgba(255,255,255,0.03); border-radius: 12px; padding: 20px; margin-bottom: 25px; border: 1px solid rgba(255,255,255,0.05);">
                    <h2 style="margin: 0 0 12px 0; font-size: 16px; color: #34d399;">👤 Informasi Pengiriman</h2>
                    <p style="margin: 4px 0; font-size: 14px;"><strong style="color: #94a3b8;">Nama:</strong> ${orderData.customerName}</p>
                    <p style="margin: 4px 0; font-size: 14px;"><strong style="color: #94a3b8;">No. HP:</strong> ${orderData.phone}</p>
                    <p style="margin: 4px 0; font-size: 14px; line-height: 1.5;"><strong style="color: #94a3b8;">Alamat:</strong> ${orderData.address}</p>
                    </div>

                    <!-- Rincian Belanja -->
                    <div style="margin-bottom: 25px;">
                    <h2 style="margin: 0 0 12px 0; font-size: 16px; color: #22d3ee;">📦 Rincian Belanja</h2>
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                        <thead>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); text-transform: uppercase; color: #94a3b8;">
                            <th style="text-align: left; padding-bottom: 8px;">Produk</th>
                            <th style="text-align: right; padding-bottom: 8px;">Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 12px 0; color: #e2e8f0;">
                            Keranjang Pesanan WhatsApp <br/>
                            <span style="font-size: 12px; color: #64748b;">Diproses otomatis oleh AI</span>
                            </td>
                            <td style="text-align: right; padding: 12px 0; color: #34d399; font-weight: bold;">
                            ${formattedPrice}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </div>

                    <!-- Total Akhir -->
                    <div style="background-color: rgba(52, 211, 153, 0.1); border-radius: 12px; padding: 15px 20px; border: 1px solid rgba(52, 211, 153, 0.2); text-align: right;">
                    <span style="font-size: 14px; font-weight: bold; color: #a7f3d0; margin-right: 15px;">TOTAL PENDAPATAN:</span>
                    <span style="font-size: 20px; font-weight: 900; color: #34d399;">${formattedPrice}</span>
                    </div>

                    <!-- Footer Email -->
                    <div style="text-align: center; margin-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
                    <p style="margin: 0; font-size: 12px; color: #64748b;">
                        Email ini dikirim otomatis oleh Sistem Integrasi Resend & NestJS. <br/>
                        Project Kesenangan Pribadi — 2026.
                    </p>
                    </div>

                </div>
                </div>
            `;
            const { data, error } = await this.resend.emails.send({
                from: "Pesanan Baru <onboarding@resend.dev>",
                to: "andywidianto56@gmail.com",
                subject: "Notifikasi Orderan Baru - VOGUE HUB",
                html: htmlContent
            });
            if (error) {
                this.logger.error('Gagal mengirim email lewat Resend:', error);
                return false;
            }
            this.logger.log(`📧 Email berhasil terkirim! ID: ${data.id}`);
            return true;
        } catch (error) {
            this.logger.error("Gagal membuat konten email:", error);
            return false;
        }
    }
}