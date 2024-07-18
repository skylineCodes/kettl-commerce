import { IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  current_password: string;
  
  @IsString()
  new_password: string;

  @IsString()
  code: string;
}
