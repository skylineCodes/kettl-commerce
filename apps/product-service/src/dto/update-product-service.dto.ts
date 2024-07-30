import { PartialType } from '@nestjs/mapped-types';
import { ProductDto } from './create-product-service.dto';

export class UpdateProductServiceDto extends PartialType(ProductDto) {}
