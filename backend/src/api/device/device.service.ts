import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma/prisma.service';
import { EvolutionService } from '../../lib/evolutions/evolutions.service';
import { CreateDevice, PayloadJWT } from '../../lib/types';
import { notificationTemplates } from '../../lib/shared/notification';
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
    const dataNotif = notificationTemplates.device.create;
    await this.prisma.notification.create({
      data: {
        title: dataNotif.title,
        content: dataNotif.getContent(instanceName),
        type: "SUCCESS",
        isRead: false,
        userId: user.id,
        metaJson: newDevice
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

  async getAll(status?: string) {
    const devices = await this.prisma.device.findMany({
      where: {
        ...status ? {
          status: {
            contains: status,
            mode: "insensitive"
          }
        } : {}
      },
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
    const dataNotif = notificationTemplates.device.delete;
    await this.prisma.notification.create({
      data: {
        title: dataNotif.title,
        content: dataNotif.getContent(device.instanceName),
        type: "SUCCESS",
        isRead: false,
        userId: user.id,
        metaJson: device
      }
    });
    return { message: "Delete device successfully" };
  }

}