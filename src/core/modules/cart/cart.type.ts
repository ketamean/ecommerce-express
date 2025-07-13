import { ObjectType, Field, ID, Int, Float } from "type-graphql";
import { Product } from "@modules/product/product.type";

@ObjectType()
export class CartDetailType {
  @Field(() => ID)
  id!: number;

  @Field(() => Int)
  quantity!: number;

  @Field()
  status!: string;

  @Field()
  created_at!: Date;

  @Field(() => Product)
  product!: Product;

  @Field(() => Float)
  subtotal!: number; // This will be calculated (price * quantity)
}

@ObjectType()
export class CartType {
  @Field(() => ID)
  id!: number;

  @Field()
  cart_id!: string;

  @Field()
  created_at!: Date;

  @Field()
  updated_at!: Date;

  @Field(() => [CartDetailType])
  cartDetails!: CartDetailType[];

  @Field(() => Float)
  totalAmount!: number; // This will be calculated from all cart details

  @Field(() => Int)
  totalItems!: number; // Total number of items in cart
}
