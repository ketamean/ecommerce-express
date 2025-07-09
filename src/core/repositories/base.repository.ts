import { Repository } from "typeorm";

export abstract class BaseRepository<T> {
  protected constructor(private readonly repository: Repository<T>) {}

  async create(data: T): Promise<T> {
    return this.repository.save(data);
  }

  async findOne(id: number): Promise<T | undefined> {
    return this.repository.findOne(id);
  }

  async update(id: number, data: Partial<T>): Promise<T | undefined> {
    await this.repository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}