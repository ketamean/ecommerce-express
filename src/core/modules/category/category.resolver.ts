import { Resolver, Query, Mutation, Arg, Int, Ctx } from "type-graphql";
import { CategoryType } from "./category.type";
import { CategoryService } from "./category.service";
import { CategoryInput, CategorySearchInput } from "./category.input";
import { Product } from "@modules/product/product.type";
import { GraphQLContext } from "@modules/user/context";
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
          throw new Error("Authentication token required");
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

// Admin middleware for GraphQL
function AdminMiddleware() {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const context = args[args.length - 1] as GraphQLContext;

      if (!context.user) {
        throw new Error("Authentication required");
      }

      if (!context.user.isAdmin) {
        throw new Error("Admin privileges required");
      }

      return method.apply(this, args);
    };
  };
}

@Resolver(CategoryType)
export class CategoryResolver {
  @Query(() => [CategoryType])
  async categories(
    @Arg("page", () => Int, { defaultValue: 1 }) page: number,
    @Arg("limit", () => Int, { defaultValue: 10 }) limit: number
  ): Promise<CategoryType[]> {
    const categoryService = await CategoryService.create();
    const [categories] = await categoryService.findAll(page, limit);
    return categories;
  }

  @Query(() => CategoryType, { nullable: true })
  async category(
    @Arg("id", () => Int) id: number
  ): Promise<CategoryType | null> {
    const categoryService = await CategoryService.create();
    return categoryService.findById(id);
  }

  @Query(() => CategoryType, { nullable: true })
  async categoryByName(
    @Arg("name") name: string
  ): Promise<CategoryType | null> {
    const categoryService = await CategoryService.create();
    return categoryService.findByName(name);
  }

  @Query(() => [CategoryType])
  async searchCategories(
    @Arg("searchInput") searchInput: CategorySearchInput,
    @Arg("page", () => Int, { defaultValue: 1 }) page: number,
    @Arg("limit", () => Int, { defaultValue: 10 }) limit: number
  ): Promise<CategoryType[]> {
    const categoryService = await CategoryService.create();
    const [categories] = await categoryService.search(
      searchInput,
      page,
      limit
    );
    return categories;
  }

  @Query(() => [Product])
  async productsByCategory(
    @Arg("categoryId", () => Int) categoryId: number,
    @Arg("page", () => Int, { defaultValue: 1 }) page: number,
    @Arg("limit", () => Int, { defaultValue: 10 }) limit: number
  ): Promise<Product[]> {
    const categoryService = await CategoryService.create();
    const [products] = await categoryService.getProductsByCategory(
      categoryId,
      page,
      limit
    );
    return products;
  }

  @Mutation(() => CategoryType)
  @AuthMiddleware(true)
  @AdminMiddleware()
  async createCategory(
    @Arg("data") data: CategoryInput,
    @Ctx() context: GraphQLContext
  ): Promise<CategoryType> {
    const categoryService = await CategoryService.create();
    return categoryService.create(data);
  }

  @Mutation(() => CategoryType, { nullable: true })
  @AuthMiddleware(true)
  @AdminMiddleware()
  async updateCategory(
    @Arg("id", () => Int) id: number,
    @Arg("data") data: CategoryInput,
    @Ctx() context: GraphQLContext
  ): Promise<CategoryType | null> {
    const categoryService = await CategoryService.create();
    return categoryService.update(id, data);
  }

  @Mutation(() => Boolean)
  @AuthMiddleware(true)
  @AdminMiddleware()
  async deleteCategory(
    @Arg("id", () => Int) id: number,
    @Ctx() context: GraphQLContext
  ): Promise<boolean> {
    const categoryService = await CategoryService.create();
    return categoryService.delete(id);
  }
}
