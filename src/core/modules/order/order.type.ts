import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { Product } from "@modules/product/product.type";
import { UserType } from "@modules/user/user.type";
import { PaymentMethod, OrderStatus } from "./order.input";

@ObjectType()
export class OrderDetailType {
  @Field(() => ID)
  id!: number;

  @Field(() => Int)
  quantity!: number;

  @Field(() => Float)
  price_at_purchase!: number;

  @Field()
  created_at!: Date;

  @Field()
  updated_at!: Date;

  @Field(() => Product)
  product!: Product;

  @Field(() => Float)
  subtotal!: number; // This will be calculated (price_at_purchase * quantity)
}

@ObjectType()
export class OrderType {
  @Field(() => ID)
  id!: number;

  @Field()
  order_id!: string;

  @Field(() => Float)
  total_amount!: number;

  @Field(() => OrderStatus)
  status!: OrderStatus;

  @Field()
  shipping_address!: string;

  @Field(() => PaymentMethod)
  payment_method!: PaymentMethod;

  @Field({ nullable: true })
  payment_gateway_id?: string;

  @Field()
  created_at!: Date;

  @Field()
  updated_at!: Date;

  @Field(() => UserType)
  user!: UserType;

  @Field(() => [OrderDetailType])
  orderDetails!: OrderDetailType[];

  @Field(() => Int)
  totalItems!: number; // Total number of items in order
}

@ObjectType()
export class OrderSummaryType {
  @Field(() => [OrderType])
  orders!: OrderType[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;
}
