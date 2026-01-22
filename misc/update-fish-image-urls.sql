-- Update fish images to use local React app URLs
-- This points to images now available in /images/fish/ folder

UPDATE fish_species 
SET image = '/images/fish/' || image
WHERE image IS NOT NULL 
  AND image != '' 
  AND image NOT LIKE 'http%'
  AND image NOT LIKE '/%';

-- Verify the update worked
SELECT 
    common_name,
    image,
    CASE 
        WHEN image LIKE '/images/fish/%' THEN '✅ Updated to local path'
        WHEN image LIKE 'http%' THEN '🌐 External URL'
        ELSE '❌ No image URL'
    END as status
FROM fish_species 
WHERE image IS NOT NULL AND image != ''
ORDER BY common_name
LIMIT 10;

-- Show count of images
SELECT 
    COUNT(*) as total_fish,
    COUNT(CASE WHEN image LIKE '/images/fish/%' THEN 1 END) as fish_with_local_images,
    COUNT(CASE WHEN image IS NULL OR image = '' THEN 1 END) as fish_without_images
FROM fish_species;