import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class UpdateOrderDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['pending', 'shipped', 'delivered', 'cancelled'])
  status: string; // 'pending', 'shipped', 'delivered', 'cancelled'
}
