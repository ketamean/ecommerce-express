import { InputType, Field } from "type-graphql";
import { IsEmail, MinLength, IsOptional } from "class-validator";

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  password!: string;

  @Field({ nullable: true })
  @IsOptional()
  name?: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  password!: string;
}

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;
}

@InputType()
export class ChangePasswordInput {
  @Field()
  currentPassword!: string;

  @Field()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  newPassword!: string;
}
