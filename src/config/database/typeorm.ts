import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '@database/entities/user.entity';
import { Category } from '@database/entities/category.entity';
import { Product } from '@database/entities/product.entity';
import { ProductImage } from '@database/entities/product-image.entity';
import { Cart } from '@database/entities/cart.entity';
import { CartDetail } from '@database/entities/cart-detail.entity';
import { Order } from '@database/entities/order.entity';
import { OrderDetail } from '@database/entities/order-detail.entity';

const db_host = process.env.DB_HOST || 'localhost';
const db_port = process.env.DB_PORT || 5432;
const db_username = process.env.DB_USERNAME || 'postgres';
const db_password = process.env.DB_PASSWORD || '';
const db_name = process.env.DB_NAME || 'ecommerce_db';
const db_url = process.env.DB_URL || `postgres://postgres:${db_password}/${db_host}:/${db_name}`;
const is_dev = process.env.NODE_ENV === 'development';

const AppDataSource = new DataSource({
  type: 'postgres',
  url: db_url,
  port: Number(db_port),
  username: db_username,
  password: db_password,
  database: db_name,
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