import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateWishlistDto {
  @ApiProperty({ example: '66c72ef1591afcd4c692706c' })
  @IsOptional()
  @IsString()
  userId: string;
  
  @ApiProperty({ example: '66c72ef1591afcd4c692706c' })
  @IsNotEmpty()
  @IsString()
  productId: string;
}