import {
  IsString,
  IsEmail,
  IsArray,
  IsOptional,
  IsBoolean,
  IsDate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { AddressDto } from './create-address.dto';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @IsArray()
  @IsString({ each: true })
  roles: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  orderHistory?: Types.ObjectId[] = [];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  wishlist?: Types.ObjectId[] = [];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cart?: Types.ObjectId[] = [];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastLogin?: Date;
}
