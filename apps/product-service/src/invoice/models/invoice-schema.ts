import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from "mongoose";

@Schema()
export class InvoiceItem extends Document {
  @ApiProperty({ example: 2 })
  @Prop({ required: true })
  quantity: number;

  @ApiProperty({ example: 100 })
  @Prop({ required: true })
  price: number;

  @ApiProperty({ example: 200 })
  @Prop({ required: true })
  amount: number;

  @ApiProperty({ example: 'Item description' })
  @Prop({ required: true })
  description: string;
}

export const InvoiceItemSchema = SchemaFactory.createForClass(InvoiceItem);

class Discount extends AbstractDocument {
  @ApiProperty({ example: 'percentage' })
  @Prop({ required: true, enum: ['fixed', 'percentage'] })
  type: string;

  @ApiProperty({ example: 10 })
  @Prop({ required: true })
  value: number;
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);

class Tax extends AbstractDocument {
  @ApiProperty({ example: 'percentage' })
  @Prop({ required: true, enum: ['fixed', 'percentage'] })
  type: string;

  @ApiProperty({ example: 15 })
  @Prop({ required: true })
  value: number;
}

export const TaxSchema = SchemaFactory.createForClass(Tax);

@Schema({ timestamps: true })
export class Invoice extends AbstractDocument {
  @ApiProperty({ example: 'Website Design Invoice' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ example: '66c72ef1591afcd4c692706c' })
  @Prop({ required: true })
  userId: string;

  @ApiProperty({ example: '66c72ef1591afcd4c692706c' })
  @Prop({ required: false })
  orderId?: string;

  @ApiProperty({ example: 'USD' })
  @Prop({ required: true })
  currency: string;

  @ApiProperty({ example: '2024-09-30' })
  @Prop({ required: true })
  dueDate: Date;

  @ApiProperty({ type: [InvoiceItem] })
  @Prop({ type: [InvoiceItemSchema], required: true })
  items: InvoiceItem[];

  @ApiProperty({ example: 500 })
  @Prop({ required: true })
  subtotal: number;

  @ApiProperty({ type: Discount })
  @Prop({ type: DiscountSchema, required: false })
  discount?: Discount;

  @ApiProperty({ type: Tax })
  @Prop({ type: TaxSchema, required: false })
  tax?: Tax;

  @ApiProperty({ example: 450 })
  @Prop({ required: true })
  total: number;

  @ApiProperty({ example: 'Payment due within 30 days' })
  @Prop()
  note?: string;

  @ApiProperty({ example: 'INV-2024-001' })
  @Prop({ required: true, unique: true })
  invoiceNo: string;

  @ApiProperty({ example: '2024-09-01' })
  @Prop({ required: true, default: Date.now })
  issuedOn: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

export interface IInvoiceItem {
    quantity: number;
    price: number;
    amount: number;  // Should be calculated as quantity * price
    description: string;
}

export interface IDiscount {
    type: 'fixed' | 'percentage';
    value: number;
}

export interface ITax {
    type: 'fixed' | 'percentage';
    value: number;
}

export interface IInvoice {
  title: string;
  userId: string;
  orderId?: string;
  currency: string;
  dueDate: string;
  items: IInvoiceItem[];
  subtotal: number;
  discount?: IDiscount;
  tax?: ITax;
  total: number;
  note?: string;
  invoiceNo: string;
  issuedOn: string;
}
  

export interface HateoasLinks {
  self: object;
  next: object;
  prev: object;
  first: object;
  last: object;
}

export interface InvoiceR {
  status: number;
  message?: string;
  data?: Invoice | Invoice[];
  page?: number;
  pageSize?: number;
  totalPages?: number;
  totalItems?: any;
  _links?: HateoasLinks;
}