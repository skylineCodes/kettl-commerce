import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductServiceService } from './product-service.service';
import { CreateProductServiceDto } from './dto/create-product-service.dto';
import { UpdateProductServiceDto } from './dto/update-product-service.dto';
import { PaginateDto } from './dto/paginate-product-service.dto';
import { CurrentUser, JwtAuthGuard, UserDto } from '@app/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedProductsResponseDto } from './dto/paginated-products-response.dto';
import { ProductServiceDocument } from './models/product-service.schema';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@ApiTags('Product Service')
@Controller('product-service')
export class ProductServiceController {
  constructor(private readonly productServiceService: ProductServiceService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create Products' })
  @ApiResponse({
    status: 201,
    description: 'Products created successfully!',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
  })
  create(@CurrentUser() user: UserDto, @Body() createProductServiceDto: CreateProductServiceDto) {
    return this.productServiceService.create(createProductServiceDto, user);
  }

  // @Throttle({ default: { limit: 3, ttl: 10000 } })
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get paginated list of products' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully', type: PaginatedProductsResponseDto })
  findAll(
    @CurrentUser() user: UserDto,
    @Query() paginateDto: PaginateDto
  ) {
    return this.productServiceService.findAll(paginateDto, user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get product by id' })
  @ApiResponse({ status: 200, description: 'The found product.', type: ProductServiceDocument })
  findOne(@CurrentUser() user: UserDto, @Param('id') id: string) {
    return this.productServiceService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update Product by id' })
  @ApiBody({
    description: 'The request payload required to update the product',
    type: CreateProductServiceDto
  })
  @ApiResponse({
    status: 200,
    description: 'Products updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
  })
  update(@CurrentUser() user: UserDto, @Param('id') id: string, @Body() updateProductServiceDto: UpdateProductServiceDto) {
    return this.productServiceService.update(id, updateProductServiceDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete Product by id' })
  @ApiResponse({
    status: 200,
    description: 'Products deleted successfully',
  })
  remove(@CurrentUser() user: UserDto, @Param('id') id: string) {
    return this.productServiceService.remove(id, user);
  }
}
