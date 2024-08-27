import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'password' })
  @IsString()
  current_password: string;
  
  @ApiProperty({ example: 'new_password' })
  @IsString()
  new_password: string;
}
