/*
  # Create Stripe products and prices tables

  1. New Tables
    - `stripe_products`
      - Stores product information synced from Stripe
    - `stripe_prices`
      - Stores price information synced from Stripe
      - Links to products

  2. Security
    - Enable RLS on all tables
    - Add policies for secure access
*/

-- Create stripe_products table
CREATE TABLE IF NOT EXISTS stripe_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_product_id text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create stripe_prices table
CREATE TABLE IF NOT EXISTS stripe_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_price_id text UNIQUE NOT NULL,
  product_id uuid REFERENCES stripe_products(id) ON DELETE CASCADE,
  currency text NOT NULL DEFAULT 'eur',
  unit_amount integer NOT NULL,
  interval text,
  interval_count integer DEFAULT 1,
  trial_period_days integer,
  active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE stripe_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_prices ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active products"
  ON stripe_products
  FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Anyone can view active prices"
  ON stripe_prices
  FOR SELECT
  TO authenticated
  USING (active = true);

-- Create indexes
CREATE INDEX idx_stripe_prices_product_id ON stripe_prices(product_id);
CREATE INDEX idx_stripe_prices_interval ON stripe_prices(interval);