import { Type } from 'class-transformer';
import {
  IsString,
  IsArray,
  IsNumber,
  IsNotEmpty,
  ValidateNested,
  IsObject,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { CreateOrderItemDto } from './create-order-item.dto';
import { Address } from 'apps/auth/src/users/models/address.schema';

export class CreateOrderDto {
  @IsString()
  @IsOptional()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  products: CreateOrderItemDto[];

  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => Address)
  shippingAddress: Address;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => Address)
  billingAddress: Address;

  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  @IsBoolean()
  @IsOptional()
  completedAt: boolean;

  @IsNotEmpty()
  @IsString()
  shippingMethod: string;

  createdAt: Date;

  updatedAt: Date;
}
