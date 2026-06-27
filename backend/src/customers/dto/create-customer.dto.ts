import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({
    example: 'Ahmad',
    description: 'customer name',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'Sinarmas LDA Maritime',
    description: 'company name',
  })
  @IsString()
  companyName!: string;

  @ApiProperty({
    example: 'Ahmad@mail.com',
    description: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: '081241212412',
    description: 'phone',
  })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({
    example: 'Jl. Raya Parungkuda',
    description: 'address',
  })
  @IsString()
  @IsNotEmpty()
  address!: string;
}
