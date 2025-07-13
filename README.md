# E-commerce Express API

A comprehensive e-commerce backend API built with Node.js, Express, TypeScript, GraphQL, and PostgreSQL.

## Features

- **User Management**: Registration, login, profile management, password changes
- **Product Management**: CRUD operations for products with pagination and search
- **Category Management**: Full CRUD operations for product categories (admin-only)
- **Search & Filtering**: Advanced search with category filtering for products
- **Authentication & Authorization**: JWT-based authentication with refresh tokens and role-based access
- **GraphQL API**: Modern GraphQL endpoint for efficient data fetching
- **Database**: PostgreSQL with TypeORM for data persistence
- **Redis**: Caching and token blacklisting
- **Security**: Password hashing with salt and pepper, helmet for security headers

## Technology Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with TypeORM
- **Cache**: Redis
- **API**: GraphQL with Type-GraphQL
- **Authentication**: JWT tokens
- **Security**: bcrypt, helmet, CORS

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- Redis
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd ecommerce-express
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your database and security configurations
```

4. Set up the database

```bash
# Create your PostgreSQL database
# Run the SQL script in src/config/database/creation.sql
```

5. Start the development server

```bash
npm run dev
```

6. (Optional) Seed sample categories and products

```bash
npm run seed:categories
```

## API Documentation

### GraphQL Endpoint

The GraphQL playground is available at: `http://localhost:3000/api`

### User Management

#### Register User

```graphql
mutation Register($data: RegisterInput!) {
  register(data: $data) {
    user {
      id
      user_id
      email
      name
      is_admin
      created_at
      updated_at
    }
    accessToken
    refreshToken
  }
}
```

Variables:

```json
{
  "data": {
    "email": "user@example.com",
    "password": "securepassword123",
    "name": "John Doe"
  }
}
```

#### Login User

```graphql
mutation Login($data: LoginInput!) {
  login(data: $data) {
    user {
      id
      user_id
      email
      name
      is_admin
      created_at
      updated_at
    }
    accessToken
    refreshToken
  }
}
```

Variables:

```json
{
  "data": {
    "email": "user@example.com",
    "password": "securepassword123"
  }
}
```

#### Get Current User Profile

```graphql
query Me {
  me {
    id
    user_id
    email
    name
    is_admin
    created_at
    updated_at
  }
}
```

Headers:

```json
{
  "Authorization": "Bearer <your-access-token>"
}
```

#### Update Profile

```graphql
mutation UpdateProfile($data: UpdateProfileInput!) {
  updateProfile(data: $data) {
    id
    user_id
    email
    name
    is_admin
    created_at
    updated_at
  }
}
```

Variables:

```json
{
  "data": {
    "name": "John Smith",
    "email": "johnsmith@example.com"
  }
}
```

#### Change Password

```graphql
mutation ChangePassword($data: ChangePasswordInput!) {
  changePassword(data: $data)
}
```

Variables:

```json
{
  "data": {
    "currentPassword": "oldpassword123",
    "newPassword": "newpassword123"
  }
}
```

#### Delete Account

```graphql
mutation DeleteAccount {
  deleteAccount
}
```

### Product Management

#### Get Products (with pagination)

```graphql
query Products($page: Int, $limit: Int) {
  products(page: $page, limit: $limit) {
    id
    product_id
    name
    description
    price
    inventory_count
    category {
      id
      name
      description
    }
    created_at
    updated_at
  }
}
```

#### Get Single Product

```graphql
query Product($id: Int!) {
  product(id: $id) {
    id
    product_id
    name
    description
    price
    inventory_count
    category {
      id
      name
      description
    }
    created_at
    updated_at
  }
}
```

#### Create Product

```graphql
mutation CreateProduct($data: ProductInput!) {
  createProduct(data: $data) {
    id
    product_id
    name
    description
    price
    inventory_count
    created_at
    updated_at
  }
}
```

Variables:

```json
{
  "data": {
    "name": "Awesome Product",
    "description": "This is an awesome product",
    "price": 29.99,
    "inventory_count": 100,
    "categoryId": 1
  }
}
```

### Category Management

The API provides comprehensive category management with admin protection. See [CATEGORY_API.md](./CATEGORY_API.md) for detailed documentation.

#### Public Category Operations

- Get all categories with pagination
- Get category by ID or name
- Search categories by name/description
- Get products by category
- Search products with category filtering

#### Admin-Only Category Operations

- Create new categories
- Update existing categories
- Delete categories (with protection for categories that have products)

#### Example: Get All Categories

```graphql
query GetCategories {
  categories(page: 1, limit: 10) {
    id
    name
    description
    created_at
    updated_at
  }
}
```

#### Example: Create Category (Admin Only)

```graphql
mutation CreateCategory($data: CategoryInput!) {
  createCategory(data: $data) {
    id
    name
    description
    created_at
    updated_at
  }
}
```

Variables:

```json
{
  "data": {
    "name": "Electronics",
    "description": "Electronic devices and gadgets"
  }
}
```

Headers:

```json
{
  "Authorization": "Bearer <admin_access_token>"
}
```

### Product Search with Categories

#### Search Products by Category

```graphql
query SearchProducts($searchTerm: String!, $categoryId: Int) {
  searchProducts(
    searchTerm: $searchTerm
    page: 1
    limit: 10
    categoryId: $categoryId
  ) {
    id
    name
    description
    price
    category {
      id
      name
    }
  }
}
```

Variables:

```json
{
  "searchTerm": "smartphone",
  "categoryId": 1
}
```

#### Authentication

#### Refresh Token (REST Endpoint)

```bash
POST /auth/refresh-token
Content-Type: application/json

{
  "token": "<your-refresh-token>"
}
```

Response:

```json
{
  "accessToken": "<new-access-token>",
  "refreshToken": "<new-refresh-token>"
}
```

## Environment Variables

```env
# Database Configuration
DB_URL=postgresql://username:password@localhost:5432/ecommerce_db
NODE_ENV=development

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
REFRESH_TOKEN_SECRET=your-super-secret-refresh-key-change-this-in-production

# Password Hashing
PASSWORD_HASHING_SALT=10
PASSWORD_HASHING_PEPPER=your-secret-pepper-change-this-in-production

# Server Configuration
PORT=3000
```

## Database Schema

The application uses the following main entities:

- **User**: User accounts with authentication
- **Category**: Product categories
- **Product**: Products with pricing and inventory
- **Cart**: Shopping carts for users
- **CartDetail**: Individual items in carts
- **Order**: Customer orders
- **OrderDetail**: Individual items in orders
- **ProductImage**: Product images

## Security Features

1. **Password Security**: Passwords are hashed using bcrypt with salt and pepper
2. **JWT Authentication**: Secure token-based authentication
3. **Refresh Token Rotation**: RTR (Refresh Token Rotation) for enhanced security
4. **Token Blacklisting**: Invalidated refresh tokens are blacklisted in Redis
5. **CORS Protection**: Cross-origin request protection
6. **Helmet**: Security headers for HTTP requests

## Development

### Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run start`: Start production server
- `npm run build`: Build TypeScript to JavaScript

### Project Structure

```
src/
├── config/           # Configuration files
│   ├── database/     # Database configuration
│   └── graphql.ts    # GraphQL server setup
├── core/             # Core business logic
│   ├── modules/      # Feature modules
│   │   ├── user/     # User management
│   │   └── product/  # Product management
│   └── repositories/ # Data access layer
├── entities/         # TypeORM entities
├── middlewares/      # Express middlewares
├── routes/           # REST routes
├── utils/            # Utility functions
├── index.ts          # Application entry point
└── server.ts         # Express server setup
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
