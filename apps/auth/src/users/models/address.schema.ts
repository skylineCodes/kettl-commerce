import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ _id: false })
export class Address {
  @ApiProperty({ example: 'Kolade estate, Gof area.' })
  @Prop()
  street?: string;

  @ApiProperty({ example: 'Osogbo' })
  @Prop()
  city?: string;

  @ApiProperty({ example: 'Osun' })
  @Prop()
  state?: string;

  @ApiProperty({ example: '10011' })
  @Prop()
  postalCode?: string;

  @ApiProperty({ example: 'Nigeria' })
  @Prop()
  country?: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
