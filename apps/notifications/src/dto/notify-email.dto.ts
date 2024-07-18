import { IsEmail, IsString } from "class-validator";

export class NotifyEmailDTO {
  @IsEmail()
  email: string;

  @IsString()
  subject: string;

  @IsString()
  text: string;
}