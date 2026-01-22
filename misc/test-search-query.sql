-- Test search functionality
-- This tests the search pattern that should work in Supabase

-- Test 1: Basic search for "sh" 
SELECT common_name, also_known_as, species 
FROM fish_species 
WHERE LOWER(common_name) LIKE '%sh%'
   OR LOWER(COALESCE(also_known_as, '')) LIKE '%sh%'
   OR LOWER(COALESCE(species, '')) LIKE '%sh%'
LIMIT 5;

-- Test 2: Search for "shoal"
SELECT common_name, also_known_as, species 
FROM fish_species 
WHERE LOWER(common_name) LIKE '%shoal%'
   OR LOWER(COALESCE(also_known_as, '')) LIKE '%shoal%'
   OR LOWER(COALESCE(species, '')) LIKE '%shoal%'
LIMIT 5;