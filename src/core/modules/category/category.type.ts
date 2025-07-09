import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class CategoryType {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}