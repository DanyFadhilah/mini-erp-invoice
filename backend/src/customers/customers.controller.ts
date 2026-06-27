import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CustomersService } from './customers.service';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateCustomerDto) {
    return this.customersService.create(dto);
  }

  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    example: 'Ahmad',
    description: 'name, email, or company name',
  })
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number,

    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number,

    @Query('search')
    search?: string,
  ) {
    return this.customersService.findAll(page, limit, search ?? '');
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Customer ID',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Customer ID',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, dto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Customer ID',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.customersService.remove(id);
  }
}
