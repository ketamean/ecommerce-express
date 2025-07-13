# Category Management API

## Overview

The Category Management API provides full CRUD (Create, Read, Update, Delete) functionality for managing product categories. Administrative operations (create, update, delete) are protected and require admin privileges.

## GraphQL Queries

### Get All Categories

```graphql
query GetCategories($page: Int, $limit: Int) {
  categories(page: $page, limit: $limit) {
    id
    name
    description
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

### Get Category by ID

```graphql
query GetCategory($id: Int!) {
  category(id: $id) {
    id
    name
    description
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

### Get Category by Name

```graphql
query GetCategoryByName($name: String!) {
  categoryByName(name: $name) {
    id
    name
    description
    created_at
    updated_at
  }
}
```

**Variables:**

```json
{
  "name": "Electronics"
}
```

### Search Categories

```graphql
query SearchCategories(
  $searchInput: CategorySearchInput!
  $page: Int
  $limit: Int
) {
  searchCategories(searchInput: $searchInput, page: $page, limit: $limit) {
    id
    name
    description
    created_at
    updated_at
  }
}
```

**Variables:**

```json
{
  "searchInput": {
    "name": "elec",
    "description": "gadgets"
  },
  "page": 1,
  "limit": 10
}
```

### Get Products by Category

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

## GraphQL Mutations (Admin Only)

### Create Category

**Requires:** Admin authentication

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

**Variables:**

```json
{
  "data": {
    "name": "Electronics",
    "description": "Electronic devices and gadgets"
  }
}
```

**Headers:**

```json
{
  "Authorization": "Bearer <admin_access_token>"
}
```

### Update Category

**Requires:** Admin authentication

```graphql
mutation UpdateCategory($id: Int!, $data: CategoryInput!) {
  updateCategory(id: $id, data: $data) {
    id
    name
    description
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
    "name": "Consumer Electronics",
    "description": "Consumer electronic devices and gadgets"
  }
}
```

**Headers:**

```json
{
  "Authorization": "Bearer <admin_access_token>"
}
```

### Delete Category

**Requires:** Admin authentication

```graphql
mutation DeleteCategory($id: Int!) {
  deleteCategory(id: $id)
}
```

**Variables:**

```json
{
  "id": 1
}
```

**Headers:**

```json
{
  "Authorization": "Bearer <admin_access_token>"
}
```

## Enhanced Product Search

### Search Products with Category Filter

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

### Get Products by Category (Alternative method)

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
    created_at
    updated_at
  }
}
```

## Input Types

### CategoryInput

```typescript
{
  name: string;          // Required: Category name (must be unique)
  description?: string;  // Optional: Category description
}
```

### CategorySearchInput

```typescript
{
  name?: string;         // Optional: Search by category name (partial match)
  description?: string;  // Optional: Search by description (partial match)
}
```

## Error Handling

### Common Errors

1. **Duplicate Category Name**

   ```json
   {
     "message": "Category with name 'Electronics' already exists"
   }
   ```

2. **Category Not Found**

   ```json
   {
     "message": "Category not found"
   }
   ```

3. **Cannot Delete Category with Products**

   ```json
   {
     "message": "Cannot delete category. It has 5 associated product(s). Please delete or reassign the products first."
   }
   ```

4. **Authentication Required**

   ```json
   {
     "message": "Authentication token required"
   }
   ```

5. **Admin Privileges Required**
   ```json
   {
     "message": "Admin privileges required"
   }
   ```

## Authentication & Authorization

- **Public Operations:** All query operations are public and do not require authentication
- **Admin Operations:** Create, update, and delete operations require:
  1. Valid JWT access token in the Authorization header
  2. Admin privileges (`isAdmin: true` in the user profile)

### Admin Token Example

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
     -H "Content-Type: application/json" \
     -d '{"query": "mutation { createCategory(data: {name: \"Electronics\", description: \"Electronic devices\"}) { id name } }"}' \
     http://localhost:3000/api
```

## Business Rules

1. **Category Names Must Be Unique:** Two categories cannot have the same name
2. **Cascade Deletion Protection:** Categories with associated products cannot be deleted
3. **Admin-Only Modifications:** Only administrators can create, update, or delete categories
4. **Case-Insensitive Search:** Search operations are case-insensitive for better user experience
5. **Pagination:** All list operations support pagination with default page size of 10

## Database Relations

- **Category → Product:** One-to-Many relationship
- **Category Deletion:** Protected when products exist (prevents orphaned products)
- **Product Creation:** Must reference an existing category via `categoryId`
