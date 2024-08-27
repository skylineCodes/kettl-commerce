import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { CartProductDocument } from './cart-product.schema';
import { AbstractDocument } from '@app/common';

@Schema()
export class CartDocument extends AbstractDocument {
  @ApiProperty({ type: String, example: "60c72b2f5f1b2c001fdd92ab" })
  @Prop({ type: String, required: true })
  userId: string;

  @ApiProperty({ example: [
    {
      "productId": "6670480403afdd4527e3b670",
      "quantity": 2,
      "subtotal": 29.99
    },
    {
      "productId": "6670480403afdd4527e3b671",
      "quantity": 1,
      "subtotal": 49.99
    }
  ]})
  @Prop({ type: [{ type: Types.ObjectId, ref: 'CartProductDocument' }], default: [] })
  products: CartProductDocument[];

  @ApiProperty({ example: 8999.99 })
  @Prop({ required: true })
  total: number;

  @ApiProperty({ example: 499.99 })
  @Prop({ default: 0 })
  tax: number;
}

export const CartSchema = SchemaFactory.createForClass(CartDocument);

export interface CartR {
  status: number;
  message?: string;
  data?: CartDocument | CartDocument[];
}
