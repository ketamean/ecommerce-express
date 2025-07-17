import "reflect-metadata";
import AppDataSource from "@config/database/typeorm";
import { Category } from "@entities/category.entity";

const categories = [
  {
    name: "Electronics",
    description: "Electronic devices, gadgets, and accessories",
  },
  {
    name: "Clothing",
    description: "Fashion and apparel for all ages",
  },
  {
    name: "Home & Garden",
    description: "Home improvement and gardening supplies",
  },
  {
    name: "Books",
    description: "Books, e-books, and educational materials",
  },
  {
    name: "Sports & Outdoors",
    description: "Sports equipment and outdoor gear",
  },
];

export default async function seedCategories() {
  const categoryRepository = AppDataSource.getRepository(Category);

  categories.forEach(async (categoryData) => {
    const category = categoryRepository.create(categoryData);
    await categoryRepository.save(category);
  });
}