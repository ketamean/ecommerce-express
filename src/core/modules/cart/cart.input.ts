import { InputType, Field, Int } from "type-graphql";

@InputType()
export class AddToCartInput {
  @Field(() => Int)
  productId!: number;

  @Field(() => Int, { defaultValue: 1 })
  quantity!: number;
}

@InputType()
export class UpdateCartItemInput {
  @Field(() => Int)
  productId!: number;

  @Field(() => Int)
  quantity!: number;
}

@InputType()
export class RemoveFromCartInput {
  @Field(() => Int)
  productId!: number;
}
