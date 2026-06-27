import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceStatus } from '@prisma/client';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { UpdateInvoiceStatusDto } from './dto/update-invoice-status.dto';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  private generateInvoiceNumber() {
    const now = new Date();

    const date = now.toISOString().slice(0, 10).replace(/-/g, '');

    const random = Math.floor(1000 + Math.random() * 9000);

    return `Inv-${date}-${random}`;
  }

  private async ensureCustomerExists(customerId: number) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id: customerId,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
  }

  private async buildInvoiceItems(items: { productId: number; qty: number }[]) {
    const productIds = items.map((item) => item.productId);

    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    return items.map((item) => {
      const product = products.find((product) => product.id === item.productId);

      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      const price = Number(product.price);

      return {
        productId: item.productId,
        qty: item.qty,
        price,
        amount: price * item.qty,
      };
    });
  }

  private async getInvoiceById(id: number) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async create(dto: CreateInvoiceDto, userId: number) {
    await this.ensureCustomerExists(dto.customerId);

    const issueDate = new Date(dto.issueDate);
    const dueDate = new Date(dto.dueDate);

    if (dueDate < issueDate) {
      throw new BadRequestException(
        'Due date cannot be earlier than issue date',
      );
    }

    if (!dto.items.length) {
      throw new BadRequestException('Invoice items cannot be empty');
    }

    const items = await this.buildInvoiceItems(dto.items);

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);

    const invoice = await this.prisma.invoice.create({
      data: {
        invoiceNumber: this.generateInvoiceNumber(),
        customerId: dto.customerId,
        createdBy: userId,
        issueDate: new Date(dto.issueDate),
        dueDate: new Date(dto.dueDate),
        subtotal,
        total: subtotal,
        notes: dto.notes,
        items: {
          create: items,
        },
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Invoice created successfully',
      data: invoice,
    };
  }

  async findAll(page = 1, limit = 10, search = '', status?: InvoiceStatus) {
    const skip = (page - 1) * limit;

    const where = {
      ...(search && {
        OR: [
          {
            invoiceNumber: {
              contains: search,
              mode: 'insensitive' as const,
            },
          },
          {
            customer: {
              name: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
          },
        ],
      }),

      ...(status && {
        status,
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              companyName: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: {
            include: {
              product: true,
            },
          },
        },
      }),
      this.prisma.invoice.count({
        where,
      }),
    ]);

    return {
      success: true,
      message: 'Invoice retrieved successfully',
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const invoice = await this.getInvoiceById(id);

    return {
      success: true,
      message: 'Invoice retrieved successfully',
      data: invoice,
    };
  }

  async update(id: number, dto: UpdateInvoiceDto) {
    const existingInvoice = await this.getInvoiceById(id);

    if (dto.customerId) {
      await this.ensureCustomerExists(dto.customerId);
    }

    const issueDate = dto.issueDate
      ? new Date(dto.issueDate)
      : existingInvoice.issueDate;

    const dueDate = dto.dueDate
      ? new Date(dto.dueDate)
      : existingInvoice.dueDate;

    if (dueDate < issueDate) {
      throw new BadRequestException(
        'Due date cannot be earlier than issue date',
      );
    }

    const updateData = {
      customerId: dto.customerId,
      issueDate: dto.issueDate ? new Date(dto.issueDate) : undefined,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      status: dto.status,
      notes: dto.notes,
    };

    if (dto.items) {
      if (!dto.items.length) {
        throw new BadRequestException('Invoice items cannot be empty');
      }

      const items = await this.buildInvoiceItems(dto.items);

      const subtotal = items.reduce((sum, item) => sum + item.amount, 0);

      const invoice = await this.prisma.$transaction(async (tx) => {
        await tx.invoiceItem.deleteMany({
          where: {
            invoiceId: id,
          },
        });

        await tx.invoiceItem.createMany({
          data: items.map((item) => ({
            invoiceId: id,
            ...item,
          })),
        });

        return tx.invoice.update({
          where: {
            id,
          },
          data: {
            ...updateData,
            subtotal,
            total: subtotal,
          },
          include: {
            customer: true,
            items: {
              include: {
                product: true,
              },
            },
          },
        });
      });

      return {
        success: true,
        message: 'Invoice updated successfully',
        data: invoice,
      };
    }

    const invoice = await this.prisma.invoice.update({
      where: {
        id,
      },
      data: updateData,
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Invoice updated successfully',
      data: invoice,
    };
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.invoice.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Invoice deleted successfully',
    };
  }
}
