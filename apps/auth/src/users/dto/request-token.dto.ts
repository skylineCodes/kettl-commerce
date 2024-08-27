import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestTokenDto {
  @ApiProperty({ example: 'onako@gmail.com' })
  @IsString()
  email: string;
}
