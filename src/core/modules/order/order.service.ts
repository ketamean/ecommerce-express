import AppDataSource from "@config/database/typeorm";
import { Order } from "@entities/order.entity";
import { OrderDetail } from "@entities/order-detail.entity";
import { Cart } from "@entities/cart.entity";
import { CartDetail } from "@entities/cart-detail.entity";
import { Product } from "@entities/product.entity";
import { User } from "@entities/user.entity";
import { Repository } from "typeorm";
import { CreateOrderInput, PaymentMethod, OrderStatus } from "./order.input";

export class OrderService {
  private orderRepository: Repository<Order>;
  private orderDetailRepository: Repository<OrderDetail>;
  private cartRepository: Repository<Cart>;
  private cartDetailRepository: Repository<CartDetail>;
  private productRepository: Repository<Product>;
  private userRepository: Repository<User>;

  constructor() {
    this.orderRepository = AppDataSource.getRepository(Order);
    this.orderDetailRepository = AppDataSource.getRepository(OrderDetail);
    this.cartRepository = AppDataSource.getRepository(Cart);
    this.cartDetailRepository = AppDataSource.getRepository(CartDetail);
    this.productRepository = AppDataSource.getRepository(Product);
    this.userRepository = AppDataSource.getRepository(User);
  }

  // Create order from cart
  async createOrderFromCart(
    userId: string,
    input: CreateOrderInput
  ): Promise<Order> {
    // Get user and their cart
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
      relations: ["cart", "cart.cartDetails", "cart.cartDetails.product"],
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (
      !user.cart ||
      !user.cart.cartDetails ||
      user.cart.cartDetails.length === 0
    ) {
      throw new Error("Cart is empty");
    }

    // Filter active cart items
    const activeCartItems = user.cart.cartDetails.filter(
      (item) => item.status === "active"
    );

    if (activeCartItems.length === 0) {
      throw new Error("No active items in cart");
    }

    // Start transaction
    return AppDataSource.transaction(async (manager) => {
      // Check inventory for all items
      for (const cartItem of activeCartItems) {
        const product = await manager.findOne(Product, {
          where: { id: cartItem.product.id },
        });

        if (!product) {
          throw new Error(`Product ${cartItem.product.name} not found`);
        }

        if (product.inventory_count < cartItem.quantity) {
          throw new Error(
            `Insufficient inventory for ${product.name}. Only ${product.inventory_count} items available`
          );
        }
      }

      // Calculate total amount
      let totalAmount = 0;
      for (const cartItem of activeCartItems) {
        totalAmount += cartItem.product.price * cartItem.quantity;
      }

      // Create order
      const order = manager.create(Order, {
        user,
        total_amount: totalAmount,
        status: OrderStatus.PENDING,
        payment_method: input.payment_method,
        shipping_address: input.shipping_address,
        payment_gateway_id: input.payment_gateway_id,
      });

      const savedOrder = await manager.save(order);

      // Create order details and update inventory
      for (const cartItem of activeCartItems) {
        // Create order detail
        const orderDetail = manager.create(OrderDetail, {
          order: savedOrder,
          product: cartItem.product,
          quantity: cartItem.quantity,
          price_at_purchase: cartItem.product.price,
        });

        await manager.save(orderDetail);

        // Update product inventory
        await manager.decrement(
          Product,
          { id: cartItem.product.id },
          "inventory_count",
          cartItem.quantity
        );
      }

      // Clear cart after successful order
      await manager.delete(CartDetail, {
        cart: { id: user.cart.id },
        status: "active",
      });

      // Update cart timestamp
      user.cart.updated_at = new Date();
      await manager.save(user.cart);

      // If payment method is COD, confirm the order
      if (input.payment_method === PaymentMethod.COD) {
        savedOrder.status = OrderStatus.CONFIRMED;
        await manager.save(savedOrder);
      }

      return savedOrder;
    });
  }

  // Get user's order history
  async getUserOrders(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<[Order[], number]> {
    const skip = (page - 1) * limit;

    return this.orderRepository.findAndCount({
      where: { user: { user_id: userId } },
      relations: [
        "orderDetails",
        "orderDetails.product",
        "orderDetails.product.category",
        "user",
      ],
      skip,
      take: limit,
      order: { created_at: "DESC" },
    });
  }

  // Get single order by ID
  async getOrderById(userId: string, orderId: number): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: {
        id: orderId,
        user: { user_id: userId },
      },
      relations: [
        "orderDetails",
        "orderDetails.product",
        "orderDetails.product.category",
        "user",
      ],
    });
  }

  // Update order status (for admin use in the future)
  async updateOrderStatus(
    orderId: number,
    status: OrderStatus
  ): Promise<Order | null> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ["orderDetails", "orderDetails.product", "user"],
    });

    if (!order) {
      throw new Error("Order not found");
    }

    order.status = status;
    order.updated_at = new Date();

    return this.orderRepository.save(order);
  }

  // Cancel order (only if status is PENDING or CONFIRMED)
  async cancelOrder(userId: string, orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
        user: { user_id: userId },
      },
      relations: ["orderDetails", "orderDetails.product", "user"],
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (
      order.status !== OrderStatus.PENDING &&
      order.status !== OrderStatus.CONFIRMED
    ) {
      throw new Error(
        "Cannot cancel order. Order is already being processed or completed"
      );
    }

    // Start transaction to restore inventory and update order
    return AppDataSource.transaction(async (manager) => {
      // Restore inventory for all order items
      for (const orderDetail of order.orderDetails) {
        await manager.increment(
          Product,
          { id: orderDetail.product.id },
          "inventory_count",
          orderDetail.quantity
        );
      }

      // Update order status
      order.status = OrderStatus.CANCELLED;
      order.updated_at = new Date();

      return manager.save(order);
    });
  }

  // Calculate order totals
  async calculateOrderTotals(order: Order): Promise<{ totalItems: number }> {
    let totalItems = 0;

    for (const detail of order.orderDetails || []) {
      totalItems += detail.quantity;
    }

    return { totalItems };
  }
}
