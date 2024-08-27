import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

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
  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.cart, {
    cascade: true,
    eager: true,
  })
  products: CartProduct[];

  @ApiProperty({ example: 8999.99 })
  @Column()
  total: number;
  
  @ApiProperty({ example: 499.99 })
  @Column({ default: 0 })
  tax: number;
}

@Entity()
export class CartProduct {
  @PrimaryGeneratedColumn()
  id: number;
  
  @ApiProperty({ example: "6670480403afdd4527e3b670" })
  @Column()
  productId: string;
  
  @ApiProperty({ example: 3 })
  @Column()
  quantity: number;
  
  @ApiProperty({ example: 4599.99 })
  @Column()
  subtotal: number;

  @ManyToOne(() => Cart, (cart) => cart.products)
  cart: Cart;
}
export interface CartR {
  status: number;
  message?: string;
  data?: Cart | Cart[];
}