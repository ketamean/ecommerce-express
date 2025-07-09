// import { Repository } from "typeorm";
import { User } from "@/entities/user.entity";
import { BaseRepository } from "./base.repository";
import AppDataSource from "@config/database/typeorm";

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(AppDataSource.getRepository(User));
  }
}