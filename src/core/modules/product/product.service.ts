import AppDataSource from "@config/database/typeorm";
import { Product } from "@entities/product.entity";
import { Repository, DataSource } from "typeorm";

export class ProductService {
  private productRepository: Repository<Product>;

  constructor(dataSource: DataSource) {
    this.productRepository = dataSource.getRepository(Product);
  }

  public static async create(): Promise<ProductService> {
    // Await the AppDataSource promise to get the initialized DataSource
    const dataSource = await AppDataSource;
    // Create and return a new instance of the service
    return new ProductService(dataSource);
  }

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<[Product[], number]> {
    const skip = (page - 1) * limit;
    return this.productRepository.findAndCount({
      skip,
      take: limit,
      relations: ["category", "images"],
      order: { created_at: "DESC" },
    });
  }

  async findById(id: number): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { id },
      relations: ["category", "images"],
    });
  }

  async create(data: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(data);
    return this.productRepository.save(product);
  }

  async update(id: number, data: Partial<Product>): Promise<Product | null> {
    await this.productRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.productRepository.delete(id);
    console.log("Delete result:", result);
    if (result.affected === undefined) return false;
    return result.affected === null || result.affected > 0;
  }

  async findByCategory(
    categoryId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<[Product[], number]> {
    const skip = (page - 1) * limit;
    return this.productRepository.findAndCount({
      where: { category: { id: categoryId } },
      relations: ["category", "images"],
      skip,
      take: limit,
      order: { created_at: "DESC" },
    });
  }

  async searchProducts(
    searchTerm: string,
    categoryId?: number,
    page: number = 1,
    limit: number = 10
  ): Promise<[Product[], number]> {
    const skip = (page - 1) * limit;
    const queryBuilder = this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.images", "images");

    if (searchTerm) {
      queryBuilder.andWhere(
        "(product.name ILIKE :searchTerm OR product.description ILIKE :searchTerm)",
        { searchTerm: `%${searchTerm}%` }
      );
    }

    if (categoryId) {
      queryBuilder.andWhere("category.id = :categoryId", { categoryId });
    }

    queryBuilder.orderBy("product.created_at", "DESC").skip(skip).take(limit);

    return queryBuilder.getManyAndCount();
  }
}
