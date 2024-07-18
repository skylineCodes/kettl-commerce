import { IsString } from 'class-validator';

export class RequestTokenDto {
  @IsString()
  email: string;
}
