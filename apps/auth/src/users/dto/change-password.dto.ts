import { IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  current_password: string;
  
  @IsString()
  new_password: string;
}
