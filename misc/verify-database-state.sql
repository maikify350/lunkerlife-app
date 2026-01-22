-- Quick Database State Verification Script
-- Run this after applying the fix to confirm everything is aligned

-- ============================================================================
-- CHECK 1: Table Structure
-- ============================================================================

SELECT 
    'FISH_SPECIES TABLE STRUCTURE' as check_type,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'fish_species' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- ============================================================================
-- CHECK 2: Class Column Status
-- ============================================================================

SELECT 
    'CLASS COLUMN ANALYSIS' as check_type,
    class,
    COUNT(*) as count,
    ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER()), 2) as percentage
FROM fish_species 
GROUP BY class
ORDER BY count DESC;

-- ============================================================================
-- CHECK 3: Constraints
-- ============================================================================

SELECT 
    'CONSTRAINTS CHECK' as check_type,
    constraint_name,
    constraint_type,
    check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'fish_species'
AND tc.table_schema = 'public'
ORDER BY constraint_type, constraint_name;

-- ============================================================================
-- CHECK 4: Indexes
-- ============================================================================

SELECT 
    'INDEXES CHECK' as check_type,
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'fish_species'
ORDER BY indexname;

-- ============================================================================
-- CHECK 5: Views
-- ============================================================================

SELECT 
    'VIEWS CHECK' as check_type,
    table_name as view_name,
    view_definition
FROM information_schema.views 
WHERE table_schema = 'public'
AND table_name LIKE '%fish%'
ORDER BY table_name;

-- ============================================================================
-- CHECK 6: Sample Data
-- ============================================================================

SELECT 
    'SAMPLE DATA CHECK' as check_type,
    id,
    common_name,
    class,
    family,
    invasive
FROM fish_species 
LIMIT 5;

-- ============================================================================
-- SUMMARY STATUS
-- ============================================================================

SELECT 
    'DATABASE STATUS SUMMARY' as final_status,
    (SELECT COUNT(*) FROM fish_species) as total_fish,
    (SELECT COUNT(DISTINCT class) FROM fish_species) as class_varieties,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'fish_species') as total_columns,
    (SELECT COUNT(*) FROM pg_indexes WHERE tablename = 'fish_species') as total_indexes;

-- Show any potential issues
SELECT 
    'POTENTIAL ISSUES' as issue_check,
    CASE 
        WHEN EXISTS(SELECT 1 FROM fish_species WHERE class IS NULL) 
        THEN 'WARNING: Some fish have NULL class values'
        WHEN NOT EXISTS(SELECT 1 FROM fish_species WHERE class IN ('Fresh', 'Salt'))
        THEN 'ERROR: No valid class values found'
        ELSE 'OK: All class values are valid'
    END as class_status;