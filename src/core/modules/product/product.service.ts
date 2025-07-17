import AppDataSource from "@config/database/typeorm";
import { Product } from "@entities/product.entity";
import { Repository } from "typeorm";
import { redisCacheClient } from "@/config/database/redis";

// Define cache keys and expiration time
const PRODUCT_CACHE_KEY = "product:";
const ALL_PRODUCTS_CACHE_KEY = "products:all";
const CACHE_EXPIRATION = 3600; // 1 hour in seconds
export class ProductService {
  private productRepository: Repository<Product>;

  constructor() {
    this.productRepository = AppDataSource.getRepository(Product);
  }

  // cache helpers
  private async getProductFromCache(id: number): Promise<Product | null> {
    const cachedProduct = await redisCacheClient.get(`${PRODUCT_CACHE_KEY}${id}`);
    return cachedProduct ? JSON.parse(cachedProduct) : null;
  }

  private async setProductInCache(product: Product): Promise<void> {
    await redisCacheClient.set(
      `${PRODUCT_CACHE_KEY}${product.id}`,
      JSON.stringify(product),
      { EX: CACHE_EXPIRATION }
    );
  }

  private async clearProductCache(id: number): Promise<void> {
    await redisCacheClient.del(`${PRODUCT_CACHE_KEY}${id}`);
    // Invalidate list cache as well
    await redisCacheClient.del(ALL_PRODUCTS_CACHE_KEY); 
  }
  ///////

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<[Product[], number]> {
    // For simplicity, we'll cache the first page. For full pagination caching,
    // you would create a key like `products:all:page:${page}:limit:${limit}`
    const cacheKey = `${ALL_PRODUCTS_CACHE_KEY}:page:${page}:limit:${limit}`;

    const cachedProducts = await redisCacheClient.get(cacheKey);
    if (cachedProducts) {
      console.log("CACHE HIT for findAll");
      return JSON.parse(cachedProducts);
    }
    
    console.log("CACHE MISS for findAll");
    const [products, count] = await this.productRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ["category", "images"],
      order: { created_at: "DESC" },
    });

    const imageLinkModifiedProducts = products.map((product) => {
      product.images = product.images.map((image) => {
        if (image.image_url) {
          image.image_url = image.getSignedUrl() || "";
        }
        return image;
      });
      return product;
    })
    
    // Cache the result
    await redisCacheClient.set(cacheKey, JSON.stringify([imageLinkModifiedProducts, count]), { EX: CACHE_EXPIRATION });

    return [imageLinkModifiedProducts, count];
  }

  async findById(id: number): Promise<Product | null> {
    // 1. Check cache first
    const cachedProduct = await this.getProductFromCache(id);
    if (cachedProduct) {
      console.log(`CACHE HIT for product ID: ${id}`);
      return cachedProduct;
    }

    // 2. If miss, fetch from DB
    console.log(`CACHE MISS for product ID: ${id}`);
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ["category", "images"],
    });

    if (product) {
      // 3. Populate signed URLs and store in cache before returning
      product.images = product.images.map((image) => {
        if (image.image_url) {
          image.image_url = image.getSignedUrl() || "";
        }
        return image;
      });
      await this.setProductInCache(product);
    }

    return product;
  }
  
  async create(data: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(data);
    const newProduct = await this.productRepository.save(product);
    
    // Invalidate the "all products" cache
    await redisCacheClient.del(ALL_PRODUCTS_CACHE_KEY);
    console.log("CACHE INVALIDATED for all products list due to new product creation.");

    return newProduct;
  }

  async update(id: number, data: Partial<Product>): Promise<Product | null> {
    await this.productRepository.update(id, data);
    
    // Invalidate the cache for this specific product and the list
    await this.clearProductCache(id);
    console.log(`CACHE INVALIDATED for product ID: ${id}`);
    
    // Fetch the updated data to return it
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.productRepository.delete(id);

    if (result.affected && result.affected > 0) {
      // Invalidate the cache for this specific product
      await this.clearProductCache(id);
      console.log(`CACHE INVALIDATED for product ID: ${id}`);
      return true;
    }
    
    return false;
  }
  
  // You would apply a similar caching strategy to other find methods like findByCategory and searchProducts
  async findByCategory(
    categoryId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<[Product[], number]> {
    // Implementation would be similar to findAll, but with a category-specific key
    const cacheKey = `products:category:${categoryId}:page:${page}:limit:${limit}`;
    const cachedData = await redisCacheClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const [products, count] = await this.productRepository.findAndCount({
      where: { category: { id: categoryId } },
      relations: ["category", "images"],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: "DESC" },
    });

    const imageLinkModifiedProducts = products.map((product) => {
      product.images = product.images.map((image) => {
        if (image.image_url) {
          image.image_url = image.getSignedUrl() || "";
        }
        return image;
      });
      return product;
    })

    await redisCacheClient.set(cacheKey, JSON.stringify([imageLinkModifiedProducts, count]), { EX: CACHE_EXPIRATION });

    return [imageLinkModifiedProducts, count];
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
