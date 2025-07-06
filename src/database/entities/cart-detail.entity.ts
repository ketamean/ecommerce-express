import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from './product.entity';

@Entity('cart_details')
export class CartDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { default: 1 })
  quantity: number;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Cart, (cart) => cart.cartDetails, { onDelete: 'CASCADE' })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartDetails, {
    onDelete: 'CASCADE',
  })
  product: Product;
}