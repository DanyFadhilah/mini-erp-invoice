import { ApiProperty } from '@nestjs/swagger';
import { ProductType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'ABC123',
  })
  code!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Laptop',
  })
  name!: string;

  @IsEnum(ProductType)
  @IsNotEmpty()
  @ApiProperty({
    enum: ProductType,
    example: ProductType.PRODUCT,
    description: 'Available values: PRODUCT, SERVICE',
  })
  type!: ProductType;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Barang Elektronik',
  })
  description?: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty({
    example: '5000000',
  })
  price!: number;
}
