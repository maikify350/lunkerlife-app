-- Update All Fish Image URLs
-- Run this in Supabase SQL Editor to link images to fish records

-- Temporarily disable RLS
ALTER TABLE fish_species DISABLE ROW LEVEL SECURITY;

-- Update all fish images based on their image_name_location field
UPDATE fish_species
SET image = 
    CASE 
        WHEN image_name_location IS NOT NULL THEN 
            'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/' || image_name_location
        ELSE NULL
    END
WHERE image_name_location IS NOT NULL;

-- Re-enable RLS
ALTER TABLE fish_species ENABLE ROW LEVEL SECURITY;

-- Verify the updates
SELECT 
    common_name,
    image_name_location,
    image
FROM fish_species
LIMIT 10;

-- Count how many fish now have images
SELECT 
    COUNT(*) as total_fish,
    COUNT(image) as fish_with_images,
    COUNT(image_name_location) as fish_with_image_names
FROM fish_species;