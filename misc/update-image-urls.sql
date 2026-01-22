-- Update fish images to use proper URLs
-- Option 1: Use placeholder images for testing
UPDATE fish_species 
SET image = CASE 
    WHEN image = 'Alewife.png' THEN 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Alewife'
    WHEN image = 'Bass-Hybrid-Striped.png' THEN 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Hybrid+Bass'
    WHEN image = 'Bass-Largemouth.png' THEN 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Largemouth+Bass'
    WHEN image = 'Bass-Smallmouth.png' THEN 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Smallmouth+Bass'
    WHEN image = 'Bass-White.png' THEN 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=White+Bass'
    WHEN image = 'Bluegill.png' THEN 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Bluegill'
    WHEN image = 'Bowfin.png' THEN 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Bowfin'
    WHEN image = 'Buffalo-Bigmouth.png' THEN 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Bigmouth+Buffalo'
    WHEN image = 'Buffalo-Smallmouth.png' THEN 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Smallmouth+Buffalo'
    WHEN image = 'Bullhead-Black.png' THEN 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Black+Bullhead'
    WHEN image = 'Bullhead-Brown.png' THEN 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Brown+Bullhead'
    WHEN image = 'Bullhead-Yellow.png' THEN 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Yellow+Bullhead'
    WHEN image = 'Burbot.png' THEN 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Burbot'
    WHEN image = 'Carp.png' THEN 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Carp'
    WHEN image = 'Catfish-Blue.png' THEN 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Blue+Catfish'
    WHEN image = 'Catfish-Channel.png' THEN 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Channel+Catfish'
    WHEN image = 'Catfish-Flathead.png' THEN 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Flathead+Catfish'
    WHEN image = 'Cisco.png' THEN 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Cisco'
    WHEN image = 'Crappie-Black.png' THEN 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Black+Crappie'
    WHEN image = 'Crappie-White.png' THEN 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=White+Crappie'
    ELSE 'https://via.placeholder.com/300x200/CCCCCC/666666?text=Fish+Image'
END
WHERE image IS NOT NULL AND image != '' AND image NOT LIKE 'http%';

-- Verify the update
SELECT 
    common_name,
    image,
    CASE 
        WHEN image LIKE 'https://via.placeholder.com%' THEN 'Updated to placeholder'
        WHEN image LIKE 'http%' THEN 'Has URL'
        ELSE 'No image URL'
    END as status
FROM fish_species 
WHERE image IS NOT NULL AND image != ''
ORDER BY common_name
LIMIT 10;