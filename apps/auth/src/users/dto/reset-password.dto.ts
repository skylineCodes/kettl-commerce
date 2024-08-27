import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'password' })
  @IsString()
  current_password: string;
  
  @ApiProperty({ example: 'new_password' })
  @IsString()
  new_password: string;
  
  @ApiProperty({ example: '123456' })
  @IsString()
  code: string;
}
