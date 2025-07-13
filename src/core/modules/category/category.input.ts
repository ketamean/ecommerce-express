import { InputType, Field } from "type-graphql";

@InputType()
export class CategoryInput {
  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class CategorySearchInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;
}
