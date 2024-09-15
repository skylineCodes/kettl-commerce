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
  IsDefined,
  IsNotEmptyObject,
} from 'class-validator';
import { CreateOrderItemDto } from './create-order-item.dto';
import { Address } from 'apps/auth/src/users/models/address.schema';
import { ApiProperty } from '@nestjs/swagger';
import { CreateChargeDTO } from '@app/common/dto/create-charge.dto';

export class CreateOrderDto {
  @IsString()
  @IsOptional()
  userId: string;
  
  @IsString()
  @IsOptional()
  order_id: string;
  
  @ApiProperty({ example: [
    {
      "productId": "6670480403afdd4527e3b670",
      "quantity": 2,
      "price": 29.99
    },
    {
      "productId": "6670480403afdd4527e3b671",
      "quantity": 1,
      "price": 49.99
    }
  ]})
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  products: CreateOrderItemDto[];

  @ApiProperty({ example: 109.97 })
  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;

  @ApiProperty({ example: 'pending' })
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty({ example: {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "Anystate",
    "zipCode": "12345",
    "country": "USA"
  }})
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => Address)
  shippingAddress: Address;

  @ApiProperty({ example: {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "Anystate",
    "zipCode": "12345",
    "country": "USA"
  }})
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => Address)
  billingAddress: Address;

  @ApiProperty({ example: 'credit_card' })
  @IsNotEmpty()
  @IsString()
  paymentMethod: string;
  
  @IsOptional()
  completedAt: Date;
  
  @ApiProperty({ example: 'standard' })
  @IsNotEmpty()
  @IsString()
  shippingMethod: string;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateChargeDTO)
  charge: CreateChargeDTO;

  createdAt: Date;

  updatedAt: Date;
}
