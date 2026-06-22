import { Injectable } from '@nestjs/common';
import { PrismaService } from './lib/prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) { }
  getHello(): string {
    return 'Hello World!';
  }

  async getDashboardStats() {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalAutoreply, totalKnowledge, lastMonthAutoreply, lastMonthKnowledge, totalProduct, totalIncome, totalOrder] =
      await this.prisma.$transaction([
        this.prisma.autoreply.count(),
        this.prisma.knowledge.count(),
        this.prisma.autoreply.count({
          where: { createdAt: { lt: startOfCurrentMonth } },
        }),
        this.prisma.knowledge.count({
          where: { createdAt: { lt: startOfCurrentMonth } },
        }),
        this.prisma.product.count(),
        this.prisma.order.aggregate({
          where: {
            OR: [
              { status: "completed" },
              { status: "on_delivery" }
            ]
          },
          _sum: {
            totalPrice: true
          }
        }),
        this.prisma.order.count()
      ]);

    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      const growth = ((current - previous) / previous) * 100;
      return Math.round(growth);
    };

    return {
      autoreply: {
        total: totalAutoreply,
        growth: calculateGrowth(totalAutoreply, lastMonthAutoreply),
      },
      knowledge: {
        total: totalKnowledge,
        growth: calculateGrowth(totalKnowledge, lastMonthKnowledge),
      },
      product: {
        total: totalProduct,
        growth: 0,
      },
      order: {
        total: totalOrder,
        growth: 0,
        income: totalIncome._sum.totalPrice || 0,
      }
    };
  }
}
