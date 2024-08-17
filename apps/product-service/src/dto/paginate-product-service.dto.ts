import { Type } from "class-transformer";
import { IsNumber, IsOptional, Min } from "class-validator";


export class PaginateDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  pageSize: number = 10;
}