import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma/prisma.service';
import { EvolutionService } from '../../lib/evolutions/evolutions.service';
import { CreateDevice, PayloadJWT } from '../../lib/types';
import { TypeNotification } from '../../lib/shared/notification';
import { WhatsappService } from '@/whatsapp/whatsapp.service';


@Injectable()
export class DeviceService {
  constructor(
    private prisma: PrismaService,
    private evolution: EvolutionService,
    private whatsapp: WhatsappService,
  ) { }


  async checkInstance(instanceName: string): Promise<boolean> {
    const existing = await this.prisma.device.findUnique({
      where: {
        instanceName: instanceName,
      }
    });
    return existing ? true : false;
  }
  async create(user: PayloadJWT, { name, instanceName }: CreateDevice) {
    if (user.role === "review") {
      throw new BadRequestException("Akses ditolak. Role Review hanya diperbolehkan melihat data.")
    }
    const existing = await this.checkInstance(instanceName);
    if (existing) {
      throw new BadRequestException("Instance name sudah digunakan. Silakan gunakan nama lain.");
    }
    await this.whatsapp.createInstance(instanceName);
    const newDevice = await this.prisma.device.create({
      data: { name, instanceName }
    });
    await this.prisma.notification.create({
      data: {
        title: `delete autoreply`,
        content: instanceName,
        type: TypeNotification.success,
        isRead: false,
        userId: user.id
      }
    });
    return {
      ...newDevice,
      status: 'connecting',
      instanceName: instanceName,
      integration: "WHATSAPP-BAILEYS"
    };
  }

  async setWebhook(instanceName: string, url: string) {
    const baseUrl = process.env.BASE_URL;
    await this.evolution.setWebhook({ instance: instanceName, url: `${baseUrl}/${url}` });
    return { message: "Setting webhook successfully" }
  }

  async connectDevice(user: PayloadJWT, id: string) {
    if (user.role === "review") {
      throw new BadRequestException("Akses ditolak. Role Review hanya diperbolehkan melihat data.")
    }
    const device = await this.getOne(id)
    const qrCode = await this.whatsapp.getQrCode(device.instanceName);
    if (!qrCode) {
      throw new NotFoundException("QR Code tidak ditemukan. Pastikan instance sudah dibuat dan belum terhubung.");
    }
    return qrCode;
  }

  async getAll() {
    const devices = await this.prisma.device.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return devices;
  }

  async getOne(id: string) {
    const existing = await this.prisma.device.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException("device not found");
    }
    return existing;
  }

  async delete(user: PayloadJWT, id: string) {
    if (user.role === "review") {
      throw new BadRequestException("Akses ditolak. Role Review hanya diperbolehkan melihat data.")
    }
    const device = await this.getOne(id);
    if (!device) {
      throw new NotFoundException("device not found");
    }
    await this.whatsapp.deleteInstance(device.instanceName);
    await this.prisma.device.delete({
      where: { id: device.id }
    })
    await this.prisma.notification.create({
      data: {
        title: `delete autoreply`,
        content: device.instanceName,
        type: TypeNotification.success,
        isRead: false,
        userId: user.id
      }
    });
    return { message: "Delete device successfully" };
  }
}