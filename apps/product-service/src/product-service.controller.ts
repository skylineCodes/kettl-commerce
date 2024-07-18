import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductServiceService } from './product-service.service';
import { CreateProductServiceDto } from './dto/create-product-service.dto';
import { UpdateProductServiceDto } from './dto/update-product-service.dto';

@Controller('product-service')
export class ProductServiceController {
  constructor(private readonly productServiceService: ProductServiceService) {}

  @Post()
  create(@Body() createProductServiceDto: CreateProductServiceDto) {
    return this.productServiceService.create(createProductServiceDto);
  }

  @Get()
  findAll() {
    return this.productServiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productServiceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductServiceDto: UpdateProductServiceDto) {
    return this.productServiceService.update(+id, updateProductServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productServiceService.remove(+id);
  }
}
