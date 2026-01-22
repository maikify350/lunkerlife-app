-- Update fish images to use Supabase Storage URLs
-- Run this AFTER uploading images to the fish-images bucket

UPDATE fish_species 
SET image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/' || image
WHERE image IS NOT NULL 
  AND image != '' 
  AND image NOT LIKE 'http%'
  AND image NOT LIKE 'https%';

-- Verify the update worked
SELECT 
    common_name,
    image,
    CASE 
        WHEN image LIKE 'https://gskbzaduwmsbaxddixmk.supabase.co/storage%' THEN '✅ Supabase Storage'
        WHEN image IS NULL OR image = '' THEN '❌ No image'
        ELSE '⚠️ Other source'
    END as image_status
FROM fish_species 
WHERE image IS NOT NULL AND image != ''
ORDER BY common_name
LIMIT 10;

-- Show storage statistics
SELECT 
    'FISH IMAGES SUMMARY' as summary,
    COUNT(*) as total_fish,
    COUNT(CASE WHEN image LIKE 'https://gskbzaduwmsbaxddixmk.supabase.co/storage%' THEN 1 END) as fish_with_supabase_images,
    COUNT(CASE WHEN image IS NULL OR image = '' THEN 1 END) as fish_without_images,
    ROUND(
        (COUNT(CASE WHEN image LIKE 'https://gskbzaduwmsbaxddixmk.supabase.co/storage%' THEN 1 END) * 100.0 / COUNT(*)), 2
    ) as percentage_with_images
FROM fish_species;