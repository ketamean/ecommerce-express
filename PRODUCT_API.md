# Product Management API

## Overview

The Product Management API provides comprehensive functionality for managing products in the e-commerce system. It includes operations for creating, reading, updating, and deleting products, as well as advanced features like search, category filtering, and pagination.

## Data Types

### Product Type

```typescript
type Product {
  id: ID!
  product_id: String!
  name: String!
  description: String
  price: Float!
  inventory_count: Int!
  category: CategoryType
  images: [ProductImageType!]!
  created_at: DateTime!
  updated_at: DateTime!
}
```

### ProductInput Type

```typescript
input ProductInput {
  name: String!
  description: String
  price: Float!
  inventory_count: Int!
  categoryId: Int
}
```

### ProductImageType

```typescript
type ProductImageType {
  id: ID!
  image_url: String!
  alt_text: String
  is_thumbnail: Boolean!
  created_at: DateTime!
}
```

## GraphQL Queries

### Get All Products

Retrieve a paginated list of all products.

```graphql
query GetProducts($page: Int, $limit: Int) {
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
    images {
      id
      image_url
      alt_text
      is_thumbnail
    }
    created_at
    updated_at
  }
}
```

**Variables:**

```json
{
  "page": 1,
  "limit": 10
}
```

**Response:**

```json
{
  "data": {
    "products": [
      {
        "id": "1",
        "product_id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "Smartphone XYZ",
        "description": "Latest smartphone with advanced features",
        "price": 599.99,
        "inventory_count": 50,
        "category": {
          "id": "1",
          "name": "Electronics",
          "description": "Electronic devices and gadgets"
        },
        "images": [
          {
            "id": "1",
            "image_url": "https://example.com/phone1.jpg",
            "alt_text": "Smartphone front view",
            "is_thumbnail": true
          }
        ],
        "created_at": "2025-01-15T10:00:00Z",
        "updated_at": "2025-01-15T10:00:00Z"
      }
    ]
  }
}
```

### Get Product by ID

Retrieve a specific product by its ID.

```graphql
query GetProduct($id: Int!) {
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
    images {
      id
      image_url
      alt_text
      is_thumbnail
    }
    created_at
    updated_at
  }
}
```

**Variables:**

```json
{
  "id": 1
}
```

**Response:**

```json
{
  "data": {
    "product": {
      "id": "1",
      "product_id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Smartphone XYZ",
      "description": "Latest smartphone with advanced features",
      "price": 599.99,
      "inventory_count": 50,
      "category": {
        "id": "1",
        "name": "Electronics",
        "description": "Electronic devices and gadgets"
      },
      "images": [
        {
          "id": "1",
          "image_url": "https://example.com/phone1.jpg",
          "alt_text": "Smartphone front view",
          "is_thumbnail": true
        }
      ],
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-01-15T10:00:00Z"
    }
  }
}
```

### Get Products by Category

Retrieve products filtered by category with pagination.

```graphql
query GetProductsByCategory($categoryId: Int!, $page: Int, $limit: Int) {
  productsByCategory(categoryId: $categoryId, page: $page, limit: $limit) {
    id
    product_id
    name
    description
    price
    inventory_count
    category {
      id
      name
    }
    images {
      id
      image_url
      alt_text
      is_thumbnail
    }
    created_at
    updated_at
  }
}
```

**Variables:**

```json
{
  "categoryId": 1,
  "page": 1,
  "limit": 10
}
```

### Search Products

Search products by name or description with optional category filtering.

```graphql
query SearchProducts(
  $searchTerm: String!
  $page: Int
  $limit: Int
  $categoryId: Int
) {
  searchProducts(
    searchTerm: $searchTerm
    page: $page
    limit: $limit
    categoryId: $categoryId
  ) {
    id
    product_id
    name
    description
    price
    inventory_count
    category {
      id
      name
    }
    images {
      id
      image_url
      alt_text
      is_thumbnail
    }
    created_at
    updated_at
  }
}
```

**Variables:**

```json
{
  "searchTerm": "smartphone",
  "page": 1,
  "limit": 10,
  "categoryId": 1
}
```

**Response:**

```json
{
  "data": {
    "searchProducts": [
      {
        "id": "1",
        "product_id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "Smartphone XYZ",
        "description": "Latest smartphone with advanced features",
        "price": 599.99,
        "inventory_count": 50,
        "category": {
          "id": "1",
          "name": "Electronics"
        },
        "images": [
          {
            "id": "1",
            "image_url": "https://example.com/phone1.jpg",
            "alt_text": "Smartphone front view",
            "is_thumbnail": true
          }
        ],
        "created_at": "2025-01-15T10:00:00Z",
        "updated_at": "2025-01-15T10:00:00Z"
      }
    ]
  }
}
```

## GraphQL Mutations

### Create Product

Create a new product in the system.

```graphql
mutation CreateProduct($data: ProductInput!) {
  createProduct(data: $data) {
    id
    product_id
    name
    description
    price
    inventory_count
    category {
      id
      name
    }
    images {
      id
      image_url
      alt_text
      is_thumbnail
    }
    created_at
    updated_at
  }
}
```

**Variables:**

```json
{
  "data": {
    "name": "Wireless Headphones",
    "description": "High-quality wireless headphones with noise cancellation",
    "price": 199.99,
    "inventory_count": 100,
    "categoryId": 1
  }
}
```

**Response:**

```json
{
  "data": {
    "createProduct": {
      "id": "2",
      "product_id": "987fcdeb-51a2-43d7-8f9e-123456789abc",
      "name": "Wireless Headphones",
      "description": "High-quality wireless headphones with noise cancellation",
      "price": 199.99,
      "inventory_count": 100,
      "category": {
        "id": "1",
        "name": "Electronics"
      },
      "images": [],
      "created_at": "2025-01-15T11:00:00Z",
      "updated_at": "2025-01-15T11:00:00Z"
    }
  }
}
```

### Update Product

Update an existing product.

```graphql
mutation UpdateProduct($id: Int!, $data: ProductInput!) {
  updateProduct(id: $id, data: $data) {
    id
    product_id
    name
    description
    price
    inventory_count
    category {
      id
      name
    }
    images {
      id
      image_url
      alt_text
      is_thumbnail
    }
    created_at
    updated_at
  }
}
```

**Variables:**

```json
{
  "id": 1,
  "data": {
    "name": "Smartphone XYZ Pro",
    "description": "Updated smartphone with enhanced features",
    "price": 699.99,
    "inventory_count": 45,
    "categoryId": 1
  }
}
```

**Response:**

```json
{
  "data": {
    "updateProduct": {
      "id": "1",
      "product_id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Smartphone XYZ Pro",
      "description": "Updated smartphone with enhanced features",
      "price": 699.99,
      "inventory_count": 45,
      "category": {
        "id": "1",
        "name": "Electronics"
      },
      "images": [
        {
          "id": "1",
          "image_url": "https://example.com/phone1.jpg",
          "alt_text": "Smartphone front view",
          "is_thumbnail": true
        }
      ],
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-01-15T12:00:00Z"
    }
  }
}
```

### Delete Product

Delete a product from the system.

```graphql
mutation DeleteProduct($id: Int!) {
  deleteProduct(id: $id)
}
```

**Variables:**

```json
{
  "id": 1
}
```

**Response:**

```json
{
  "data": {
    "deleteProduct": true
  }
}
```

## Error Responses

### Product Not Found

```json
{
  "errors": [
    {
      "message": "Product not found",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": ["product"]
    }
  ],
  "data": {
    "product": null
  }
}
```

### Validation Error

```json
{
  "errors": [
    {
      "message": "Argument Validation Error",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": ["createProduct"],
      "extensions": {
        "code": "ARGUMENT_VALIDATION_ERROR",
        "validationErrors": [
          {
            "field": "name",
            "message": "name should not be empty"
          },
          {
            "field": "price",
            "message": "price must be a positive number"
          }
        ]
      }
    }
  ]
}
```

## Query Parameters

### Pagination

- **page**: Page number (default: 1)
- **limit**: Number of items per page (default: 10)

### Search

- **searchTerm**: Text to search in product name and description
- **categoryId**: Optional category filter for search results

## Field Descriptions

### Product Fields

- **id**: Unique identifier for the product (auto-generated)
- **product_id**: UUID string identifier for the product (auto-generated)
- **name**: Product name (required)
- **description**: Detailed description of the product (optional)
- **price**: Product price in decimal format (required)
- **inventory_count**: Available quantity in stock (required)
- **category**: Associated category object (optional)
- **images**: Array of product images (always returns array, can be empty)
- **created_at**: Timestamp when the product was created
- **updated_at**: Timestamp when the product was last updated

### ProductInput Fields

- **name**: Product name (required, string)
- **description**: Product description (optional, string)
- **price**: Product price (required, positive float)
- **inventory_count**: Stock quantity (required, non-negative integer)
- **categoryId**: ID of the category to associate with the product (optional, integer)

## Business Rules

1. **Product Names**: Must be unique within the system
2. **Pricing**: Must be positive values with up to 2 decimal places
3. **Inventory**: Cannot be negative
4. **Categories**: Products can exist without a category, but if categoryId is provided, the category must exist
5. **Images**: Products can have multiple images, with one marked as thumbnail
6. **Deletion**: Deleting a product will also delete all associated images and cart/order references

## Usage Examples

### Complete Product Management Workflow

```graphql
# 1. Create a new product
mutation {
  createProduct(
    data: {
      name: "Gaming Laptop"
      description: "High-performance gaming laptop with RTX graphics"
      price: 1299.99
      inventory_count: 25
      categoryId: 2
    }
  ) {
    id
    name
    price
  }
}

# 2. Search for the product
query {
  searchProducts(searchTerm: "gaming") {
    id
    name
    price
    inventory_count
  }
}

# 3. Update the product
mutation {
  updateProduct(
    id: 3
    data: { name: "Gaming Laptop Pro", price: 1399.99, inventory_count: 30 }
  ) {
    id
    name
    price
    updated_at
  }
}

# 4. Get products by category
query {
  productsByCategory(categoryId: 2, page: 1, limit: 5) {
    id
    name
    price
  }
}
```

## Performance Considerations

- **Pagination**: Always use pagination for listing operations to avoid performance issues
- **Search**: Search operations use ILIKE queries which may be slower on large datasets
- **Relations**: Product queries automatically include category and images relations
- **Indexing**: Ensure proper database indexing on frequently queried fields (name, category_id)

## Security Notes

- All product operations are currently public (no authentication required)
- Input validation is performed on all mutation operations
- SQL injection protection is handled by TypeORM query builders
- Consider implementing rate limiting for search operations to prevent abuse
