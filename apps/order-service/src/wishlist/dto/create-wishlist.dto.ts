import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateWishlistDto {
  @IsOptional()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  productId: string;
}