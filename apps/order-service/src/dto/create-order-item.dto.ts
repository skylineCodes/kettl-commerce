import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({ example: '6670480403afdd4527e3b670' })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({ example: 5 })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 899.99 })
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
