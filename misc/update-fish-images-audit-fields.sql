-- Migration: Update fish_images table to use standard audit field names
-- Run this in Supabase SQL Editor if fish_images table already exists with old schema

-- Step 1: Rename old timestamp columns to standard names (if they exist)
ALTER TABLE fish_images RENAME COLUMN created_at TO created_dt;
ALTER TABLE fish_images RENAME COLUMN updated_at TO updated_dt;

-- Step 2: Add missing audit fields
ALTER TABLE fish_images
ADD COLUMN IF NOT EXISTS created_by TEXT DEFAULT 'Admin';

ALTER TABLE fish_images
ADD COLUMN IF NOT EXISTS updated_by TEXT DEFAULT 'Admin';

-- Step 3: Update existing records
UPDATE fish_images
SET created_by = COALESCE(created_by, 'Admin'),
    updated_by = COALESCE(updated_by, 'Admin');

-- Step 4: Update trigger function to match standard
CREATE OR REPLACE FUNCTION update_fish_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_dt = NOW();
  NEW.updated_by = COALESCE(NEW.updated_by, 'Admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Verification
SELECT
    'fish_images audit fields updated!' as status,
    column_name,
    data_type,
    column_default
FROM information_schema.columns
WHERE table_name = 'fish_images'
AND column_name IN ('created_dt', 'created_by', 'updated_dt', 'updated_by', 'deleted_at')
ORDER BY ordinal_position;
