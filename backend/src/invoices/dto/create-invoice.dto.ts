import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { InvoiceStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class CreateInvoiceItemDto {
  @ApiProperty({
    example: 1,
    description: 'Product ID',
  })
  @IsInt()
  @IsNotEmpty()
  productId!: number;

  @ApiProperty({
    example: 2,
    description: 'Quantity',
  })
  @IsInt()
  @Min(0)
  qty!: number;
}

export class CreateInvoiceDto {
  @ApiProperty({
    example: 1,
    description: 'Customer ID',
  })
  @IsInt()
  customerId!: number;

  @ApiProperty({
    example: '2026-06-25',
  })
  @IsDateString()
  issueDate!: string;

  @ApiProperty({
    example: '2026-07-25',
  })
  @IsDateString()
  dueDate!: string;

  @IsEnum(InvoiceStatus)
  status!: InvoiceStatus;

  @ApiProperty({
    example: 'Invoice PT',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    type: [CreateInvoiceItemDto],
    example: [
      {
        productId: 1,
        qty: 2,
      },
      {
        productId: 2,
        qty: 1,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items!: CreateInvoiceItemDto[];
}
