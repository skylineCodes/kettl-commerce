import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.cart, {
    cascade: true,
    eager: true,
  })
  products: CartProduct[];

  @Column()
  total: number;

  @Column({ default: 0 })
  tax: number;
}

@Entity()
export class CartProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: string;

  @Column()
  quantity: number;

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