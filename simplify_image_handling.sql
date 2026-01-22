-- Simplify Image Handling
-- Drop the unused image column since we're using Supabase Storage

-- First, let's verify what we have
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'fish_species' 
AND column_name IN ('image', 'image_name_location');

-- Temporarily disable RLS
ALTER TABLE fish_species DISABLE ROW LEVEL SECURITY;

-- Drop the image column since we're not using it
ALTER TABLE fish_species DROP COLUMN IF EXISTS image;

-- Re-enable RLS
ALTER TABLE fish_species ENABLE ROW LEVEL SECURITY;

-- Verify the column is gone
SELECT 
    id,
    common_name,
    image_name_location
FROM fish_species
LIMIT 10;

-- Show summary
SELECT 
    COUNT(*) as total_fish,
    COUNT(image_name_location) as fish_with_image_names
FROM fish_species;