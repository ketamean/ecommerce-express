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
// import fs from 'fs';
// import path from 'path';

dotenv.config();  // Load environment variables from .env file 

// const db_url = process.env.DB_URL || ''
// const rdsCa = fs.readFileSync(path.join(__dirname, '../../rds-ca-2019-root.pem'), 'utf-8');

const db_host = process.env.DB_HOST || 'localhost';
const db_port = process.env.DB_PORT || 3306;
const db_username = process.env.DB_USERNAME || 'admin';
const db_password = process.env.DB_PASSWORD || 'password';
const is_dev = process.env.NODE_ENV === 'development' || false;

const AppDataSource = new DataSource({
  type: 'mysql',
  // url: 'postgresql://postgres.adyeqkylwndvuuqwltha:mz1uAudlT1Rz75t8@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
  host: db_host,
  port: Number(db_port),
  username: db_username,
  password: db_password,
  database: process.env.DB_NAME || 'ecommerce',
  synchronize: false,//is_dev, // DEV only: automatically creates the database schema on every application launch
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
  // ssl: {
  //   ca: rdsCa,
  //   rejectUnauthorized: true
  // }
});
export default AppDataSource;