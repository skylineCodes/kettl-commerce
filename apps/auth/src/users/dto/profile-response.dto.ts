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
import { ApiProperty } from '@nestjs/swagger';

export class UserProfileResponseR {
 @ApiProperty({ example: 'onako@gmail.com' })
 @IsEmail()
  email: string;

  @ApiProperty({ example: 'Onakoya' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Korede' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '+234842937489' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @ApiProperty({ example: 'customer' })
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