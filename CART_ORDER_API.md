# Cart & Order API Documentation

This document provides comprehensive documentation for the shopping cart and order management functionality in the E-commerce Express API.

## Table of Contents

1. [Cart Management](#cart-management)
2. [Order Management](#order-management)
3. [Authentication](#authentication)
4. [Error Handling](#error-handling)
5. [Example Workflows](#example-workflows)

---

## Cart Management

### 1. Get My Cart

Retrieve the current user's shopping cart with all items and calculated totals.

```graphql
query GetMyCart {
  myCart {
    id
    cart_id
    created_at
    updated_at
    totalAmount
    totalItems
    cartDetails {
      id
      quantity
      status
      created_at
      subtotal
      product {
        id
        name
        description
        price
        inventory_count
        category {
          id
          name
        }
      }
    }
  }
}
```

**Headers:**

```json
{
  "Authorization": "Bearer <your-access-token>"
}
```

**Response:**

```json
{
  "data": {
    "myCart": {
      "id": 1,
      "cart_id": "uuid-string",
      "created_at": "2025-07-13T14:20:00.000Z",
      "updated_at": "2025-07-13T14:25:00.000Z",
      "totalAmount": 2599.98,
      "totalItems": 3,
      "cartDetails": [
        {
          "id": 1,
          "quantity": 2,
          "status": "active",
          "created_at": "2025-07-13T14:20:00.000Z",
          "subtotal": 1999.98,
          "product": {
            "id": 1,
            "name": "iPhone 15",
            "description": "Latest iPhone model",
            "price": 999.99,
            "inventory_count": 50,
            "category": {
              "id": 1,
              "name": "Smartphones"
            }
          }
        }
      ]
    }
  }
}
```

### 2. Add Item to Cart

Add a product to the shopping cart or increase quantity if it already exists.

```graphql
mutation AddToCart($input: AddToCartInput!) {
  addToCart(input: $input) {
    id
    cart_id
    totalAmount
    totalItems
    cartDetails {
      id
      quantity
      subtotal
      product {
        id
        name
        price
        inventory_count
      }
    }
  }
}
```

**Variables:**

```json
{
  "input": {
    "productId": 1,
    "quantity": 2
  }
}
```

**Headers:**

```json
{
  "Authorization": "Bearer <your-access-token>"
}
```

### 3. Update Cart Item Quantity

Update the quantity of a specific item in the cart.

```graphql
mutation UpdateCartItem($input: UpdateCartItemInput!) {
  updateCartItem(input: $input) {
    id
    totalAmount
    totalItems
    cartDetails {
      id
      quantity
      subtotal
      product {
        id
        name
        price
      }
    }
  }
}
```

**Variables:**

```json
{
  "input": {
    "productId": 1,
    "quantity": 5
  }
}
```

### 4. Remove Item from Cart

Remove a specific item from the cart completely.

```graphql
mutation RemoveFromCart($input: RemoveFromCartInput!) {
  removeFromCart(input: $input) {
    id
    totalAmount
    totalItems
    cartDetails {
      id
      quantity
      product {
        id
        name
      }
    }
  }
}
```

**Variables:**

```json
{
  "input": {
    "productId": 1
  }
}
```

### 5. Clear Cart

Remove all items from the cart.

```graphql
mutation ClearCart {
  clearCart
}
```

**Response:**

```json
{
  "data": {
    "clearCart": true
  }
}
```

---

## Order Management

### 1. Create Order from Cart (Checkout)

Convert the current cart into an order. This will:

- Create a new order with all cart items
- Reduce product inventory
- Clear the cart
- Set order status based on payment method (COD orders are auto-confirmed)

```graphql
mutation CreateOrderFromCart($input: CreateOrderInput!) {
  createOrderFromCart(input: $input) {
    id
    order_id
    total_amount
    status
    payment_method
    shipping_address
    payment_gateway_id
    created_at
    updated_at
    totalItems
    user {
      id
      name
      email
    }
    orderDetails {
      id
      quantity
      price_at_purchase
      subtotal
      product {
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
  }
}
```

**Variables:**

```json
{
  "input": {
    "shipping_address": "123 Main St, City, State 12345",
    "payment_method": "COD",
    "payment_gateway_id": null
  }
}
```

**Available Payment Methods:**

- `COD` (Cash on Delivery - auto-confirmed)
- `CREDIT_CARD`
- `DEBIT_CARD`
- `PAYPAL`
- `BANK_TRANSFER`

### 2. Get My Orders (Order History)

Retrieve the current user's order history with pagination.

```graphql
query GetMyOrders($page: Int, $limit: Int) {
  myOrders(page: $page, limit: $limit) {
    orders {
      id
      order_id
      total_amount
      status
      payment_method
      shipping_address
      created_at
      updated_at
      totalItems
      orderDetails {
        id
        quantity
        price_at_purchase
        subtotal
        product {
          id
          name
          price
          category {
            name
          }
        }
      }
    }
    total
    page
    limit
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

### 3. Get Single Order

Retrieve details of a specific order by ID.

```graphql
query GetMyOrder($id: Int!) {
  myOrder(id: $id) {
    id
    order_id
    total_amount
    status
    payment_method
    shipping_address
    payment_gateway_id
    created_at
    updated_at
    totalItems
    user {
      id
      name
      email
    }
    orderDetails {
      id
      quantity
      price_at_purchase
      subtotal
      created_at
      product {
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
  }
}
```

**Variables:**

```json
{
  "id": 1
}
```

### 4. Cancel Order

Cancel an order (only allowed for PENDING or CONFIRMED orders). This will:

- Restore product inventory
- Update order status to CANCELLED

```graphql
mutation CancelOrder($id: Int!) {
  cancelOrder(id: $id) {
    id
    order_id
    status
    total_amount
    totalItems
    orderDetails {
      id
      quantity
      price_at_purchase
      product {
        id
        name
        inventory_count
      }
    }
  }
}
```

**Variables:**

```json
{
  "id": 1
}
```

---

## Authentication

All cart and order operations require authentication. Include the JWT access token in the Authorization header:

```http
Authorization: Bearer <your-access-token>
```

To get an access token, use the login mutation:

```graphql
mutation Login($data: LoginInput!) {
  login(data: $data) {
    user {
      id
      email
      name
    }
    accessToken
    refreshToken
  }
}
```

---

## Error Handling

### Common Error Scenarios

1. **Authentication Required**

   ```json
   {
     "errors": [
       {
         "message": "Authentication required"
       }
     ]
   }
   ```

2. **Product Not Found**

   ```json
   {
     "errors": [
       {
         "message": "Product not found"
       }
     ]
   }
   ```

3. **Insufficient Inventory**

   ```json
   {
     "errors": [
       {
         "message": "Insufficient inventory. Only 5 items available"
       }
     ]
   }
   ```

4. **Empty Cart Checkout**

   ```json
   {
     "errors": [
       {
         "message": "Cart is empty"
       }
     ]
   }
   ```

5. **Invalid Order Cancellation**
   ```json
   {
     "errors": [
       {
         "message": "Cannot cancel order. Order is already being processed or completed"
       }
     ]
   }
   ```

---

## Order Status Flow

1. **PENDING** - Order created, payment pending
2. **CONFIRMED** - Payment confirmed (COD orders auto-confirm)
3. **PROCESSING** - Order being prepared
4. **SHIPPED** - Order shipped to customer
5. **DELIVERED** - Order delivered to customer
6. **CANCELLED** - Order cancelled (inventory restored)

---

## Example Workflows

### Complete Shopping Flow

1. **Browse Products**

   ```graphql
   query {
     products(page: 1, limit: 10) {
       id
       name
       price
       inventory_count
     }
   }
   ```

2. **Add Items to Cart**

   ```graphql
   mutation {
     addToCart(input: { productId: 1, quantity: 2 }) {
       totalAmount
       totalItems
     }
   }
   ```

3. **Review Cart**

   ```graphql
   query {
     myCart {
       totalAmount
       totalItems
       cartDetails {
         quantity
         subtotal
         product {
           name
           price
         }
       }
     }
   }
   ```

4. **Checkout**

   ```graphql
   mutation {
     createOrderFromCart(
       input: {
         shipping_address: "123 Main St, City, State"
         payment_method: COD
       }
     ) {
       id
       order_id
       status
       total_amount
     }
   }
   ```

5. **View Order History**
   ```graphql
   query {
     myOrders(page: 1, limit: 5) {
       orders {
         id
         order_id
         status
         total_amount
         created_at
       }
       total
     }
   }
   ```

### Cart Management Flow

1. **Check Current Cart**

   ```graphql
   query {
     myCart {
       totalItems
       totalAmount
     }
   }
   ```

2. **Add Product**

   ```graphql
   mutation {
     addToCart(input: { productId: 5, quantity: 1 }) {
       totalItems
     }
   }
   ```

3. **Update Quantity**

   ```graphql
   mutation {
     updateCartItem(input: { productId: 5, quantity: 3 }) {
       totalItems
     }
   }
   ```

4. **Remove Item**

   ```graphql
   mutation {
     removeFromCart(input: { productId: 5 }) {
       totalItems
     }
   }
   ```

5. **Clear All Items**
   ```graphql
   mutation {
     clearCart
   }
   ```

---

## Payment Method Implementation Notes

The system is designed to be extensible for future payment gateway integrations:

- **COD**: Orders are automatically confirmed
- **Other Methods**: Orders remain PENDING until payment confirmation
- **payment_gateway_id**: Optional field for storing external payment references
- Future payment processors can be integrated by:
  1. Adding payment verification logic in the OrderService
  2. Updating order status based on payment gateway webhooks
  3. Implementing payment gateway-specific APIs

---

## Performance Considerations

1. **Inventory Management**: The system uses database transactions to ensure inventory consistency
2. **Cart Persistence**: Carts are persisted in the database and survive user sessions
3. **Calculated Fields**: Totals and subtotals are calculated on-demand to ensure accuracy
4. **Pagination**: Order history includes pagination to handle large datasets
5. **Database Indexes**: Foreign key columns are indexed for optimal query performance

---

## Security Features

1. **Authentication**: All operations require valid JWT tokens
2. **User Isolation**: Users can only access their own carts and orders
3. **Inventory Validation**: Prevents overselling through inventory checks
4. **Transaction Safety**: Database transactions ensure data consistency
5. **Order Immutability**: Order details preserve pricing at time of purchase
