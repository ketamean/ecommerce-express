import 'reflect-metadata';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from '@/entities/user.entity';
import { Category } from '@/entities/category.entity';
import { Product } from '@/entities/product.entity';
import { ProductImage } from '@/entities/product-image.entity';
import { Cart } from '@/entities/cart.entity';
import { CartDetail } from '@/entities/cart-detail.entity';
import { Order } from '@/entities/order.entity';
import { OrderDetail } from '@/entities/order-detail.entity';

dotenv.config();  // Load environment variables from .env file 

const db_url = process.env.DB_URL || ''
const is_dev = process.env.NODE_ENV === 'development' || false;

console.log(`Database URL: ${db_url}`);

const AppDataSource = new DataSource({
  type: 'postgres',
  url: db_url,
  synchronize: is_dev, // DEV only: automatically creates the database schema on every application launch
  logging: true,
  entities: [
    User,
    Category,
    Product,
    ProductImage,
    Cart,
    CartDetail,
    Order,
    OrderDetail,
  ],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;