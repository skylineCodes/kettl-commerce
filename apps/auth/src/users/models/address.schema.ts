import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ _id: false })
export class Address {
  @ApiProperty({ example: 'Kolade estate, Gof area.' })
  street: string;

  @ApiProperty({ example: 'Osogbo' })
  city: string;

  @ApiProperty({ example: 'Osun' })
  state: string;

  @ApiProperty({ example: '10011' })
  postalCode: string;

  @ApiProperty({ example: 'Nigeria' })
  country: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
