import { IsString, IsArray, IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateOrderDto {
  @IsString()
  @IsNotEmpty()
  status: string; // 'pending', 'shipped', 'delivered', 'cancelled'
}
