import "reflect-metadata";
import AppDataSource from "@config/database/typeorm";
import { CategoryService } from "@modules/category/category.service";
import { ProductService } from "@modules/product/product.service";

async function demonstrateCategoryAPI() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log("Database connected successfully\n");

    const categoryService = new CategoryService();
    const productService = new ProductService();

    // 1. Create a new category
    console.log("1. Creating a new category...");
    try {
      const newCategory = await categoryService.create({
        name: "Demo Category",
        description: "A category created for demonstration purposes",
      });
      console.log("✓ Created category:", newCategory.name);
    } catch (error) {
      console.log("- Category might already exist:", (error as Error).message);
    }

    // 2. Get all categories
    console.log("\n2. Fetching all categories...");
    const [categories, totalCategories] = await categoryService.findAll(1, 5);
    console.log(`✓ Found ${totalCategories} total categories:`);
    categories.forEach((cat) => {
      console.log(`  - ${cat.name}: ${cat.description || "No description"}`);
    });

    // 3. Search categories
    console.log('\n3. Searching categories with "elec"...');
    const [searchResults] = await categoryService.search(
      { name: "elec" },
      1,
      10
    );
    console.log(`✓ Found ${searchResults.length} matching categories:`);
    searchResults.forEach((cat) => {
      console.log(`  - ${cat.name}: ${cat.description || "No description"}`);
    });

    // 4. Get products by category (if Electronics category exists)
    const electronicsCategory = await categoryService.findByName("Electronics");
    if (electronicsCategory) {
      console.log("\n4. Getting products in Electronics category...");
      const [products] = await categoryService.getProductsByCategory(
        electronicsCategory.id,
        1,
        5
      );
      console.log(`✓ Found ${products.length} products in Electronics:`);
      products.forEach((product) => {
        console.log(`  - ${product.name}: $${product.price}`);
      });
    } else {
      console.log(
        "\n4. Electronics category not found. Run seed script first: npm run seed:categories"
      );
    }

    // 5. Demonstrate product search with category filter
    console.log('\n5. Searching products with term "phone"...');
    const [searchedProducts] = await productService.searchProducts(
      "phone",
      undefined,
      1,
      5
    );
    console.log(
      `✓ Found ${searchedProducts.length} products matching "phone":`
    );
    searchedProducts.forEach((product) => {
      console.log(
        `  - ${product.name} (${product.category?.name || "No category"}): $${
          product.price
        }`
      );
    });

    console.log("\n✅ Category API demonstration completed!");
  } catch (error) {
    console.error("❌ Error during demonstration:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

// Run the demonstration
if (require.main === module) {
  demonstrateCategoryAPI();
}

export { demonstrateCategoryAPI };
