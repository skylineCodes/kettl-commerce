import { Prop } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, isNumber, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { SchemaTypes, Types } from "mongoose";

export class InvoiceItemDto {
  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 100 })
  price: number;

  @ApiProperty({ example: 200 })
  amount: number;

  @ApiProperty({ example: 'Item description' })
  description: string;
}

export class DiscountDto {
  @Prop({ type: SchemaTypes.ObjectId })
  @IsOptional()
  _id?: Types.ObjectId;

  @ApiProperty({ example: 'percentage' })
  @IsString()
  type: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  value: number;
}

export class TaxDto {
  @IsOptional()
  @Prop({ type: SchemaTypes.ObjectId })
  _id?: Types.ObjectId;

  @ApiProperty({ example: 'percentage' })
  type: string;

  @ApiProperty({ example: 15 })
  value: number;
}

export class CreateInvoiceDto {
  @ApiProperty({ example: 'Website Design Invoice' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'USD' })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({ example: '66c72ef1591afcd4c692706c' })
  @IsOptional()
  userId?: string;

  @ApiProperty({ example: '66c72ef1591afcd4c692706c' })
  @IsOptional()
  orderId?: string;

  @ApiProperty({ example: '2024-09-30' })
  @IsNotEmpty()
  dueDate: Date;

  @ApiProperty({ type: [InvoiceItemDto], example: [{ quantity: 2, price: 100, amount: 200, description: 'Item description' }] })
  @IsNotEmpty()
  items: InvoiceItemDto[];

  @ApiProperty({ example: 500 })
  @IsNotEmpty()
  @IsNumber()
  subtotal: number;

  @ApiProperty({ example: {
    "type": "percentage",
    "value": 10
  }})
  @IsOptional()
  discount?: DiscountDto;

  @ApiProperty({ example: {
    "type": "fixed",
    "value": 50
  }})
  @IsOptional()
  tax?: TaxDto;

  @ApiProperty({ example: 450 })
  @IsNotEmpty()
  @IsNumber()
  total: number;

  @ApiProperty({ example: 'Payment due within 30 days' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ example: 'INV-2024-001' })
  @IsString()
  @IsNotEmpty()
  invoiceNo?: string;

  @ApiProperty({ example: '2024-09-01' })
  @IsNotEmpty()
  issuedOn: Date;
}