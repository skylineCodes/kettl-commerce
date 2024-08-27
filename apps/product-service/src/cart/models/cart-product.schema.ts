import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, SchemaTypes, Types } from 'mongoose';

@Schema()
export class CartProductDocument extends AbstractDocument {
  @ApiProperty({ example: "6670480403afdd4527e3b670" })
  @Prop({ required: true })
  productId: string;

  @ApiProperty({ example: 3 })
  @Prop({ required: true })
  quantity: number;

  @ApiProperty({ example: 4599.99 })
  @Prop({ required: true })
  subtotal: number;

  @ApiProperty({ type: String, example: "60c72b2f5f1b2c001fdd92ab" })
  @Prop({ type: Types.ObjectId, ref: 'Cart' })
  cart: Types.ObjectId;
}

export const CartProductSchema = SchemaFactory.createForClass(CartProductDocument);
