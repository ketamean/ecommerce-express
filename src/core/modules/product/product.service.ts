import AppDataSource from '@config/database/typeorm';
import { Product } from '@entities/product.entity';
import { Repository } from 'typeorm';

export class ProductService {
  private productRepository: Repository<Product>;

  constructor() {
    this.productRepository = AppDataSource.getRepository(Product);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<[Product[], number]> {
    const skip = (page - 1) * limit;
    return this.productRepository.findAndCount({
      skip,
      take: limit,
      relations: ['category'],
    });
  }

  async findById(id: number): Promise<Product | null> {
    return this.productRepository.findOne({ where: { id }, relations: ['category'] });
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
    console.log('Delete result:', result);
    if (result.affected === undefined) return false;
    return result.affected === null || result.affected > 0;
  }
}