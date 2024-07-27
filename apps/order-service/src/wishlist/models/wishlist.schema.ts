import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column('json')
  products: { productId: string; addedAt: Date }[];
}

export interface WishlistR {
  status: number;
  message?: string;
  data?: Wishlist | Wishlist[];
}
