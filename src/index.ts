import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { app } from './server';
import { User } from './database/entities/user.entity'//'./database/entities/user.entity';
import { Category } from './database/entities/category.entity';
import { Product } from './database/entities/product.entity';
import { ProductImage } from './database/entities/product-image.entity';
import { Cart } from './database/entities/cart.entity';
import { CartDetail } from './database/entities/cart-detail.entity';
import { Order } from './database/entities/order.entity';
import { OrderDetail } from './database/entities/order-detail.entity';

const db_host = process.env.DB_HOST || 'localhost';
const db_port = process.env.DB_PORT || 5432;
const db_username = process.env.DB_USERNAME || 'postgres';
const db_password = process.env.DB_PASSWORD || '';
const db_name = process.env.DB_NAME || 'ecommerce_db';
const db_url = process.env.DB_URL || `postgres://postgres:${db_password}/${db_host}:/${db_name}`;

const AppDataSource = new DataSource({
  type: 'postgres',
  url: db_url,
  port: Number(db_port),
  username: db_username,
  password: db_password, // Replace with your password
  database: db_name,
  synchronize: true, // DEV only: automatically creates the database schema on every application launch
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

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });