import { ObjectType, Field, ID, Float, Int } from 'type-graphql';
import { CategoryType } from '@modules/category/category.type';

@ObjectType()
export class Product {
  @Field(() => ID)
  id: number;

  @Field()
  product_id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  inventory_count: number;

  @Field(() => CategoryType, { nullable: true })
  category: CategoryType;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}