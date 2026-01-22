-- Debug search issue for "sho"
-- Let's see what's in the data that might be causing false matches

-- Check what fields contain "sho" for these specific fish
SELECT 
    common_name,
    also_known_as,
    species,
    CASE 
        WHEN common_name ILIKE '%sho%' THEN 'common_name matches'
        WHEN also_known_as ILIKE '%sho%' THEN 'also_known_as matches'
        WHEN species ILIKE '%sho%' THEN 'species matches'
        ELSE 'NO MATCH - ERROR'
    END as match_field
FROM fish_species 
WHERE common_name ILIKE '%bass%redeye%' 
   OR common_name ILIKE '%catfish%flathead%'
   OR common_name ILIKE '%sho%';

-- Check all fields for these specific problem fish
SELECT 
    common_name,
    also_known_as,
    species,
    image,
    description
FROM fish_species 
WHERE common_name = 'Bass, Redeye' 
   OR common_name = 'Catfish, Flathead';

-- Test the exact query being used in the app
SELECT common_name, also_known_as, species
FROM fish_species 
WHERE common_name ILIKE '%sho%' 
   OR also_known_as ILIKE '%sho%' 
   OR species ILIKE '%sho%'
ORDER BY common_name;