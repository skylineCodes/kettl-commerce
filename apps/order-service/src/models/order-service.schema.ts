// src/order/entities/order.entity.ts
import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.schema';
import { IsArray, IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Address } from 'apps/auth/src/users/models/address.schema';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
    eager: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItem)
  products: OrderItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNumber()
  totalAmount: number;

  @Column()
  @IsEnum(['pending', 'shipped', 'delivered', 'cancelled'])
  status: string;

  @Column(() => Address)
  @ValidateNested()
  @Type(() => Address)
  shippingAddress: Address;

  @Column(() => Address)
  @ValidateNested()
  @Type(() => Address)
  billingAddress: Address;

  @Column()
  @IsString()
  paymentMethod: string;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: boolean;

  @Column()
  @IsString()
  shippingMethod: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export interface OrderR {
  status: number;
  message?: string;
  data?: Order | Order[];
}
