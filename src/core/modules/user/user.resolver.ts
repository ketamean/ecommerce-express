import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import { UserType, AuthResponse } from "./user.type";
import {
  RegisterInput,
  LoginInput,
  UpdateProfileInput,
  ChangePasswordInput,
} from "./user.input";
import { UserService } from "./user.service";
import { GraphQLContext } from "./context";
import { verifyAccessToken } from "@utils/jwt";

// Authentication middleware for GraphQL
function AuthMiddleware(requireAuth: boolean = true) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const context = args[args.length - 1] as GraphQLContext;
      const req = (context as any).req;

      if (requireAuth) {
        const authHeader = req?.headers?.authorization;
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
          throw new Error("Authentication required");
        }

        const user = verifyAccessToken(token);
        if (!user) {
          throw new Error("Invalid or expired token");
        }

        context.user = user;
      }

      return method.apply(this, args);
    };
  };
}

@Resolver(UserType)
export class UserResolver {
  private userService = new UserService();

  @Mutation(() => AuthResponse)
  async register(@Arg("data") data: RegisterInput): Promise<AuthResponse> {
    const result = await this.userService.register(data);
    return {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }

  @Mutation(() => AuthResponse)
  async login(@Arg("data") data: LoginInput): Promise<AuthResponse> {
    const result = await this.userService.login(data.email, data.password);
    return {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }

  @Query(() => UserType, { nullable: true })
  @AuthMiddleware(true)
  async me(@Ctx() context: GraphQLContext): Promise<UserType | null> {
    if (!context.user) {
      throw new Error("Authentication required");
    }

    const user = await this.userService.findByUserId(context.user.userId);
    return user;
  }

  @Mutation(() => UserType, { nullable: true })
  @AuthMiddleware(true)
  async updateProfile(
    @Arg("data") data: UpdateProfileInput,
    @Ctx() context: GraphQLContext
  ): Promise<UserType | null> {
    if (!context.user) {
      throw new Error("Authentication required");
    }

    return this.userService.updateProfile(context.user.userId, data);
  }

  @Mutation(() => Boolean)
  @AuthMiddleware(true)
  async changePassword(
    @Arg("data") data: ChangePasswordInput,
    @Ctx() context: GraphQLContext
  ): Promise<boolean> {
    if (!context.user) {
      throw new Error("Authentication required");
    }

    return this.userService.changePassword(
      context.user.userId,
      data.currentPassword,
      data.newPassword
    );
  }

  @Mutation(() => Boolean)
  @AuthMiddleware(true)
  async deleteAccount(@Ctx() context: GraphQLContext): Promise<boolean> {
    if (!context.user) {
      throw new Error("Authentication required");
    }

    return this.userService.deleteAccount(context.user.userId);
  }
}
