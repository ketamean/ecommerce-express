import { Resolver, Query, Mutation, Arg, Int } from "type-graphql";
import { Product } from "./product.type";
import { ProductService } from "./product.service";
import { ProductInput } from "./product.input";

@Resolver(Product)
export class ProductResolver {
  @Query(() => [Product])
  async products(
    @Arg("page", () => Int, { defaultValue: 1 }) page: number,
    @Arg("limit", () => Int, { defaultValue: 10 }) limit: number
  ): Promise<Product[]> {
    const productService = await ProductService.create();
    const [products] = await productService.findAll(page, limit);
    return products;
  }

  @Query(() => Product, { nullable: true })
  async product(@Arg("id", () => Int) id: number): Promise<Product | null> {
    const productService = await ProductService.create();
    return productService.findById(id);
  }

  @Mutation(() => Product)
  async createProduct(@Arg("data") data: ProductInput): Promise<Product> {
    const productService = await ProductService.create();
    return productService.create(data);
  }

  @Mutation(() => Product, { nullable: true })
  async updateProduct(
    @Arg("id", () => Int) id: number,
    @Arg("data") data: ProductInput
  ): Promise<Product | null> {
    const productService = await ProductService.create();
    return productService.update(id, data);
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Arg("id", () => Int) id: number): Promise<boolean> {
    const productService = await ProductService.create();
    return productService.delete(id);
  }

  @Query(() => [Product])
  async productsByCategory(
    @Arg("categoryId", () => Int) categoryId: number,
    @Arg("page", () => Int, { defaultValue: 1 }) page: number,
    @Arg("limit", () => Int, { defaultValue: 10 }) limit: number
  ): Promise<Product[]> {
    const productService = await ProductService.create();
    const [products] = await productService.findByCategory(
      categoryId,
      page,
      limit
    );
    return products;
  }

  @Query(() => [Product])
  async searchProducts(
    @Arg("searchTerm") searchTerm: string,
    @Arg("page", () => Int, { defaultValue: 1 }) page: number,
    @Arg("limit", () => Int, { defaultValue: 10 }) limit: number,
    @Arg("categoryId", () => Int, { nullable: true }) categoryId?: number
  ): Promise<Product[]> {
    const productService = await ProductService.create();
    const [products] = await productService.searchProducts(
      searchTerm,
      categoryId,
      page,
      limit
    );
    return products;
  }
}
