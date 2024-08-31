import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.schema';
import { IsArray, IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Address } from 'apps/auth/src/users/models/address.schema';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Order {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;
  
  @ApiProperty({ example: '66c72ef1591afcd4c692706c' })
  @Column()
  userId: string;
  
  @ApiProperty({ example: [
    {
        "id": 1,
        "productId": "6670480403afdd4527e3b670",
        "quantity": 2,
        "price": "29.99"
    },
    {
        "id": 2,
        "productId": "6670480403afdd4527e3b671",
        "quantity": 1,
        "price": "49.99"
    }
  ]})
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
    eager: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItem)
  products: OrderItem[];

  @ApiProperty({ example: 109.99 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNumber()
  totalAmount: number;
  
  @ApiProperty({ example: 'shipped' })
  @Column()
  @IsEnum(['pending', 'shipped', 'delivered', 'cancelled'])
  status: string;
  
  @ApiProperty({ example: 'shipped' })
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
