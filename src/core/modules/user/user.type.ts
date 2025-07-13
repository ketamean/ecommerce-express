import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class UserType {
  @Field(() => ID)
  id!: number;

  @Field()
  user_id!: string;

  @Field()
  email!: string;

  @Field({ nullable: true })
  name!: string;

  @Field()
  is_admin!: boolean;

  @Field()
  created_at!: Date;

  @Field()
  updated_at!: Date;
}

@ObjectType()
export class AuthResponse {
  @Field(() => UserType)
  user!: UserType;

  @Field()
  accessToken!: string;

  @Field()
  refreshToken!: string;
}
