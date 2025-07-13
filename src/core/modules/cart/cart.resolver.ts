import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { CartType } from "./cart.type";
import { CartService } from "./cart.service";
import {
  AddToCartInput,
  UpdateCartItemInput,
  RemoveFromCartInput,
} from "./cart.input";
import { GraphQLContext } from "@modules/user/context";

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

        const { verifyAccessToken } = await import("@utils/jwt");
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

@Resolver(CartType)
export class CartResolver {
  private cartService = new CartService();

  @Query(() => CartType, { nullable: true })
  @AuthMiddleware(true)
  async myCart(@Ctx() context: GraphQLContext): Promise<CartType | null> {
    if (!context.user) {
      throw new Error("Authentication required");
    }

    const cart = await this.cartService.getCart(context.user.userId);

    if (!cart) {
      return null;
    }

    // Calculate totals and add computed fields
    const { totalAmount, totalItems } =
      await this.cartService.calculateCartTotals(cart);

    // Transform cart details to include subtotal
    const cartDetailsWithSubtotal =
      cart.cartDetails?.map((detail) => ({
        ...detail,
        subtotal: detail.product.price * detail.quantity,
      })) || [];

    return {
      ...cart,
      cartDetails: cartDetailsWithSubtotal,
      totalAmount,
      totalItems,
    };
  }

  @Mutation(() => CartType)
  @AuthMiddleware(true)
  async addToCart(
    @Arg("input") input: AddToCartInput,
    @Ctx() context: GraphQLContext
  ): Promise<CartType> {
    if (!context.user) {
      throw new Error("Authentication required");
    }

    const cart = await this.cartService.addToCart(context.user.userId, input);

    // Calculate totals and add computed fields
    const { totalAmount, totalItems } =
      await this.cartService.calculateCartTotals(cart);

    // Transform cart details to include subtotal
    const cartDetailsWithSubtotal =
      cart.cartDetails?.map((detail) => ({
        ...detail,
        subtotal: detail.product.price * detail.quantity,
      })) || [];

    return {
      ...cart,
      cartDetails: cartDetailsWithSubtotal,
      totalAmount,
      totalItems,
    };
  }

  @Mutation(() => CartType)
  @AuthMiddleware(true)
  async updateCartItem(
    @Arg("input") input: UpdateCartItemInput,
    @Ctx() context: GraphQLContext
  ): Promise<CartType> {
    if (!context.user) {
      throw new Error("Authentication required");
    }

    const cart = await this.cartService.updateCartItem(
      context.user.userId,
      input
    );

    // Calculate totals and add computed fields
    const { totalAmount, totalItems } =
      await this.cartService.calculateCartTotals(cart);

    // Transform cart details to include subtotal
    const cartDetailsWithSubtotal =
      cart.cartDetails?.map((detail) => ({
        ...detail,
        subtotal: detail.product.price * detail.quantity,
      })) || [];

    return {
      ...cart,
      cartDetails: cartDetailsWithSubtotal,
      totalAmount,
      totalItems,
    };
  }

  @Mutation(() => CartType)
  @AuthMiddleware(true)
  async removeFromCart(
    @Arg("input") input: RemoveFromCartInput,
    @Ctx() context: GraphQLContext
  ): Promise<CartType> {
    if (!context.user) {
      throw new Error("Authentication required");
    }

    const cart = await this.cartService.removeFromCart(
      context.user.userId,
      input
    );

    // Calculate totals and add computed fields
    const { totalAmount, totalItems } =
      await this.cartService.calculateCartTotals(cart);

    // Transform cart details to include subtotal
    const cartDetailsWithSubtotal =
      cart.cartDetails?.map((detail) => ({
        ...detail,
        subtotal: detail.product.price * detail.quantity,
      })) || [];

    return {
      ...cart,
      cartDetails: cartDetailsWithSubtotal,
      totalAmount,
      totalItems,
    };
  }

  @Mutation(() => Boolean)
  @AuthMiddleware(true)
  async clearCart(@Ctx() context: GraphQLContext): Promise<boolean> {
    if (!context.user) {
      throw new Error("Authentication required");
    }

    return this.cartService.clearCart(context.user.userId);
  }
}
