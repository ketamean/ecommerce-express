# User GraphQL API Documentation

## Overview

This document describes the User GraphQL API endpoints for the E-commerce Express application. The API provides user authentication, profile management, and account operations.

## Base URL

```
POST /graphql
```

## Authentication

Most operations require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Types

### UserType

```graphql
type UserType {
  id: ID!
  user_id: String!
  email: String!
  name: String
  is_admin: Boolean!
  created_at: DateTime!
  updated_at: DateTime!
}
```

### AuthResponse

```graphql
type AuthResponse {
  user: UserType!
  accessToken: String!
  refreshToken: String!
}
```

## Input Types

### RegisterInput

```graphql
input RegisterInput {
  email: String! # Must be a valid email
  password: String! # Minimum 8 characters
  name: String # Optional user name
}
```

### LoginInput

```graphql
input LoginInput {
  email: String! # Must be a valid email
  password: String!
}
```

### UpdateProfileInput

```graphql
input UpdateProfileInput {
  name: String # Optional new name
  email: String # Optional new email (must be valid)
}
```

### ChangePasswordInput

```graphql
input ChangePasswordInput {
  currentPassword: String!
  newPassword: String! # Minimum 8 characters
}
```

## Queries

### me

Get current authenticated user's profile.

**Authentication Required:** Yes

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

**Response:**

```graphql
{
  "data": {
    "me": {
      "id": "1",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "John Doe",
      "is_admin": false,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  }
}
```

## Mutations

### register

Register a new user account.

**Authentication Required:** No

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

**Variables:**

```json
{
  "data": {
    "email": "newuser@example.com",
    "password": "securepassword123",
    "name": "Jane Smith"
  }
}
```

**Response:**

```json
{
  "data": {
    "register": {
      "user": {
        "id": "2",
        "user_id": "550e8400-e29b-41d4-a716-446655440001",
        "email": "newuser@example.com",
        "name": "Jane Smith",
        "is_admin": false,
        "created_at": "2024-01-15T11:00:00Z",
        "updated_at": "2024-01-15T11:00:00Z"
      },
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

### login

Authenticate user and get tokens.

**Authentication Required:** No

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

**Variables:**

```json
{
  "data": {
    "email": "user@example.com",
    "password": "userpassword123"
  }
}
```

**Response:**

```json
{
  "data": {
    "login": {
      "user": {
        "id": "1",
        "user_id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "user@example.com",
        "name": "John Doe",
        "is_admin": false,
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      },
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

### updateProfile

Update user profile information.

**Authentication Required:** Yes

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

**Variables:**

```json
{
  "data": {
    "name": "John Updated",
    "email": "john.updated@example.com"
  }
}
```

**Response:**

```json
{
  "data": {
    "updateProfile": {
      "id": "1",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "john.updated@example.com",
      "name": "John Updated",
      "is_admin": false,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T12:00:00Z"
    }
  }
}
```

### changePassword

Change user password.

**Authentication Required:** Yes

```graphql
mutation ChangePassword($data: ChangePasswordInput!) {
  changePassword(data: $data)
}
```

**Variables:**

```json
{
  "data": {
    "currentPassword": "oldpassword123",
    "newPassword": "newpassword456"
  }
}
```

**Response:**

```json
{
  "data": {
    "changePassword": true
  }
}
```

### deleteAccount

Delete user account permanently.

**Authentication Required:** Yes

```graphql
mutation DeleteAccount {
  deleteAccount
}
```

**Response:**

```json
{
  "data": {
    "deleteAccount": true
  }
}
```

## Error Handling

The API returns GraphQL errors for various scenarios:

### Authentication Errors

```json
{
  "errors": [
    {
      "message": "Authentication required",
      "locations": [...],
      "path": [...]
    }
  ]
}
```

```json
{
  "errors": [
    {
      "message": "Invalid or expired token",
      "locations": [...],
      "path": [...]
    }
  ]
}
```

### Validation Errors

```json
{
  "errors": [
    {
      "message": "User with this email already exists",
      "locations": [...],
      "path": [...]
    }
  ]
}
```

```json
{
  "errors": [
    {
      "message": "Invalid email or password",
      "locations": [...],
      "path": [...]
    }
  ]
}
```

```json
{
  "errors": [
    {
      "message": "Current password is incorrect",
      "locations": [...],
      "path": [...]
    }
  ]
}
```

```json
{
  "errors": [
    {
      "message": "Email is already taken",
      "locations": [...],
      "path": [...]
    }
  ]
}
```

## Token Management

### Access Tokens

- **Expiration:** 15 minutes
- **Usage:** Include in Authorization header for authenticated requests
- **Format:** `Bearer <access_token>`

### Refresh Tokens

- **Expiration:** 365 days
- **Usage:** Use with REST endpoint `/auth/refresh-token` to get new access tokens
- **Security:** Old refresh tokens are blacklisted when used (RTR - Refresh Token Rotation)

### Refresh Token REST Endpoint

```http
POST /auth/refresh-token
Content-Type: application/json

{
  "token": "your_refresh_token_here"
}
```

**Response:**

```json
{
  "accessToken": "new_access_token",
  "refreshToken": "new_refresh_token"
}
```

## Security Features

1. **Password Hashing:** Passwords are hashed using bcrypt with salt and pepper
2. **JWT Security:** Separate secrets for access and refresh tokens
3. **Token Rotation:** Refresh tokens are invalidated after use
4. **Input Validation:** Email format and password length validation
5. **Unique Constraints:** Email uniqueness enforced at database level

## Usage Examples

### Complete Authentication Flow

1. **Register a new user:**

```graphql
mutation {
  register(
    data: {
      email: "user@example.com"
      password: "securepass123"
      name: "John Doe"
    }
  ) {
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

2. **Login existing user:**

```graphql
mutation {
  login(data: { email: "user@example.com", password: "securepass123" }) {
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

3. **Get user profile (with Bearer token):**

```graphql
query {
  me {
    id
    email
    name
    is_admin
    created_at
  }
}
```

4. **Update profile:**

```graphql
mutation {
  updateProfile(data: { name: "John Updated" }) {
    id
    name
    updated_at
  }
}
```

## Notes

- All timestamps are in ISO 8601 format
- User IDs are UUIDs generated automatically
- Admin status cannot be changed through the API
- Deleted accounts cannot be recovered
- Password validation requires minimum 8 characters
- Email must be valid format and unique
