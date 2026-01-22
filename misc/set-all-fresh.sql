-- Set All Records to Fresh Water
-- Updates all existing fish records to have class = 'Fresh'

-- ============================================================================
-- UPDATE ALL RECORDS TO FRESH
-- ============================================================================

-- Update all records to Fresh (assuming current data is freshwater fish)
UPDATE fish_species 
SET class = 'Fresh' 
WHERE class IS NULL 
   OR class = '' 
   OR class = 'fresh'  -- in case some were set to lowercase
   OR class = 'salt'   -- in case any were incorrectly set to salt
   OR class = 'Salt';  -- in case any were set to Salt

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Show the results
SELECT 
    'UPDATE RESULTS' as status,
    COUNT(*) as total_records,
    COUNT(CASE WHEN class = 'Fresh' THEN 1 END) as fresh_count,
    COUNT(CASE WHEN class = 'Salt' THEN 1 END) as salt_count,
    COUNT(CASE WHEN class IS NULL OR class = '' THEN 1 END) as null_or_empty
FROM fish_species;

-- Show sample of updated records
SELECT 
    'SAMPLE UPDATED RECORDS' as info,
    common_name,
    family,
    class,
    species
FROM fish_species 
ORDER BY common_name
LIMIT 10;

-- Show any records that might still have issues
SELECT 
    'PROBLEM RECORDS' as check_type,
    id,
    common_name,
    class,
    'Issue: ' || COALESCE(class, 'NULL') as issue
FROM fish_species 
WHERE class IS NULL 
   OR class = '' 
   OR class NOT IN ('Fresh', 'Salt')
LIMIT 5;

RAISE NOTICE 'All records have been set to Fresh water classification!';