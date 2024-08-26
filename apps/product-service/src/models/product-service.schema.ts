import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";

@Schema()
export class Dimensions {
  @Prop({ required: true })
  length: number;

  @Prop({ required: true })
  width: number;

  @Prop({ required: true })
  height: number;
}

export const DimensionsSchema = SchemaFactory.createForClass(Dimensions);

@Schema()
export class Review {
  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  comment: string;

  @Prop({ required: true })
  rating: number;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

@Schema()
export class ProductServiceDocument extends AbstractDocument {
  @ApiProperty({ example: 'Ultra Slim Smart TV' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 'A 55-inch ultra slim smart TV with 4K resolution.' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ example: 'ultra-slim-smart-tv' })
  @Prop({ required: true })
  slug: string;

  @ApiProperty({ example: 799.99 })
  @Prop({ required: true })
  price: number;

  @ApiProperty({ example: 699.99 })
  @Prop()
  discountPrice?: number;

  @ApiProperty({ example: 'NGN' })
  @Prop({ required: true })
  currency: string;

  @ApiProperty({ example: 50 })
  @Prop({ required: true })
  stockQuantity: number;

  @ApiProperty({ example: 'TV12345' })
  @Prop({ required: true })
  sku: string;

  @ApiProperty({ example: 'in stock' })
  @Prop({ required: true })
  availabilityStatus: string;

  @ApiProperty({ example: [
    "Electronics",
    "Home Appliances"
  ]})
  @Prop({ type: [String], required: true })
  categories: string[];

  @ApiProperty({ example: [
    "4K",
    "Smart TV",
    "55-inch"
  ]})
  @Prop({ type: [String] })
  tags?: string[];

  @ApiProperty({ example: 'SuperVision' })
  @Prop({ required: true })
  brand: string;

  @ApiProperty({ example: 'SV-55U4K' })
  @Prop()
  product_model?: string;

  @ApiProperty({ example: [
    "Black"
  ]})
  @Prop({ type: [String] })
  colors?: string[];

  @ApiProperty({ example: [] })
  @Prop({ type: [String] })
  sizes?: string[];

  @ApiProperty({ example: 18.5 })
  @Prop()
  weight?: number;

  @Prop({ type: DimensionsSchema })
  dimensions?: Dimensions;

  @ApiProperty({ example: [
    "https://i.pinimg.com/474x/3d/f8/af/3df8afe17dbda299ed9bc54488369bef.jpg",
    "https://i.pinimg.com/474x/35/45/0c/35450cf3a191290825bd0afabaf13d79.jpg"
  ]})
  @Prop({ type: [String], required: true })
  product_images: string[];

  @ApiProperty({ example: [
    "https://videos.pexels.com/video-files/4010131/4010131-sd_960_506_25fps.mp4"
  ]})
  @Prop({ type: [String] })
  videos?: string[];

  @ApiProperty({ example:  [
    "https://i.pinimg.com/474x/50/13/55/50135541205a5784f216f88f345f54d8.jpg"
  ]})
  @Prop({ type: [String] })
  thumbnails?: string[];

  @ApiProperty({ example: 'SuperVision' })
  @Prop()
  manufacturer?: string;

  @ApiProperty({ example: '2 years' })
  @Prop()
  warranty?: string;

  @ApiProperty({ example: 'Japan' })
  @Prop()
  countryOfOrigin?: string;

  @ApiProperty({ example: 4.23 })
  @Prop()
  ratings?: number;

  @Prop({ type: [ReviewSchema] })
  reviews?: Review[];

  @Prop({ type: [String] })
  relatedProducts?: string[];
}

export const ProductSchema = SchemaFactory.createForClass(ProductServiceDocument);

export interface Product {
  name: string;
  description: string;
  slug: string;
  price: number;
  discountedPrice?: number;
  currency: string;
  stockQuantity: number;
  sku: string;
  availabilityStatus: string;
  categories: string[];
  tags?: string[];
  brand: string;
  product_model?: string;
  colors?: string[];
  sizes?: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  product_images: string[];
  videos?: string[];
  thumbnails?: string[];
  manufacturer?: string;
  warranty?: string;
  countryOfOrigin?: string;
  ratings?: number;
  reviews?: {
    user: string;
    comment: string;
    rating: number;
  }[];
  relatedProducts?: string[];
}

export interface HateoasLinks {
  self: object;
  next: object;
  prev: object;
  first: object;
  last: object;
}

export interface ProductR {
  status: number;
  message?: string;
  data?: Product | Product[];
  page?: number;
  pageSize?: number;
  totalPages?: number;
  totalItems?: any;
  _links?: HateoasLinks;
}