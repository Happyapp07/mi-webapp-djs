/*
  # Create profiles table for user data

  1. New Tables
    - `profiles`
      - Stores user profile data
      - Links to auth.users
      - Includes fields for all user types

  2. Security
    - Enable RLS on profiles table
    - Add policies for secure access
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  user_type text NOT NULL,
  level integer NOT NULL DEFAULT 1,
  beatcoins integer NOT NULL DEFAULT 100,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  profile_image text,
  auth_provider text,
  
  -- DJ specific fields
  artist_name text,
  galaxy_id text,
  planet_id text,
  
  -- Club specific fields
  club_name text,
  location jsonb,
  capacity integer,
  
  -- Reporter specific fields
  reporter_name text,
  assigned_dj uuid,
  
  -- Common fields
  bio text,
  social_links jsonb,
  achievements jsonb[] DEFAULT array[]::jsonb[],
  preferences jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create indexes
CREATE INDEX idx_profiles_user_type ON profiles(user_type);
CREATE INDEX idx_profiles_username ON profiles(username);