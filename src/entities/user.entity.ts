import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  BeforeInsert,
} from "typeorm";
import { Cart } from "./cart.entity";
import { Order } from "./order.entity";
import * as bcrypt from "bcryptjs";
import { hash } from "crypto";

const salt = process.env.PASSWORD_HASHING_SALT || 10;
const pepper = process.env.PASSWORD_HASHING_PEPPER || "defaultPepper";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "uuid", generated: "uuid" })
  user_id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  hashed_password!: string;

  @Column({ nullable: true })
  name!: string;

  @Column({ default: false })
  is_admin!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToOne(() => Cart, (cart) => cart.user)
  cart!: Cart;

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];

  @BeforeInsert()
  async hashPassword() {
    this.hashed_password = await bcrypt.hash(
      this.hashed_password + pepper,
      salt
    );
  }

  public comparePassword(attempt: string): Promise<boolean> {
    return bcrypt.compare(attempt + pepper, this.hashed_password);
  }
}
