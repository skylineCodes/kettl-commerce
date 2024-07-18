import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

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
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  discountPrice?: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  stockQuantity: number;

  @Prop({ required: true })
  sku: string;

  @Prop({ required: true })
  availabilityStatus: string;

  @Prop({ type: [String], required: true })
  categories: string[];

  @Prop({ type: [String] })
  tags?: string[];

  @Prop({ required: true })
  brand: string;

  @Prop()
  product_model?: string;

  @Prop({ type: [String] })
  colors?: string[];

  @Prop({ type: [String] })
  sizes?: string[];

  @Prop()
  weight?: number;

  @Prop({ type: DimensionsSchema })
  dimensions?: Dimensions;

  @Prop({ type: [String], required: true })
  product_images: string[];

  @Prop({ type: [String] })
  videos?: string[];

  @Prop({ type: [String] })
  thumbnails?: string[];

  @Prop()
  manufacturer?: string;

  @Prop()
  warranty?: string;

  @Prop()
  countryOfOrigin?: string;

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

export interface ProductR {
  status: number;
  message?: string;
  data?: Product | Product[];
}