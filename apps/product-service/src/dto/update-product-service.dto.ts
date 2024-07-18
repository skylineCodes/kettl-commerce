import { PartialType } from '@nestjs/mapped-types';
import { CreateProductServiceDto } from './create-product-service.dto';

export class UpdateProductServiceDto extends PartialType(CreateProductServiceDto) {}
