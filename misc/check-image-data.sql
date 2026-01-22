-- Check current image data in fish_species table
SELECT 
    common_name,
    image,
    image_name_location,
    CASE 
        WHEN image IS NULL OR image = '' THEN 'No image'
        WHEN image LIKE 'http%' THEN 'Has URL'
        ELSE 'Has filename only'
    END as image_status
FROM fish_species 
ORDER BY common_name
LIMIT 20;