import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';
import { Types } from 'mongoose';
import { Address, AddressSchema } from './address.schema';
import { Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ versionKey: false, timestamps: true })
export class UserDocument extends AbstractDocument {
  @ApiProperty({ example: '66c72ef1591afcd4c692706c' })
  @IsOptional()
  _id?: Types.ObjectId;
  
  @ApiProperty({ example: 'onako@gmail.com' })
  @Prop({ required: true, unique: true })
  email: string;
  
  @Prop({ required: true })
  @Exclude()
  password: string;
  
  @ApiProperty({ example: 'Onakoya' })
  @Prop({ required: true })
  firstName: string;
  
  @ApiProperty({ example: 'Korede' })
  @Prop({ required: true })
  lastName: string;
  
  @ApiProperty({ example: '+234842937489' })
  @Prop()
  phoneNumber?: string;
  
  @Prop({ type: AddressSchema, required: false })
  address?: any;
  
  @ApiProperty({ example: 'customer' })
  @Prop({ type: [String], default: ['customer'] })
  roles: string[];
  
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Order' }] })
  orderHistory: Types.ObjectId[];
  
  @Prop({ type: [Types.ObjectId], ref: 'Product' })
  wishlist: Types.ObjectId[];
  
  @Prop({ type: [Types.ObjectId], ref: 'Product' })
  cart: Types.ObjectId[];
  
  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  lastLogin?: Date;

  @Prop()
  resetPasswordToken?: string;

  @Prop()
  resetPasswordExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);

// Add indexes for better performance on search queries
UserSchema.index({ email: 1 });
UserSchema.index({ roles: 1 });
UserSchema.index({ lastLogin: 1 });

export interface UserR {
  status: number;
  message?: string;
  data?: UserDocument | UserDocument[];
}
