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

class DimensionsDto {
  @IsNumber()
  length: number;

  @IsNumber()
  width: number;

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
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly slug: string;

  @IsNumber()
  readonly price: number;

  @IsOptional()
  @IsNumber()
  readonly discountPrice?: number;

  @IsString()
  readonly currency: string;

  @IsInt()
  readonly stockQuantity: number;

  @IsString()
  readonly sku: string;

  @IsString()
  readonly availabilityStatus: string;

  @IsArray()
  @IsString({ each: true })
  readonly categories: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly tags?: string[];

  @IsString()
  readonly brand: string;

  @IsOptional()
  @IsString()
  readonly product_model?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly colors?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly sizes?: string[];

  @IsOptional()
  @IsNumber()
  readonly weight?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => DimensionsDto)
  readonly dimensions?: DimensionsDto;

  @IsArray()
  @IsUrl({}, { each: true })
  readonly product_images: string[];

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  readonly videos?: string[];

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  readonly thumbnails?: string[];

  @IsOptional()
  @IsString()
  readonly manufacturer?: string;

  @IsOptional()
  @IsString()
  readonly warranty?: string;

  @IsOptional()
  @IsString()
  readonly countryOfOrigin?: string;

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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];
}
