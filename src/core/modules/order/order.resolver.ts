import { Resolver, Query, Mutation, Arg, Ctx, Int } from "type-graphql";
import { OrderType, OrderSummaryType } from "./order.type";
import { OrderService } from "./order.service";
import { CreateOrderInput, OrderStatus } from "./order.input";
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

@Resolver(OrderType)
export class OrderResolver {
  private orderService = new OrderService();

  @Mutation(() => OrderType)
  @AuthMiddleware(true)
  async createOrderFromCart(
    @Arg("input") input: CreateOrderInput,
    @Ctx() context: GraphQLContext
  ): Promise<OrderType> {
    if (!context.user) {
      throw new Error("Authentication required");
    }

    const order = await this.orderService.createOrderFromCart(
      context.user.userId,
      input
    );

    // Calculate totals and add computed fields
    const { totalItems } = await this.orderService.calculateOrderTotals(order);

    // Transform order details to include subtotal
    const orderDetailsWithSubtotal =
      order.orderDetails?.map((detail) => ({
        ...detail,
        subtotal: detail.price_at_purchase * detail.quantity,
      })) || [];

    return {
      ...order,
      orderDetails: orderDetailsWithSubtotal,
      totalItems,
      payment_method: order.payment_method as any,
      status: order.status as OrderStatus,
    };
  }

  @Query(() => OrderSummaryType)
  @AuthMiddleware(true)
  async myOrders(
    @Arg("page", () => Int, { defaultValue: 1 }) page: number,
    @Arg("limit", () => Int, { defaultValue: 10 }) limit: number,
    @Ctx() context: GraphQLContext
  ): Promise<OrderSummaryType> {
    if (!context.user) {
      throw new Error("Authentication required");
    }

    const [orders, total] = await this.orderService.getUserOrders(
      context.user.userId,
      page,
      limit
    );

    // Transform orders to include computed fields
    const transformedOrders = await Promise.all(
      orders.map(async (order) => {
        const { totalItems } = await this.orderService.calculateOrderTotals(
          order
        );

        const orderDetailsWithSubtotal =
          order.orderDetails?.map((detail) => ({
            ...detail,
            subtotal: detail.price_at_purchase * detail.quantity,
          })) || [];

        return {
          ...order,
          orderDetails: orderDetailsWithSubtotal,
          totalItems,
          payment_method: order.payment_method as any,
          status: order.status as OrderStatus,
        };
      })
    );

    return {
      orders: transformedOrders,
      total,
      page,
      limit,
    };
  }

  @Query(() => OrderType, { nullable: true })
  @AuthMiddleware(true)
  async myOrder(
    @Arg("id", () => Int) id: number,
    @Ctx() context: GraphQLContext
  ): Promise<OrderType | null> {
    if (!context.user) {
      throw new Error("Authentication required");
    }

    const order = await this.orderService.getOrderById(context.user.userId, id);

    if (!order) {
      return null;
    }

    // Calculate totals and add computed fields
    const { totalItems } = await this.orderService.calculateOrderTotals(order);

    // Transform order details to include subtotal
    const orderDetailsWithSubtotal =
      order.orderDetails?.map((detail) => ({
        ...detail,
        subtotal: detail.price_at_purchase * detail.quantity,
      })) || [];

    return {
      ...order,
      orderDetails: orderDetailsWithSubtotal,
      totalItems,
      payment_method: order.payment_method as any,
      status: order.status as OrderStatus,
    };
  }

  @Mutation(() => OrderType)
  @AuthMiddleware(true)
  async cancelOrder(
    @Arg("id", () => Int) id: number,
    @Ctx() context: GraphQLContext
  ): Promise<OrderType> {
    if (!context.user) {
      throw new Error("Authentication required");
    }

    const order = await this.orderService.cancelOrder(context.user.userId, id);

    // Calculate totals and add computed fields
    const { totalItems } = await this.orderService.calculateOrderTotals(order);

    // Transform order details to include subtotal
    const orderDetailsWithSubtotal =
      order.orderDetails?.map((detail) => ({
        ...detail,
        subtotal: detail.price_at_purchase * detail.quantity,
      })) || [];

    return {
      ...order,
      orderDetails: orderDetailsWithSubtotal,
      totalItems,
      payment_method: order.payment_method as any,
      status: order.status as OrderStatus,
    };
  }
}