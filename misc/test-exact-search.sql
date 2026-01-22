-- Test exact search for "sho" to see what should actually match

-- This is the exact query that should be running
SELECT 
    id,
    common_name,
    also_known_as,
    species,
    class
FROM fish_species 
WHERE (
    common_name ILIKE '%sho%' 
    OR also_known_as ILIKE '%sho%' 
    OR species ILIKE '%sho%'
)
AND class = 'Fresh'  -- assuming Fresh filter is active
ORDER BY common_name;

-- Check what's in the also_known_as field for the problem fish
SELECT 
    common_name,
    also_known_as,
    species,
    LENGTH(also_known_as) as alias_length,
    POSITION('sho' IN LOWER(also_known_as)) as sho_position_in_alias
FROM fish_species 
WHERE common_name IN ('Bass, Redeye', 'Catfish, Flathead');