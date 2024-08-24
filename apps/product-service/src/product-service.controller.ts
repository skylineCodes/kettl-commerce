import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductServiceService } from './product-service.service';
import { CreateProductServiceDto } from './dto/create-product-service.dto';
import { UpdateProductServiceDto } from './dto/update-product-service.dto';
import { PaginateDto } from './dto/paginate-product-service.dto';
import { CurrentUser, JwtAuthGuard, UserDto } from '@app/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('product-service')
@Controller('product-service')
export class ProductServiceController {
  constructor(private readonly productServiceService: ProductServiceService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: UserDto, @Body() createProductServiceDto: CreateProductServiceDto) {
    return this.productServiceService.create(createProductServiceDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @CurrentUser() user: UserDto,
    @Query() paginateDto: PaginateDto
  ) {
    return this.productServiceService.findAll(paginateDto, user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@CurrentUser() user: UserDto, @Param('id') id: string) {
    return this.productServiceService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@CurrentUser() user: UserDto, @Param('id') id: string, @Body() updateProductServiceDto: UpdateProductServiceDto) {
    return this.productServiceService.update(id, updateProductServiceDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@CurrentUser() user: UserDto, @Param('id') id: string) {
    return this.productServiceService.remove(id, user);
  }
}
