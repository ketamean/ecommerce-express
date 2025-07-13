import { Repository, ObjectLiteral, DeepPartial } from "typeorm";

export abstract class BaseRepository<T extends ObjectLiteral> {
  protected constructor(private readonly repository: Repository<T>) {}

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findOne(id: number): Promise<T | null> {
    return this.repository.findOne({ where: { id } as any });
  }

  async update(id: number, data: DeepPartial<T>): Promise<T | null> {
    await this.repository.update(id, data as any);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
