-- Diagnose Class Column Issue
-- Run this to see exactly what's happening with the class column

-- ============================================================================
-- CHECK 1: Does the class column exist at all?
-- ============================================================================

SELECT 
    'COLUMN EXISTS CHECK' as test,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'fish_species' 
            AND column_name = 'class'
            AND table_schema = 'public'
        ) THEN 'YES - class column exists'
        ELSE 'NO - class column is missing'
    END as result;

-- ============================================================================
-- CHECK 2: Show all columns in fish_species table
-- ============================================================================

SELECT 
    'ALL COLUMNS' as test,
    column_name,
    data_type,
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_name = 'fish_species' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- ============================================================================
-- CHECK 3: If class column exists, show sample data
-- ============================================================================

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'fish_species' 
        AND column_name = 'class'
    ) THEN
        -- Column exists, show sample data
        RAISE NOTICE 'Class column exists - checking data...';
    ELSE
        RAISE NOTICE 'Class column does NOT exist - needs to be added!';
    END IF;
END $$;

-- Try to show class data (will fail if column doesn't exist)
-- Comment this out if it causes errors
SELECT 
    'CLASS DATA SAMPLE' as test,
    common_name,
    class,
    COALESCE(class, 'NULL') as class_value
FROM fish_species 
LIMIT 10;