import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CartProductDocumentDto } from './create-cart.dto';

export class UpdateCartDto {
  @IsOptional()
  @IsString()
  userId: string;
  
  @ApiProperty({ example: [
    {
      "productId": "66c73238bc684d9aeeae9e0a",
      "quantity": 2,
      "subtotal": 3999.98
    },
    {
      "productId": "66c73238bc684d9aeeae9e0b",
      "quantity": 1,
      "subtotal": 1999.99
    }
  ]})
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartProductDocumentDto)
  products: CartProductDocumentDto[];
  
  @ApiProperty({ example: 8500.00 })
  @IsNotEmpty()
  @IsNumber()
  total: number;
  
  @ApiProperty({ example: 500.00 })
  @IsNotEmpty()
  @IsNumber()
  tax: number;
}
