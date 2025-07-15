import "reflect-metadata";
import AppDataSource from "@config/database/typeorm";
import { User } from "@entities/user.entity";

const users = [
  {
    "email": "admin1@gmail.com",
    "hashed_password": "$2b$10$6BBaZ/60LSWgy23DNGgQ2OaI7RdSsPmbz30luTQWl7YMK767N.Dta",
    "name": "Admin 1",
    "is_admin": true
  },
  {
    "email": "admin2@gmail.com",
    "hashed_password": "$2b$10$EQJIXDvPX4ECeBdvkZaW2.sdIaPJkC5/Y0D8dzpjzCpH6CRGdb3z2",
    "name": "Admin 2",
    "is_admin": true
  },
  {
    "email": "user1@gmail.com",
    "hashed_password": "$2b$10$hhH5OtOMDN5QdefqoNuhMeUsZC2qYJqWqqoVA3qiwhhTw6o0uVF06",
    "name": "User 1",
    "is_admin": false
  },
  {
    "email": "user2@gmail.com",
    "hashed_password": "$2b$10$exQBUKsvhXysk3Taah1wDO4jlQhJfh8TJWu0S/gSS7jic7xlEnkOS",
    "name": "User 2",
    "is_admin": false
  }
]

export default async function seedUsers() {
  const userRepository = AppDataSource.getRepository(User);

  for (const userData of users) {
    const user = userRepository.create(userData);
    await userRepository.save(user);
  }
}