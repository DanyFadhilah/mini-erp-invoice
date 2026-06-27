import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { InvoicesService } from './invoices.service';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Query,
  UseGuards,
  Delete,
  Request,
} from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceStatus } from '@prisma/client';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { UpdateInvoiceStatusDto } from './dto/update-invoice-status.dto';
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(
    @Body()
    dto: CreateInvoiceDto,
    @Request() req,
  ) {
    return this.invoicesService.create(dto, req.user.id);
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
    example: 'INV-20262343213',
    description: 'invoice number or customer name',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: InvoiceStatus,
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

    @Query('status')
    status?: InvoiceStatus,
  ) {
    return this.invoicesService.findAll(page, limit, search ?? '', status);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Invoice ID',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.invoicesService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Invoice ID',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateInvoiceDto,
  ) {
    return this.invoicesService.update(id, dto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Invoice ID',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.invoicesService.remove(id);
  }
}
