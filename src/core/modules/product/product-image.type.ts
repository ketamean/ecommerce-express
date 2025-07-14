import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class ProductImageType {
  @Field(() => ID)
  id!: number;

  @Field()
  image_url!: string;

  @Field({ nullable: true })
  alt_text!: string;

  @Field()
  is_thumbnail!: boolean;

  @Field()
  created_at!: Date;
}
