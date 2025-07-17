import AppDataSource from "@config/database/typeorm";
import { Cart } from "@entities/cart.entity";
import { CartDetail } from "@entities/cart-detail.entity";
import { Product } from "@entities/product.entity";
import { User } from "@entities/user.entity";
import { DataSource, Repository } from "typeorm";
import {
  AddToCartInput,
  UpdateCartItemInput,
  RemoveFromCartInput,
} from "./cart.input";

export class CartService {
  private cartRepository: Repository<Cart>;
  private cartDetailRepository: Repository<CartDetail>;
  private productRepository: Repository<Product>;
  private userRepository: Repository<User>;

  constructor(dataSource: DataSource) {
    this.cartRepository = dataSource.getRepository(Cart);
    this.cartDetailRepository = dataSource.getRepository(CartDetail);
    this.productRepository = dataSource.getRepository(Product);
    this.userRepository = dataSource.getRepository(User);
  }

  public static async create(): Promise<CartService> {
    // Await the AppDataSource promise to get the initialized DataSource
    const dataSource = await AppDataSource;
    // Create and return a new instance of the service
    return new CartService(dataSource);
  }

  // Get or create cart for user
  async getOrCreateCart(userId: string): Promise<Cart> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
      relations: ["cart", "cart.cartDetails", "cart.cartDetails.product"],
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.cart) {
      return user.cart;
    }

    // Create new cart for user
    const newCart = this.cartRepository.create({ user });
    return this.cartRepository.save(newCart);
  }

  // Get user's cart with details
  async getCart(userId: string): Promise<Cart | null> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
      relations: [
        "cart",
        "cart.cartDetails",
        "cart.cartDetails.product",
        "cart.cartDetails.product.category",
      ],
    });

    if (!user || !user.cart) {
      return null;
    }

    return user.cart;
  }

  // Add item to cart
  async addToCart(userId: string, input: AddToCartInput): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    // Check if product exists and has sufficient inventory
    const product = await this.productRepository.findOne({
      where: { id: input.productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.inventory_count < input.quantity) {
      throw new Error(
        `Insufficient inventory. Only ${product.inventory_count} items available`
      );
    }

    // Check if item already exists in cart
    const existingCartDetail = await this.cartDetailRepository.findOne({
      where: {
        cart: { id: cart.id },
        product: { id: input.productId },
        status: "active",
      },
    });

    if (existingCartDetail) {
      // Update quantity
      const newQuantity = existingCartDetail.quantity + input.quantity;

      if (product.inventory_count < newQuantity) {
        throw new Error(
          `Insufficient inventory. Only ${product.inventory_count} items available`
        );
      }

      existingCartDetail.quantity = newQuantity;
      await this.cartDetailRepository.save(existingCartDetail);
    } else {
      // Create new cart detail
      const cartDetail = this.cartDetailRepository.create({
        cart,
        product,
        quantity: input.quantity,
        status: "active",
      });
      await this.cartDetailRepository.save(cartDetail);
    }

    // Update cart timestamp
    cart.updated_at = new Date();
    await this.cartRepository.save(cart);

    return this.getCart(userId) as Promise<Cart>;
  }

  // Update cart item quantity
  async updateCartItem(
    userId: string,
    input: UpdateCartItemInput
  ): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    if (input.quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    // Find cart detail
    const cartDetail = await this.cartDetailRepository.findOne({
      where: {
        cart: { id: cart.id },
        product: { id: input.productId },
        status: "active",
      },
      relations: ["product"],
    });

    if (!cartDetail) {
      throw new Error("Item not found in cart");
    }

    // Check inventory
    if (cartDetail.product.inventory_count < input.quantity) {
      throw new Error(
        `Insufficient inventory. Only ${cartDetail.product.inventory_count} items available`
      );
    }

    cartDetail.quantity = input.quantity;
    await this.cartDetailRepository.save(cartDetail);

    // Update cart timestamp
    cart.updated_at = new Date();
    await this.cartRepository.save(cart);

    return this.getCart(userId) as Promise<Cart>;
  }

  // Remove item from cart
  async removeFromCart(
    userId: string,
    input: RemoveFromCartInput
  ): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    // Find and remove cart detail
    const cartDetail = await this.cartDetailRepository.findOne({
      where: {
        cart: { id: cart.id },
        product: { id: input.productId },
        status: "active",
      },
    });

    if (!cartDetail) {
      throw new Error("Item not found in cart");
    }

    await this.cartDetailRepository.remove(cartDetail);

    // Update cart timestamp
    cart.updated_at = new Date();
    await this.cartRepository.save(cart);

    return this.getCart(userId) as Promise<Cart>;
  }

  // Clear cart (useful after checkout)
  async clearCart(userId: string): Promise<boolean> {
    const cart = await this.getOrCreateCart(userId);

    await this.cartDetailRepository.delete({
      cart: { id: cart.id },
      status: "active",
    });

    // Update cart timestamp
    cart.updated_at = new Date();
    await this.cartRepository.save(cart);

    return true;
  }

  // Calculate cart totals
  async calculateCartTotals(
    cart: Cart
  ): Promise<{ totalAmount: number; totalItems: number }> {
    let totalAmount = 0;
    let totalItems = 0;

    for (const detail of cart.cartDetails || []) {
      if (detail.status === "active") {
        totalAmount += detail.product.price * detail.quantity;
        totalItems += detail.quantity;
      }
    }

    return { totalAmount, totalItems };
  }
}
