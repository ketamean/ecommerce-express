import AppDataSource from "@config/database/typeorm";
import { Category } from "@entities/category.entity";
import { Product } from "@entities/product.entity";
import { Repository, ILike, DataSource } from "typeorm";
import { CategoryInput, CategorySearchInput } from "./category.input";

export class CategoryService {
  private categoryRepository: Repository<Category>;
  private productRepository: Repository<Product>;

  constructor(dataSource: DataSource) {
    this.categoryRepository = dataSource.getRepository(Category);
    this.productRepository = dataSource.getRepository(Product);
  }

  public static async create(): Promise<CategoryService> {
    // Await the AppDataSource promise to get the initialized DataSource
    const dataSource = await AppDataSource;
    // Create and return a new instance of the service
    return new CategoryService(dataSource);
  }

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<[Category[], number]> {
    const skip = (page - 1) * limit;
    return this.categoryRepository.findAndCount({
      skip,
      take: limit,
      order: { created_at: "DESC" },
    });
  }

  async findById(id: number): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: { id },
      relations: ["products"],
    });
  }

  async findByName(name: string): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: { name },
      relations: ["products"],
    });
  }

  async search(
    searchInput: CategorySearchInput,
    page: number = 1,
    limit: number = 10
  ): Promise<[Category[], number]> {
    const skip = (page - 1) * limit;
    const queryBuilder = this.categoryRepository.createQueryBuilder("category");

    if (searchInput.name) {
      queryBuilder.andWhere("category.name ILIKE :name", {
        name: `%${searchInput.name}%`,
      });
    }

    if (searchInput.description) {
      queryBuilder.andWhere("category.description ILIKE :description", {
        description: `%${searchInput.description}%`,
      });
    }

    queryBuilder.orderBy("category.created_at", "DESC").skip(skip).take(limit);

    return queryBuilder.getManyAndCount();
  }

  async create(data: CategoryInput): Promise<Category> {
    // Check if category with the same name already exists
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: data.name },
    });

    if (existingCategory) {
      throw new Error(`Category with name "${data.name}" already exists`);
    }

    const category = this.categoryRepository.create(data);
    return this.categoryRepository.save(category);
  }

  async update(id: number, data: CategoryInput): Promise<Category | null> {
    // Check if category exists
    const existingCategory = await this.findById(id);
    if (!existingCategory) {
      throw new Error("Category not found");
    }

    // Check if another category with the same name exists (excluding current category)
    if (data.name !== existingCategory.name) {
      const categoryWithSameName = await this.categoryRepository.findOne({
        where: { name: data.name },
      });

      if (categoryWithSameName && categoryWithSameName.id !== id) {
        throw new Error(`Category with name "${data.name}" already exists`);
      }
    }

    await this.categoryRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    // Check if category exists
    const existingCategory = await this.findById(id);
    if (!existingCategory) {
      throw new Error("Category not found");
    }

    // Check if category has associated products
    const productCount = await this.productRepository.count({
      where: { category: { id } },
    });

    if (productCount > 0) {
      throw new Error(
        `Cannot delete category. It has ${productCount} associated product(s). Please delete or reassign the products first.`
      );
    }

    const result = await this.categoryRepository.delete(id);
    return (
      result.affected !== undefined &&
      result.affected !== null &&
      result.affected > 0
    );
  }

  async getProductsByCategory(
    categoryId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<[Product[], number]> {
    const skip = (page - 1) * limit;
    return this.productRepository.findAndCount({
      where: { category: { id: categoryId } },
      relations: ["category"],
      skip,
      take: limit,
      order: { created_at: "DESC" },
    });
  }
}
