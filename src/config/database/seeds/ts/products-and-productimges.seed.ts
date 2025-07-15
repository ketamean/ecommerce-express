import "reflect-metadata";
import AppDataSource from "@config/database/typeorm";
import { Category } from "@entities/category.entity";
import { Product } from "@entities/product.entity";
import { ProductImage } from "@entities/product-image.entity";

const products = [
  {
    "description": "A powerful 5-quart stand mixer for all your baking needs.",
    "price": 299.99,
    "inventory_count": 150,
    "categoryId": 120,
    "name": "Stand Mixer"
  },
  {
    "description": "A pre-seasoned 12-inch cast iron skillet for superior searing.",
    "price": 39.95,
    "inventory_count": 500,
    "categoryId": 120,
    "name": "Cast Iron Skillet"
  },
  {
    "description": "Semi-automatic espresso machine with a built-in grinder.",
    "price": 599.00,
    "inventory_count": 100,
    "categoryId": 120,
    "name": "Espresso Machine"
  },
  {
    "description": "A 5.8-quart air fryer for crispy food with less oil.",
    "price": 99.99,
    "inventory_count": 400,
    "categoryId": 120,
    "name": "Air Fryer"
  },
  {
    "description": "A high-carbon stainless steel 8-inch chef's knife.",
    "price": 75.00,
    "inventory_count": 600,
    "categoryId": 120,
    "name": "Chef's Knife"
  },
  {
    "description": "High-speed blender for smoothies, soups, and more.",
    "price": 129.00,
    "inventory_count": 300,
    "categoryId": 120,
    "name": "Blender"
  },
  {
    "description": "A 10-piece set of non-stick pots and pans.",
    "price": 149.99,
    "inventory_count": 250,
    "categoryId": 120,
    "name": "Non-Stick Cookware Set"
  },
  {
    "description": "A smart robot vacuum with mapping technology.",
    "price": 349.00,
    "inventory_count": 180,
    "categoryId": 120,
    "name": "Robot Vacuum"
  },
  {
    "description": "A 1.7-liter stainless steel electric kettle with temperature control.",
    "price": 59.99,
    "inventory_count": 700,
    "categoryId": 120,
    "name": "Electric Kettle"
  },
  {
    "description": "A 12-cup programmable drip coffee maker.",
    "price": 49.99,
    "inventory_count": 800,
    "categoryId": 120,
    "name": "Coffee Maker"
  },
  {
    "description": "A 10-cup food processor for chopping, shredding, and pureeing.",
    "price": 89.00,
    "inventory_count": 350,
    "categoryId": 120,
    "name": "Food Processor"
  },
  {
    "description": "A convection toaster oven that can also bake and broil.",
    "price": 119.99,
    "inventory_count": 280,
    "categoryId": 120,
    "name": "Toaster Oven"
  },
  {
    "description": "A digital kitchen scale for precise measurements.",
    "price": 19.99,
    "inventory_count": 1000,
    "categoryId": 120,
    "name": "Kitchen Scale"
  },
  {
    "description": "A 4-piece queen-size microfiber bed sheet set.",
    "price": 35.00,
    "inventory_count": 1200,
    "categoryId": 120,
    "name": "Bed Sheet Set"
  },
  {
    "description": "A 6-piece set of plush and absorbent cotton bath towels.",
    "price": 45.00,
    "inventory_count": 1500,
    "categoryId": 120,
    "name": "Bath Towel Set"
  },
  {
    "description": "A HEPA air purifier for removing allergens and pollutants.",
    "price": 129.99,
    "inventory_count": 220,
    "categoryId": 120,
    "name": "Air Purifier"
  },
  {
    "description": "A 6-quart programmable slow cooker.",
    "price": 59.00,
    "inventory_count": 450,
    "categoryId": 120,
    "name": "Slow Cooker"
  },
  {
    "description": "A 15-piece knife set with a wooden storage block.",
    "price": 99.99,
    "inventory_count": 300,
    "categoryId": 120,
    "name": "Knife Block Set"
  },
  {
    "description": "A 16-piece ceramic dinnerware set for four people.",
    "price": 79.99,
    "inventory_count": 400,
    "categoryId": 120,
    "name": "Dinnerware Set"
  },
  {
    "description": "A 1.1 cubic foot countertop microwave oven.",
    "price": 95.00,
    "inventory_count": 320,
    "categoryId": 120,
    "name": "Microwave Oven"
  },
  {
    "description": "A lightweight, waterproof dome tent for backpacking.",
    "price": 89.99,
    "inventory_count": 300,
    "categoryId": 121,
    "name": "2-Person Camping Tent"
  },
  {
    "description": "An extra-thick, non-slip yoga mat with a carrying strap.",
    "price": 29.99,
    "inventory_count": 1000,
    "categoryId": 121,
    "name": "Yoga Mat"
  },
  {
    "description": "A pair of adjustable dumbbells, from 5 to 52.5 lbs.",
    "price": 399.00,
    "inventory_count": 150,
    "categoryId": 121,
    "name": "Adjustable Dumbbells"
  },
  {
    "description": "A 32 oz stainless steel water bottle that keeps drinks cold for 24 hours.",
    "price": 35.00,
    "inventory_count": 1200,
    "categoryId": 121,
    "name": "Insulated Water Bottle"
  },
  {
    "description": "A 21-speed hardtail mountain bike with front suspension.",
    "price": 450.00,
    "inventory_count": 200,
    "categoryId": 121,
    "name": "Mountain Bike"
  },
  {
    "description": "A 25-liter backpack for hiking and daily use.",
    "price": 65.00,
    "inventory_count": 700,
    "categoryId": 121,
    "name": "Daypack Backpack"
  },
  {
    "description": "A 3-season sleeping bag rated for temperatures down to 20°F.",
    "price": 99.99,
    "inventory_count": 400,
    "categoryId": 121,
    "name": "Sleeping Bag"
  },
  {
    "description": "A versatile spinning combo for freshwater fishing.",
    "price": 75.00,
    "inventory_count": 500,
    "categoryId": 121,
    "name": "Fishing Rod and Reel Combo"
  },
  {
    "description": "Official size and weight basketball for indoor/outdoor play.",
    "price": 24.99,
    "inventory_count": 1500,
    "categoryId": 121,
    "name": "Basketball"
  },
  {
    "description": "A pair of adjustable, lightweight aluminum trekking poles.",
    "price": 39.99,
    "inventory_count": 600,
    "categoryId": 121,
    "name": "Trekking Poles"
  },
  {
    "description": "A 50-quart hard cooler with excellent ice retention.",
    "price": 199.99,
    "inventory_count": 250,
    "categoryId": 121,
    "name": "Cooler"
  },
  {
    "description": "A high-speed jump rope with adjustable length for cardio workouts.",
    "price": 15.00,
    "inventory_count": 2000,
    "categoryId": 121,
    "name": "Jump Rope"
  },
  {
    "description": "A durable size 5 soccer ball for training and matches.",
    "price": 22.00,
    "inventory_count": 1800,
    "categoryId": 121,
    "name": "Soccer Ball"
  },
  {
    "description": "A foldable and portable camping chair with a cup holder.",
    "price": 30.00,
    "inventory_count": 900,
    "categoryId": 121,
    "name": "Camping Chair"
  },
  {
    "description": "A bright LED headlamp for hiking, camping, and running.",
    "price": 19.99,
    "inventory_count": 1100,
    "categoryId": 121,
    "name": "Headlamp"
  },
  {
    "description": "A 1-person inflatable kayak set with paddle and pump.",
    "price": 150.00,
    "inventory_count": 180,
    "categoryId": 121,
    "name": "Inflatable Kayak"
  },
  {
    "description": "A set of 5 resistance loop bands for strength training.",
    "price": 18.00,
    "inventory_count": 2500,
    "categoryId": 121,
    "name": "Resistance Bands Set"
  },
  {
    "description": "A set of 2 pickleball paddles and 4 balls.",
    "price": 69.99,
    "inventory_count": 450,
    "categoryId": 121,
    "name": "Pickleball Paddle Set"
  },
  {
    "description": "10x42 waterproof binoculars for bird watching and hiking.",
    "price": 120.00,
    "inventory_count": 350,
    "categoryId": 121,
    "name": "Binoculars"
  },
  {
    "description": "A compact single-burner propane stove.",
    "price": 45.00,
    "inventory_count": 550,
    "categoryId": 121,
    "name": "Portable Camping Stove"
  },
  {
    "description": "A 65-inch television with vibrant colors and smart features.",
    "price": 1499.99,
    "inventory_count": 50,
    "categoryId": 117,
    "name": "4K OLED Smart TV"
  },
  {
    "description": "Over-ear headphones with superior sound quality and noise cancellation.",
    "price": 349.99,
    "inventory_count": 150,
    "categoryId": 117,
    "name": "Wireless Noise-Cancelling Headphones"
  },
  {
    "description": "The latest smartphone with a powerful processor and pro-grade camera system.",
    "price": 999.99,
    "inventory_count": 200,
    "categoryId": 117,
    "name": "Flagship Smartphone"
  },
  {
    "description": "15-inch gaming laptop with a high-refresh-rate display and a top-tier GPU.",
    "price": 1799.00,
    "inventory_count": 75,
    "categoryId": 117,
    "name": "Gaming Laptop"
  },
  {
    "description": "Track your fitness, take calls, and get notifications on your wrist.",
    "price": 399.00,
    "inventory_count": 300,
    "categoryId": 117,
    "name": "Smartwatch Series 8"
  },
  {
    "description": "Portable and waterproof speaker with rich bass.",
    "price": 129.50,
    "inventory_count": 400,
    "categoryId": 117,
    "name": "Bluetooth Speaker"
  },
  {
    "description": "Mirrorless camera with a 24MP sensor, perfect for enthusiasts.",
    "price": 899.99,
    "inventory_count": 100,
    "categoryId": 117,
    "name": "Digital Camera"
  },
  {
    "description": "Waterproof e-reader with a warm light and 32GB of storage.",
    "price": 249.99,
    "inventory_count": 250,
    "categoryId": 117,
    "name": "E-Reader Pro"
  },
  {
    "description": "A 10.9-inch tablet designed for creativity and productivity.",
    "price": 599.00,
    "inventory_count": 180,
    "categoryId": 117,
    "name": "Tablet with Stylus"
  },
  {
    "description": "27-inch 1440p monitor with a 144Hz refresh rate.",
    "price": 329.99,
    "inventory_count": 220,
    "categoryId": 117,
    "name": "Computer Monitor"
  },
  {
    "description": "RGB backlit mechanical keyboard with tactile switches.",
    "price": 119.99,
    "inventory_count": 300,
    "categoryId": 117,
    "name": "Mechanical Keyboard"
  },
  {
    "description": "Ergonomic wireless mouse with a high-precision sensor.",
    "price": 79.99,
    "inventory_count": 500,
    "categoryId": 117,
    "name": "Wireless Mouse"
  },
  {
    "description": "Full HD webcam for streaming and video conferencing.",
    "price": 69.99,
    "inventory_count": 350,
    "categoryId": 117,
    "name": "Webcam 1080p"
  },
  {
    "description": "A 5.1 channel soundbar with a wireless subwoofer.",
    "price": 299.00,
    "inventory_count": 120,
    "categoryId": 117,
    "name": "Soundbar System"
  },
  {
    "description": "Foldable drone with a 3-axis gimbal and 30-minute flight time.",
    "price": 799.00,
    "inventory_count": 90,
    "categoryId": 117,
    "name": "Drone with 4K Camera"
  },
  {
    "description": "Control all your smart home devices with this central hub.",
    "price": 99.00,
    "inventory_count": 400,
    "categoryId": 117,
    "name": "Smart Home Hub"
  },
  {
    "description": "Smart toothbrush with pressure sensors and multiple cleaning modes.",
    "price": 89.95,
    "inventory_count": 600,
    "categoryId": 117,
    "name": "Electric Toothbrush"
  },
  {
    "description": "Next-gen router for faster speeds and better coverage.",
    "price": 199.99,
    "inventory_count": 180,
    "categoryId": 117,
    "name": "Wi-Fi 6 Router"
  },
  {
    "description": "20,000mAh power bank to charge your devices on the go.",
    "price": 49.99,
    "inventory_count": 1000,
    "categoryId": 117,
    "name": "Portable Power Bank"
  },
  {
    "description": "All-in-one virtual reality headset for immersive gaming.",
    "price": 399.00,
    "inventory_count": 110,
    "categoryId": 117,
    "name": "VR Headset"
  },
  {
    "description": "A novel by Matt Haig about choices and regrets.",
    "price": 15.99,
    "inventory_count": 500,
    "categoryId": 118,
    "name": "The Midnight Library"
  },
  {
    "description": "Classic science fiction novel by Frank Herbert.",
    "price": 18.00,
    "inventory_count": 700,
    "categoryId": 118,
    "name": "Dune"
  },
  {
    "description": "A sci-fi novel by Andy Weir, author of The Martian.",
    "price": 22.50,
    "inventory_count": 450,
    "categoryId": 118,
    "name": "Project Hail Mary"
  },
  {
    "description": "An easy & proven way to build good habits & break bad ones by James Clear.",
    "price": 16.99,
    "inventory_count": 800,
    "categoryId": 118,
    "name": "Atomic Habits"
  },
  {
    "description": "J.R.R. Tolkien's epic high-fantasy novel.",
    "price": 25.00,
    "inventory_count": 600,
    "categoryId": 118,
    "name": "The Lord of the Rings"
  },
  {
    "description": "George Orwell's dystopian classic.",
    "price": 12.99,
    "inventory_count": 1000,
    "categoryId": 118,
    "name": "1984"
  },
  {
    "description": "A novel by Harper Lee set in the American South.",
    "price": 14.00,
    "inventory_count": 900,
    "categoryId": 118,
    "name": "To Kill a Mockingbird"
  },
  {
    "description": "Yuval Noah Harari explores the history of our species.",
    "price": 24.99,
    "inventory_count": 550,
    "categoryId": 118,
    "name": "Sapiens: A Brief History of Humankind"
  },
  {
    "description": "Timeless lessons on wealth, greed, and happiness by Morgan Housel.",
    "price": 19.99,
    "inventory_count": 750,
    "categoryId": 118,
    "name": "The Psychology of Money"
  },
  {
    "description": "A novel by Delia Owens about a young girl growing up alone in the marshes of North Carolina.",
    "price": 17.50,
    "inventory_count": 650,
    "categoryId": 118,
    "name": "Where the Crawdads Sing"
  },
  {
    "description": "A fantasy novel by J.R.R. Tolkien, a prelude to The Lord of the Rings.",
    "price": 13.99,
    "inventory_count": 700,
    "categoryId": 118,
    "name": "The Hobbit"
  },
  {
    "description": "F. Scott Fitzgerald's novel about the American Dream.",
    "price": 11.50,
    "inventory_count": 1200,
    "categoryId": 118,
    "name": "The Great Gatsby"
  },
  {
    "description": "Jane Austen's classic romance novel.",
    "price": 10.99,
    "inventory_count": 1100,
    "categoryId": 118,
    "name": "Pride and Prejudice"
  },
  {
    "description": "A philosophical book by Paulo Coelho.",
    "price": 15.00,
    "inventory_count": 850,
    "categoryId": 118,
    "name": "The Alchemist"
  },
  {
    "description": "A memoir by Tara Westover about her journey to education.",
    "price": 20.00,
    "inventory_count": 400,
    "categoryId": 118,
    "name": "Educated: A Memoir"
  },
  {
    "description": "The memoir of former First Lady of the United States Michelle Obama.",
    "price": 23.00,
    "inventory_count": 500,
    "categoryId": 118,
    "name": "Becoming"
  },
  {
    "description": "The first book in George R.R. Martin's A Song of Ice and Fire series.",
    "price": 21.99,
    "inventory_count": 680,
    "categoryId": 118,
    "name": "A Game of Thrones"
  },
  {
    "description": "Ray Bradbury's dystopian novel about a future where books are outlawed.",
    "price": 14.50,
    "inventory_count": 950,
    "categoryId": 118,
    "name": "Fahrenheit 451"
  },
  {
    "description": "A novel by J. D. Salinger.",
    "price": 13.00,
    "inventory_count": 780,
    "categoryId": 118,
    "name": "The Catcher in the Rye"
  },
  {
    "description": "A psychological thriller by Alex Michaelides.",
    "price": 16.50,
    "inventory_count": 520,
    "categoryId": 118,
    "name": "The Silent Patient"
  },
  {
    "description": "A soft, comfortable, and durable 100% cotton t-shirt.",
    "price": 19.99,
    "inventory_count": 1500,
    "categoryId": 119,
    "name": "Classic Cotton T-Shirt"
  },
  {
    "description": "Modern slim-fit jeans made with stretch denim for comfort.",
    "price": 59.99,
    "inventory_count": 800,
    "categoryId": 119,
    "name": "Slim-Fit Jeans"
  },
  {
    "description": "A cozy fleece-lined hoodie perfect for cool weather.",
    "price": 45.00,
    "inventory_count": 1000,
    "categoryId": 119,
    "name": "Hooded Sweatshirt"
  },
  {
    "description": "Lightweight and breathable running shoes with excellent cushioning.",
    "price": 120.00,
    "inventory_count": 600,
    "categoryId": 119,
    "name": "Running Shoes"
  },
  {
    "description": "A timeless biker-style jacket made from genuine leather.",
    "price": 299.99,
    "inventory_count": 200,
    "categoryId": 119,
    "name": "Leather Jacket"
  },
  {
    "description": "Versatile and stylish chino pants for casual or semi-formal wear.",
    "price": 49.50,
    "inventory_count": 900,
    "categoryId": 119,
    "name": "Chino Pants"
  },
  {
    "description": "A classic polo shirt made from breathable pique cotton.",
    "price": 35.00,
    "inventory_count": 1200,
    "categoryId": 119,
    "name": "Polo Shirt"
  },
  {
    "description": "A soft and warm scarf made from 100% merino wool.",
    "price": 29.99,
    "inventory_count": 700,
    "categoryId": 119,
    "name": "Wool Scarf"
  },
  {
    "description": "A rugged and stylish denim jacket that pairs with anything.",
    "price": 79.00,
    "inventory_count": 500,
    "categoryId": 119,
    "name": "Denim Jacket"
  },
  {
    "description": "A light and airy sundress perfect for warm days.",
    "price": 55.00,
    "inventory_count": 650,
    "categoryId": 119,
    "name": "Summer Dress"
  },
  {
    "description": "Waterproof and sturdy hiking boots for all terrains.",
    "price": 150.00,
    "inventory_count": 400,
    "categoryId": 119,
    "name": "Hiking Boots"
  },
  {
    "description": "A tailored blazer for business or formal events.",
    "price": 180.00,
    "inventory_count": 250,
    "categoryId": 119,
    "name": "Formal Blazer"
  },
  {
    "description": "Comfortable and durable ankle socks for everyday use.",
    "price": 15.99,
    "inventory_count": 2000,
    "categoryId": 119,
    "name": "Ankle Socks (6-Pack)"
  },
  {
    "description": "A high-quality leather belt with a classic metal buckle.",
    "price": 39.99,
    "inventory_count": 800,
    "categoryId": 119,
    "name": "Leather Belt"
  },
  {
    "description": "Quick-drying swim trunks with a comfortable mesh lining.",
    "price": 25.00,
    "inventory_count": 1000,
    "categoryId": 119,
    "name": "Swim Trunks"
  },
  {
    "description": "A warm, insulated coat designed for cold climates.",
    "price": 199.99,
    "inventory_count": 300,
    "categoryId": 119,
    "name": "Winter Coat"
  },
  {
    "description": "High-waisted, flexible yoga pants for workouts or lounging.",
    "price": 49.99,
    "inventory_count": 900,
    "categoryId": 119,
    "name": "Yoga Pants"
  },
  {
    "description": "A classic canvas baseball cap with an adjustable strap.",
    "price": 22.00,
    "inventory_count": 1500,
    "categoryId": 119,
    "name": "Baseball Cap"
  },
  {
    "description": "A soft, brushed flannel shirt for a rustic look.",
    "price": 48.00,
    "inventory_count": 750,
    "categoryId": 119,
    "name": "Flannel Shirt"
  },
  {
    "description": "Elegant leather dress shoes for formal occasions.",
    "price": 130.00,
    "inventory_count": 350,
    "categoryId": 119,
    "name": "Dress Shoes"
  }
]

export default async function seedProducts() {
  const categoryRepository = AppDataSource.getRepository(Category);
  const productRepository = AppDataSource.getRepository(Product);
  const productImageRepository = AppDataSource.getRepository(ProductImage);

  products.forEach(async (product: any) => {
    const category = await categoryRepository.findOneBy({
      id: product.categoryId,
    });

    if (!category) {
      console.error(`Category with ID ${product.categoryId} not found.`);
      return;
    }

    const newProduct = productRepository.create({
      ...product,
      category,
    });

    await productRepository.save(newProduct);

    await productImageRepository.save(
      productImageRepository.create({
        is_thumbnail: true,
        image_url: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-169994-674010.jpg&fm=jpg",
        alt_text: "pic",
        product: newProduct[0],
      })
    )
  })
}