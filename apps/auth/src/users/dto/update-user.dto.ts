import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsArray, IsOptional, IsEmail } from 'class-validator';
import { AddressDto } from './create-address.dto';

export class UpdateUserDto {
  @ApiProperty({ example: "onako@gmail.com" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ example: 'Onakoya' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Korede' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: '+234842937489' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @Type(() => AddressDto)
  address?: AddressDto;

  @ApiProperty({ example: 'customer' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];
}
