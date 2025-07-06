-- Enable the UUID extension to generate unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a function to automatically update the 'updated_at' timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Table: category
-- Stores product categories.
CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for 'category' to update the timestamp
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON category
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();


-- Table: user
-- Stores user account information.
CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for 'user' to update the timestamp
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON "user"
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();


-- Table: product
-- Stores product information.
CREATE TABLE product (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    inventory_count INTEGER NOT NULL DEFAULT 0,
    -- MODIFIED: Changed ON DELETE SET NULL to ON DELETE CASCADE.
    -- Now, deleting a category will delete all associated products.
    category_id INTEGER REFERENCES category(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for 'product' to update the timestamp
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON product
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();


-- Table: product_images
-- Stores URLs for product images, hosted on a service like S3.
CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255),
    is_thumbnail BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- Table: cart
-- Represents a user's shopping cart.
CREATE TABLE cart (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES "user"(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for 'cart' to update the timestamp
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON cart
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();


-- Table: cart_details
-- A join table listing the products within a specific cart.
CREATE TABLE cart_details (
    id SERIAL PRIMARY KEY,
    cart_id UUID NOT NULL REFERENCES cart(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(50) DEFAULT 'active', -- e.g., 'active', 'saved_for_later'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Ensures a product cannot be added to the same cart twice
    UNIQUE (cart_id, product_id)
);


-- Table: order
-- Stores high-level information for a completed order.
CREATE TABLE "order" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- MODIFIED: Changed ON DELETE SET NULL to ON DELETE CASCADE.
    -- Now, deleting a user will delete all their associated orders.
    user_id UUID REFERENCES "user"(id) ON DELETE CASCADE,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL, -- e.g., 'pending', 'processed', 'shipped'
    shipping_address TEXT NOT NULL,
    payment_gateway_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for 'order' to update the timestamp
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON "order"
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();


-- Table: order_details
-- Details the specific products and quantities for each order.
CREATE TABLE order_details (
    id SERIAL PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES "order"(id) ON DELETE CASCADE,
    -- MODIFIED: Added ON DELETE CASCADE.
    -- Now, deleting a product will delete its corresponding order detail lines.
    product_id UUID NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for 'order_details' to update the timestamp
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON order_details
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();


-- Add indexes to foreign key columns for better query performance
CREATE INDEX ON "user" (email);
CREATE INDEX ON product (category_id);
CREATE INDEX ON product_images (product_id);
CREATE INDEX ON cart (user_id);
CREATE INDEX ON cart_details (cart_id);
CREATE INDEX ON cart_details (product_id);
CREATE INDEX ON "order" (user_id);
CREATE INDEX ON order_details (order_id);
CREATE INDEX ON order_details (product_id);