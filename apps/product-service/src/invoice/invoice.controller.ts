import { CurrentUser, JwtAuthGuard, UserDto } from '@app/common';
import { Body, Controller, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetUserDto } from 'apps/auth/src/users/dto/get-user.dto';
import { InvoiceResponseDtoR } from './dto/invoice-response-array.dto';
import { Invoice, InvoiceR } from './models/invoice-schema';
import { Response } from 'express';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { PaginateDto } from '../dto/paginate-product-service.dto';

@Controller('invoice')
@UseGuards(JwtAuthGuard)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch User Invoice' })
  @ApiResponse({
    status: 200,
    type: InvoiceResponseDtoR
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
  })
  @ApiResponse({
    status: 500,
    description: 'User cart with ID 66c72ef1591afcd4c692706c not found',
  })
  async findAll(
    @CurrentUser() user: UserDto, 
    @Query() paginateDto: PaginateDto, @Res() response: Response,) {
    const invoiceResponse: InvoiceR = await this.invoiceService.findAll(paginateDto, user);

    return response.status(invoiceResponse.status).json(invoiceResponse);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get product by id' })
  @ApiResponse({ status: 200, description: 'The found product.', type: Invoice })
  findOne(@CurrentUser() user: UserDto, @Param('id') id: string) {
    return this.invoiceService.findOne(id, user);
  }

  @Post()
  @ApiOperation({ summary: 'Create Invoice' })
  @ApiResponse({
    status: 201,
    description: 'Invoice created successfully!',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
  })
  async createInvoice(
    @CurrentUser() user: GetUserDto,
    @Body() createInvoiceDto: CreateInvoiceDto,
    @Res() response: Response,
  ) {
    console.log(createInvoiceDto)
    const invoiceResponse: InvoiceR =
      await this.invoiceService.createInvoice(createInvoiceDto, user);

    return response.status(invoiceResponse.status).json(invoiceResponse);
  }
}
