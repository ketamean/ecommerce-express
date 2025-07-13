import "reflect-metadata";
import AppDataSource from "@config/database/typeorm";
import { Category } from "@entities/category.entity";
import { Product } from "@entities/product.entity";

async function seedCategories() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log("Database connected successfully");

    const categoryRepository = AppDataSource.getRepository(Category);
    const productRepository = AppDataSource.getRepository(Product);

    // Create sample categories
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

    console.log("Creating categories...");

    for (const categoryData of categories) {
      // Check if category already exists
      const existingCategory = await categoryRepository.findOne({
        where: { name: categoryData.name },
      });

      if (!existingCategory) {
        const category = categoryRepository.create(categoryData);
        await categoryRepository.save(category);
        console.log(`✓ Created category: ${categoryData.name}`);
      } else {
        console.log(`- Category already exists: ${categoryData.name}`);
      }
    }

    // Create some sample products with categories
    const electronicsCategory = await categoryRepository.findOne({
      where: { name: "Electronics" },
    });
    const clothingCategory = await categoryRepository.findOne({
      where: { name: "Clothing" },
    });

    if (electronicsCategory) {
      const sampleProducts = [
        {
          name: "iPhone 15 Pro",
          description: "Latest Apple smartphone with advanced features",
          price: 999.99,
          inventory_count: 50,
          category: electronicsCategory,
        },
        {
          name: "Samsung Galaxy S24",
          description: "Flagship Android smartphone",
          price: 899.99,
          inventory_count: 30,
          category: electronicsCategory,
        },
      ];

      for (const productData of sampleProducts) {
        const existingProduct = await productRepository.findOne({
          where: { name: productData.name },
        });

        if (!existingProduct) {
          const product = productRepository.create(productData);
          await productRepository.save(product);
          console.log(`✓ Created product: ${productData.name}`);
        } else {
          console.log(`- Product already exists: ${productData.name}`);
        }
      }
    }

    if (clothingCategory) {
      const clothingProducts = [
        {
          name: "Cotton T-Shirt",
          description: "Comfortable cotton t-shirt in various colors",
          price: 19.99,
          inventory_count: 100,
          category: clothingCategory,
        },
      ];

      for (const productData of clothingProducts) {
        const existingProduct = await productRepository.findOne({
          where: { name: productData.name },
        });

        if (!existingProduct) {
          const product = productRepository.create(productData);
          await productRepository.save(product);
          console.log(`✓ Created product: ${productData.name}`);
        } else {
          console.log(`- Product already exists: ${productData.name}`);
        }
      }
    }

    console.log("✅ Seed data created successfully!");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

// Run the seed function
seedCategories();
