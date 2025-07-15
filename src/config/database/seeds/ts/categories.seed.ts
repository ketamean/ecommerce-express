import "reflect-metadata";
import AppDataSource from "@config/database/typeorm";
import { Category } from "@entities/category.entity";

const categories = [
  {
    id: 117,
    name: "Electronics",
    description: "Electronic devices, gadgets, and accessories",
  },
  {
    id: 118,
    name: "Clothing",
    description: "Fashion and apparel for all ages",
  },
  {
    id: 119,
    name: "Home & Garden",
    description: "Home improvement and gardening supplies",
  },
  {
    id: 120,
    name: "Books",
    description: "Books, e-books, and educational materials",
  },
  {
    id: 121,
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