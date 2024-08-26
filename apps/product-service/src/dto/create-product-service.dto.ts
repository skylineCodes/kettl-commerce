import {
  IsString,
  IsInt,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsUrl,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class DimensionsDto {
  @ApiProperty({ example: 48.5 })
  @IsNumber()
  length: number;

  @ApiProperty({ example: 3.2 })
  @IsNumber()
  width: number;

  @ApiProperty({ example: 18.5 })
  @IsNumber()
  height: number;
}

class ReviewDto {
  @IsString()
  user: string;

  @IsString()
  comment: string;

  @IsInt()
  rating: number;
}

export class ProductDto {
  @ApiProperty({ example: 'Ultra Slim Smart TV' })
  @IsString()
  readonly name: string;

  @ApiProperty({ example: 'A 55-inch ultra slim smart TV with 4K resolution.' })
  @IsString()
  readonly description: string;

  @ApiProperty({ example: 'ultra-slim-smart-tv' })
  @IsString()
  readonly slug: string;

  @ApiProperty({ example: 799.99 })
  @IsNumber()
  readonly price: number;

  @ApiProperty({ example: 699.99 })
  @IsOptional()
  @IsNumber()
  readonly discountPrice?: number;

  @ApiProperty({ example: 'NGN' })
  @IsString()
  readonly currency: string;

  @ApiProperty({ example: 50 })
  @IsInt()
  readonly stockQuantity: number;

  @ApiProperty({ example: 'TV12345' })
  @IsString()
  readonly sku: string;

  @ApiProperty({ example: 'in stock' })
  @IsString()
  readonly availabilityStatus: string;

  @ApiProperty({ example: [
    "Electronics",
    "Home Appliances"
  ]})
  @IsArray()
  @IsString({ each: true })
  readonly categories: string[];

  @ApiProperty({ example: [
    "4K",
    "Smart TV",
    "55-inch"
  ]})
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly tags?: string[];

  @ApiProperty({ example: 'SuperVision' })
  @IsString()
  readonly brand: string;

  @ApiProperty({ example: 'SV-55U4K' })
  @IsOptional()
  @IsString()
  readonly product_model?: string;

  @ApiProperty({ example: [
    "Black"
  ]})
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly colors?: string[];

  @ApiProperty({ example: [] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly sizes?: string[];

  @ApiProperty({ example: 18.5 })
  @IsOptional()
  @IsNumber()
  readonly weight?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => DimensionsDto)
  readonly dimensions?: DimensionsDto;

  @ApiProperty({ example: [
    "https://i.pinimg.com/474x/3d/f8/af/3df8afe17dbda299ed9bc54488369bef.jpg",
    "https://i.pinimg.com/474x/35/45/0c/35450cf3a191290825bd0afabaf13d79.jpg"
  ]})
  @IsArray()
  @IsUrl({}, { each: true })
  readonly product_images: string[];

  @ApiProperty({ example: [
    "https://videos.pexels.com/video-files/4010131/4010131-sd_960_506_25fps.mp4"
  ]})
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  readonly videos?: string[];

  @ApiProperty({ example:  [
    "https://i.pinimg.com/474x/50/13/55/50135541205a5784f216f88f345f54d8.jpg"
  ]})
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  readonly thumbnails?: string[];

  @ApiProperty({ example: 'SuperVision' })
  @IsOptional()
  @IsString()
  readonly manufacturer?: string;

  @ApiProperty({ example: '2 years' })
  @IsOptional()
  @IsString()
  readonly warranty?: string;

  @ApiProperty({ example: 'Japan' })
  @IsOptional()
  @IsString()
  readonly countryOfOrigin?: string;

  @ApiProperty({ example: 4.23 })
  @IsOptional()
  @IsNumber()
  readonly ratings?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewDto)
  readonly reviews?: ReviewDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly relatedProducts?: string[];
}

export class CreateProductServiceDto {
  @ApiProperty({ type: [ProductDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];
}
