import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async summary() {
    const [
      totalCustomers,
      totalProducts,
      totalInvoices,

      paidInvoices,
      draftInvoices,
      sentInvoices,
      overdueInvoices,
      cancelledInvoices,

      revenue,

      recentInvoices,

      monthlyRevenue,

      topCustomersRaw,

      topProductsRaw,
    ] = await Promise.all([
      this.prisma.customer.count(),

      this.prisma.product.count(),

      this.prisma.invoice.count(),

      this.prisma.invoice.count({
        where: { status: 'PAID' },
      }),

      this.prisma.invoice.count({
        where: { status: 'DRAFT' },
      }),

      this.prisma.invoice.count({
        where: { status: 'SENT' },
      }),

      this.prisma.invoice.count({
        where: { status: 'OVERDUE' },
      }),

      this.prisma.invoice.count({
        where: { status: 'CANCELLED' },
      }),

      this.prisma.invoice.aggregate({
        where: {
          status: 'PAID',
        },
        _sum: {
          total: true,
        },
      }),

      this.prisma.invoice.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          customer: true,
        },
      }),

      this.prisma.invoice.groupBy({
        by: ['issueDate'],
        where: {
          status: 'PAID',
        },
        _sum: {
          total: true,
        },
        orderBy: {
          issueDate: 'asc',
        },
      }),

      this.prisma.invoice.groupBy({
        by: ['customerId'],
        _sum: {
          total: true,
        },
        orderBy: {
          _sum: {
            total: 'desc',
          },
        },
        take: 5,
      }),

      this.prisma.invoiceItem.groupBy({
        by: ['productId'],
        _sum: {
          qty: true,
        },
        orderBy: {
          _sum: {
            qty: 'desc',
          },
        },
        take: 5,
      }),
    ]);

    const customers = await this.prisma.customer.findMany({
      where: {
        id: {
          in: topCustomersRaw.map((c) => c.customerId),
        },
      },
    });

    const topCustomers = topCustomersRaw.map((item) => ({
      id: item.customerId,
      name: customers.find((c) => c.id === item.customerId)?.name,
      companyName: customers.find((c) => c.id === item.customerId)?.companyName,
      total: Number(item._sum.total ?? 0),
    }));

    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: topProductsRaw.map((p) => p.productId),
        },
      },
    });

    const topProducts = topProductsRaw.map((item) => ({
      id: item.productId,
      name: products.find((p) => p.id === item.productId)?.name,
      code: products.find((p) => p.id === item.productId)?.code,
      qty: item._sum.qty ?? 0,
    }));

    return {
      success: true,
      data: {
        stats: {
          totalCustomers,
          totalProducts,
          totalInvoices,
          totalRevenue: Number(revenue._sum.total ?? 0),
        },

        invoiceStatus: {
          draft: draftInvoices,
          sent: sentInvoices,
          paid: paidInvoices,
          overdue: overdueInvoices,
          cancelled: cancelledInvoices,
        },

        recentInvoices,

        monthlyRevenue,

        topCustomers,

        topProducts,
      },
    };
  }
}
