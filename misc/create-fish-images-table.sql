-- Create fish_images table for multiple images per fish
-- Run this in Supabase SQL Editor AFTER fish_species table exists

-- Drop if exists to start fresh
DROP TABLE IF EXISTS fish_images CASCADE;

-- Create the fish_images table
CREATE TABLE fish_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fish_id UUID REFERENCES fish_species(id) ON DELETE CASCADE,
  storage_path VARCHAR(500) NOT NULL,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255),
  file_size BIGINT,
  mime_type VARCHAR(100),
  image_type VARCHAR(50) DEFAULT 'general',
  is_default BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'hidden')),
  uploaded_by UUID,
  
  -- AUDIT FIELDS (required for all tables)
  created_dt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT DEFAULT 'Admin',
  updated_dt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by TEXT DEFAULT 'Admin',
  
  -- Soft delete timestamp
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_fish_images_fish_id ON fish_images(fish_id);
CREATE INDEX IF NOT EXISTS idx_fish_images_status ON fish_images(status);
CREATE INDEX IF NOT EXISTS idx_fish_images_created_at ON fish_images(created_dt DESC);

-- Trigger function for auto-updating updated_dt
CREATE OR REPLACE FUNCTION update_fish_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_dt = NOW();
  NEW.updated_by = COALESCE(NEW.updated_by, 'Admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_fish_images_updated_at
  BEFORE UPDATE ON fish_images
  FOR EACH ROW
  EXECUTE FUNCTION update_fish_images_updated_at();

-- Enable RLS
ALTER TABLE fish_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow authenticated users to view fish images" 
  ON fish_images FOR SELECT 
  TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to manage fish images" 
  ON fish_images FOR ALL 
  TO authenticated USING (true);

-- Verify
SELECT 'fish_images table created!' as status;
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'fish_images' ORDER BY ordinal_position;
