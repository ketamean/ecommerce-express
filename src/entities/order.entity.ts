import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { OrderDetail } from './order-detail.entity';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'uuid', generated: 'uuid' })
  order_id!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  total_amount!: number;

  @Column()
  status!: string;

  @Column('text')
  shipping_address!: string;

  @Column({ unique: true, nullable: true })
  payment_gateway_id!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  user!: User;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetails!: OrderDetail[];
}