import { ApiProperty } from '@nestjs/swagger';
import { ProductServiceDocument } from '../models/product-service.schema';

class LinkDto {
  @ApiProperty({ example: 'http://example.com/product-service?page=1&pageSize=10' })
  href: string;
}

class LinksDto {
  @ApiProperty({ type: LinkDto, nullable: true })
  self: LinkDto;

  @ApiProperty({ type: LinkDto, nullable: true })
  next: LinkDto;

  @ApiProperty({ type: LinkDto, nullable: true })
  prev: LinkDto;

  @ApiProperty({ type: LinkDto })
  first: LinkDto;

  @ApiProperty({ type: LinkDto })
  last: LinkDto;
}

export class PaginatedProductsResponseDto {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'Products retrieved successfully' })
  message: string;

  @ApiProperty({ type: [ProductServiceDocument] })
  data: ProductServiceDocument[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  pageSize: number;

  @ApiProperty({ example: 5 })
  totalPages: number;

  @ApiProperty({ example: 50 })
  totalItems: number;

  @ApiProperty({ type: LinksDto })
  _links: LinksDto;
}
