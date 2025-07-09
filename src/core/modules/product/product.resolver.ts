import { Resolver, Query, Mutation, Arg, Int } from 'type-graphql';
import { Product } from './product.type';
import { ProductService } from './product.service';
import { ProductInput } from './product.input';

@Resolver(Product)
export class ProductResolver {
  private productService = new ProductService();

  @Query(() => [Product])
  async products(
    @Arg('page', () => Int, { defaultValue: 1 }) page: number,
    @Arg('limit', () => Int, { defaultValue: 10 }) limit: number,
  ): Promise<Product[]> {
    const [products] = await this.productService.findAll(page, limit);
    return products;
  }

  @Query(() => Product, { nullable: true })
  async product(@Arg('id', () => Int) id: number): Promise<Product | null> {
    return this.productService.findById(id);
  }

  @Mutation(() => Product)
  async createProduct(@Arg('data') data: ProductInput): Promise<Product> {
    return this.productService.create(data);
  }

  @Mutation(() => Product, { nullable: true })
  async updateProduct(
    @Arg('id', () => Int) id: number,
    @Arg('data') data: ProductInput,
  ): Promise<Product | null> {
    return this.productService.update(id, data);
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Arg('id', () => Int) id: number): Promise<boolean> {
    return this.productService.delete(id);
  }
}