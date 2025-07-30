/*
  # Merchandise System Tables

  1. New Tables
    - `products`
      - Product catalog with variants and inventory
    - `orders`
      - Order management and tracking
    - `order_items`
      - Individual items in orders
    
  2. Security
    - Enable RLS on all tables
    - Policies for viewing and purchasing products
    - Policies for managing orders
*/

CREATE TABLE IF NOT EXISTS merchandise (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  base_price integer NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  images text[] NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS merchandise_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchandise_id uuid REFERENCES merchandise(id) ON DELETE CASCADE,
  name text NOT NULL,
  sku text UNIQUE,
  price_adjustment integer DEFAULT 0,
  inventory_count integer NOT NULL DEFAULT 0,
  attributes jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS merchandise_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  payment_id uuid REFERENCES payments(id),
  status text NOT NULL,
  shipping_address jsonb NOT NULL,
  shipping_method text NOT NULL,
  tracking_number text,
  total_amount integer NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS merchandise_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES merchandise_orders(id) ON DELETE CASCADE,
  variant_id uuid REFERENCES merchandise_variants(id) ON DELETE SET NULL,
  quantity integer NOT NULL,
  unit_price integer NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE merchandise ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchandise_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchandise_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchandise_order_items ENABLE ROW LEVEL SECURITY;

-- Policies for merchandise
CREATE POLICY "Anyone can view active merchandise"
  ON merchandise
  FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Sellers can manage their merchandise"
  ON merchandise
  FOR ALL
  TO authenticated
  USING (auth.uid() = seller_id);

-- Policies for variants
CREATE POLICY "Anyone can view merchandise variants"
  ON merchandise_variants
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchandise m
      WHERE m.id = merchandise_id
      AND m.active = true
    )
  );

CREATE POLICY "Sellers can manage their variants"
  ON merchandise_variants
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchandise m
      WHERE m.id = merchandise_id
      AND m.seller_id = auth.uid()
    )
  );

-- Policies for orders
CREATE POLICY "Users can view their own orders"
  ON merchandise_orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = buyer_id);

CREATE POLICY "Users can create orders"
  ON merchandise_orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = buyer_id);

-- Policies for order items
CREATE POLICY "Users can view their own order items"
  ON merchandise_order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchandise_orders o
      WHERE o.id = order_id
      AND o.buyer_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_merchandise_seller ON merchandise(seller_id);
CREATE INDEX idx_merchandise_category ON merchandise(category);
CREATE INDEX idx_variants_merchandise ON merchandise_variants(merchandise_id);
CREATE INDEX idx_orders_buyer ON merchandise_orders(buyer_id);
CREATE INDEX idx_order_items_order ON merchandise_order_items(order_id);