import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty({ example: 'shipped' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['pending', 'shipped', 'delivered', 'cancelled'])
  status: string; // 'pending', 'shipped', 'delivered', 'cancelled'
}
