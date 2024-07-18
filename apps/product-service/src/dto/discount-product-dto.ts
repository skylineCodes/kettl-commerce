import { IsNumber, Min, Max, IsOptional, IsString, IsArray } from 'class-validator';

export class DiscountDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage: number;
}

export class DynamicPricingDto {
  @IsOptional()
  @IsNumber()
  demandFactor?: number;

  @IsOptional()
  @IsString()
  timeOfDay?: string;

  @IsOptional()
  @IsArray()
  customerSegments?: string[];
}
