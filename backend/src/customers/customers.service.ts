import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateEmailUnique(email: string, excludeId?: number) {
    const customer = await this.prisma.customer.findFirst({
      where: {
        email,
        NOT: excludeId ? { id: excludeId } : undefined,
      },
    });

    if (customer) {
      throw new ConflictException('Customer email already exist');
    }
  }

  async create(dto: CreateCustomerDto) {
    await this.validateEmailUnique(dto.email);

    const customer = await this.prisma.customer.create({
      data: dto,
    });

    return {
      success: true,
      message: 'Customer created successfully',
      data: customer,
    };
  }

  async findAll(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;

    const where = {
      OR: [
        {
          name: {
            contains: search,
            mode: 'insensitive' as const,
          },
        },
        {
          email: {
            contains: search,
            mode: 'insensitive' as const,
          },
        },
        {
          companyName: {
            contains: search,
            mode: 'insensitive' as const,
          },
        },
      ],
    };

    const [data, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.customer.count({
        where,
      }),
    ]);

    return {
      success: true,
      message: 'Customers retrieved successfully',
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
    const customer = await this.prisma.customer.findUnique({
      where: {
        id,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return {
      success: true,
      message: 'Customer retrieved successfully',
      data: customer,
    };
  }

  async update(id: number, dto: UpdateCustomerDto) {
    await this.findOne(id);

    if (dto.email) {
      await this.validateEmailUnique(dto.email, id);
    }

    const customer = await this.prisma.customer.update({
      where: { id },
      data: dto,
    });

    return {
      success: true,
      message: 'Customer updated successfully',
      data: customer,
    };
  }

  async remove(id: number) {
    await this.findOne(id);

    try {
      await this.prisma.customer.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Customer deleted successfully',
      };
    } catch (error: any) {
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Customer cannot be deleted because it is used in one or more invoices.',
        );
      }

      throw error;
    }
  }
}
