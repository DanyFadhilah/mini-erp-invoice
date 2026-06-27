import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductType } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateCodeUnique(code: string, excludeId?: number) {
    const product = await this.prisma.product.findFirst({
      where: {
        code,
        NOT: excludeId ? { id: excludeId } : undefined,
      },
    });

    if (product) {
      throw new ConflictException('Code product already exist');
    }
  }

  async create(dto: CreateProductDto) {
    await this.validateCodeUnique(dto.code);

    const product = await this.prisma.product.create({
      data: dto,
    });

    return {
      success: true,
      message: 'Product created successfully',
      data: product,
    };
  }

  async findAll(page = 1, limit = 10, search = '', type?: ProductType) {
    const skip = (page - 1) * limit;

    const where = {
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive' as const,
            },
          },
          {
            code: {
              contains: search,
              mode: 'insensitive' as const,
            },
          },
        ],
      }),

      ...(type && {
        type,
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.product.count({
        where,
      }),
    ]);

    return {
      success: true,
      message: 'Products retrieved successfully',
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
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return {
      success: true,
      message: 'Product retrieved successfully',
      data: product,
    };
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id);

    if (dto.code) {
      await this.validateCodeUnique(dto.code, id);
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: dto,
    });

    return {
      success: true,
      message: 'Product updated successfully',
      data: product,
    };
  }

  async remove(id: number) {
    await this.findOne(id);

    try {
      await this.prisma.product.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Product deleted successfully',
      };
    } catch (error: any) {
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Product cannot be deleted because it is used in one or more invoices.',
        );
      }

      throw error;
    }
  }
}
