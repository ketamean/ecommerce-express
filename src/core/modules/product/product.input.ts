import { InputType, Field, Float, Int } from 'type-graphql';

@InputType()
export class ProductInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  inventory_count: number;

  @Field(() => Int, { nullable: true })
  categoryId: number;
}