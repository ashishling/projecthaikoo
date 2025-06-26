CREATE TABLE inspo_images (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  image_url TEXT NOT NULL
);

ALTER TABLE inspo_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-only access to inspo_images"
ON inspo_images
FOR SELECT
TO anon, authenticated
USING (true); 