-- Fix Fish Display Issues
-- 1. Update image URLs to match the storage bucket structure
-- 2. Ensure all fish have proper image references

-- First, let's check what we have
SELECT 
    id,
    common_name,
    image_name_location,
    image,
    CASE 
        WHEN image IS NOT NULL THEN 'Has URL'
        WHEN image_name_location IS NOT NULL THEN 'Has filename'
        ELSE 'No image'
    END as image_status
FROM fish_species
LIMIT 10;

-- Temporarily disable RLS
ALTER TABLE fish_species DISABLE ROW LEVEL SECURITY;

-- Update all image URLs based on image_name_location
-- The images are accessible at the root of the bucket
UPDATE fish_species
SET image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/' || image_name_location
WHERE image_name_location IS NOT NULL;

-- Handle special cases where the image name might be different
-- For example, Pike-Northern.png vs Pike-Nortern.png (typo in original)
UPDATE fish_species
SET image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Pike-Nortern.png'
WHERE common_name = 'Pike, Northern';

-- Re-enable RLS
ALTER TABLE fish_species ENABLE ROW LEVEL SECURITY;

-- Verify the updates
SELECT 
    common_name,
    image_name_location,
    image
FROM fish_species
WHERE image IS NOT NULL
LIMIT 20;

-- Count summary
SELECT 
    COUNT(*) as total_fish,
    COUNT(image) as fish_with_urls,
    COUNT(CASE WHEN image LIKE '%supabase%' THEN 1 END) as fish_with_supabase_urls
FROM fish_species;