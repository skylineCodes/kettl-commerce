import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class CancelOrderDto {
  @ApiProperty({ example: 'cancelled' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['cancelled'])
  status: string; // 'cancelled'
}
