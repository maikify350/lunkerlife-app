-- Add status field to fish_species for the main image
-- This is for tracking the main fish image (not the gallery)
-- Run this in Supabase SQL Editor

-- Add status field to fish_species if not exists
ALTER TABLE fish_species 
ADD COLUMN IF NOT EXISTS image_status VARCHAR(20) DEFAULT 'active' 
CHECK (image_status IN ('active', 'hidden'));

-- Add updated_at if not exists
ALTER TABLE fish_species 
ADD COLUMN IF NOT EXISTS image_updated_at TIMESTAMP WITH TIME ZONE;

-- Update existing records
UPDATE fish_species 
SET image_status = 'active', 
    image_updated_at = NOW()
WHERE image IS NOT NULL AND image != '';

-- Add comments
COMMENT ON COLUMN fish_species.image_status IS 'Main image status: active (visible), hidden (not shown)';

-- Verification
SELECT 
  'fish_species main image status field' as field_name,
  COUNT(*) as has_status_field
FROM information_schema.columns 
WHERE table_name = 'fish_species' 
AND column_name = 'image_status';

SELECT 
  'fish_images table' as table_name,
  COUNT(*) as exists
FROM information_schema.tables 
WHERE table_name = 'fish_images';