-- Create prompts table
CREATE TABLE prompts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

-- Enable RLS for prompts table
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access to all authenticated users" ON prompts
  FOR SELECT TO authenticated
  USING (is_active = TRUE);

-- Create generations table
CREATE TABLE generations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  prompt_id BIGINT REFERENCES prompts(id),
  input_image_url TEXT,
  output_image_url TEXT
);

-- Enable RLS for generations table
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own generations
CREATE POLICY "Allow users to see their own generations" ON generations
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to create their own generations
CREATE POLICY "Allow users to create their own generations" ON generations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add a server-side check to prevent bypassing the quota
-- This function will be used in the API route
CREATE OR REPLACE FUNCTION get_user_generation_count(p_user_id UUID)
RETURNS INT AS $$
DECLARE
  generation_count INT;
BEGIN
  SELECT COUNT(*)
  INTO generation_count
  FROM generations
  WHERE user_id = p_user_id;
  
  RETURN generation_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 