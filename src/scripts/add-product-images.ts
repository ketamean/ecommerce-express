import "reflect-metadata";
import AppDataSource from "@config/database/typeorm";
import { Product } from "@entities/product.entity";
import { ProductImage } from "@entities/product-image.entity";

async function addProductImages() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log("Database connected successfully");

    const productRepository = AppDataSource.getRepository(Product);
    const productImageRepository = AppDataSource.getRepository(ProductImage);

    // Find an existing product to add images to
    const product = await productRepository.findOne({
      where: { name: "iPhone 15 Pro" },
    });

    if (!product) {
      console.log(
        "No product found to add images to. Please run seed script first."
      );
      return;
    }

    // Sample product images
    const imageData = [
      {
        image_url: "https://example.com/images/iphone-15-pro-front.jpg",
        alt_text: "iPhone 15 Pro front view",
        is_thumbnail: true,
        product: product,
      },
      {
        image_url: "https://example.com/images/iphone-15-pro-back.jpg",
        alt_text: "iPhone 15 Pro back view",
        is_thumbnail: false,
        product: product,
      },
      {
        image_url: "https://example.com/images/iphone-15-pro-side.jpg",
        alt_text: "iPhone 15 Pro side view",
        is_thumbnail: false,
        product: product,
      },
    ];

    console.log(`Adding images for product: ${product.name}`);

    for (const imageInfo of imageData) {
      // Check if image already exists
      const existingImage = await productImageRepository.findOne({
        where: { image_url: imageInfo.image_url },
      });

      if (!existingImage) {
        const productImage = productImageRepository.create(imageInfo);
        await productImageRepository.save(productImage);
        console.log(`✓ Added image: ${imageInfo.alt_text}`);
      } else {
        console.log(`- Image already exists: ${imageInfo.alt_text}`);
      }
    }

    console.log("✅ Product images added successfully!");
  } catch (error) {
    console.error("❌ Error adding product images:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

// Run the function
addProductImages();
