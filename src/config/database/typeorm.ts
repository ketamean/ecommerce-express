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
import { Signer } from '@aws-sdk/rds-signer';

dotenv.config();  // Load environment variables from .env file 

// const db_url = process.env.DB_URL || ''
const db_host = process.env.DB_HOST || 'localhost';
const db_port = process.env.DB_PORT || 3306;
const db_username = process.env.DB_USERNAME || 'admin';
const db_password = process.env.DB_PASSWORD || 'password';
const db_name = process.env.DB_NAME || 'ecommerce';
const is_dev = process.env.NODE_ENV === 'development' || false;

// --- Configuration ---
// It's best to load these from environment variables
const dbConfig = {
  host: db_host,         // Your RDS Proxy endpoint
  port: Number(db_port), // e.g., 3306
  username: db_username, // The DB user (e.g., 'iam_user')
  database: db_name,     // Your database name
  region: "us-east-1",   // e.g., 'us-east-1'
};

// --- Token Generation Logic ---
const getDbPassword = (): Promise<string> => {
  if (!dbConfig.host || !dbConfig.port || !dbConfig.username || !dbConfig.region) {
    throw new Error('Missing database configuration in environment variables.');
  }

  // This signer will use the IAM role of the EC2 instance automatically
  const signer = new Signer({
    hostname: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    region: dbConfig.region,
  });

  return signer.getAuthToken();
};

const AppDataSource = (async () => {
  const password = await getDbPassword();
  const dataSource = new DataSource({
    type: 'mysql',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    database: dbConfig.database,
    password: password, // Get the password using the signer
    synchronize: true,//is_dev, // DEV only: automatically creates the database schema on every application launch
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
    ssl: {
      rejectUnauthorized: true, // Disable SSL verification for development
    }
  });

  await dataSource.initialize()

  return dataSource;
})();

export default AppDataSource;
export { getDbPassword };