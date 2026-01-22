-- Fix Script: Align class column implementation
-- Handles the mismatch between manual command and migration file
-- This ensures consistency regardless of what was actually applied

-- ============================================================================
-- STEP 1: HANDLE EXISTING CLASS COLUMN (if any)
-- ============================================================================

-- Check if class column already exists with the manual implementation
DO $$
BEGIN
    -- Try to detect what version of class column exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'fish_species' 
        AND column_name = 'class'
        AND table_schema = 'public'
    ) THEN
        RAISE NOTICE 'Class column already exists - checking constraints...';
        
        -- Drop any existing constraints to standardize
        ALTER TABLE fish_species DROP CONSTRAINT IF EXISTS fish_species_class_check;
        
        -- Drop any existing indexes to recreate with standard name
        DROP INDEX IF EXISTS idx_fish_class;
        DROP INDEX IF EXISTS idx_fish_species_class;
        
    ELSE
        -- Add the class column if it doesn't exist
        ALTER TABLE fish_species ADD COLUMN class VARCHAR(10) DEFAULT 'Fresh';
        RAISE NOTICE 'Added class column to fish_species table';
    END IF;
END $$;

-- ============================================================================
-- STEP 2: STANDARDIZE TO PROPER CASE VALUES
-- ============================================================================

-- Update any lowercase values to proper case
UPDATE fish_species 
SET class = CASE 
    WHEN LOWER(class) = 'fresh' THEN 'Fresh'
    WHEN LOWER(class) = 'salt' THEN 'Salt' 
    ELSE 'Fresh'  -- Default for any unexpected values
END
WHERE class IS NOT NULL;

-- Set default for any NULL values
UPDATE fish_species SET class = 'Fresh' WHERE class IS NULL;

-- ============================================================================
-- STEP 3: ADD PROPER CONSTRAINTS AND INDEXES
-- ============================================================================

-- Add the standardized constraint
ALTER TABLE fish_species 
ADD CONSTRAINT fish_species_class_check 
CHECK (class IN ('Fresh', 'Salt'));

-- Add the properly named index
CREATE INDEX idx_fish_species_class ON fish_species(class);

-- ============================================================================
-- STEP 4: UPDATE THE FISH_DISPLAY VIEW
-- ============================================================================

-- Drop and recreate the view to include class
DROP VIEW IF EXISTS fish_display;

CREATE VIEW fish_display AS
SELECT 
    id,
    common_name,
    species,
    family,
    class,
    invasive,
    environmental_status,
    avg_adult_weight_lbs,
    avg_adult_length_inches,
    water_body_type,
    image,
    -- Truncated description for cards
    CASE 
        WHEN LENGTH(description) > 150 THEN SUBSTRING(description FROM 1 FOR 150) || '...'
        ELSE description
    END as description_preview,
    description as full_description,
    also_known_as,
    habitat,
    fishing_techniques,
    known_for,
    world_record,
    created_at,
    updated_at
FROM fish_species
ORDER BY common_name;

-- ============================================================================
-- STEP 5: ADD PROPER DOCUMENTATION
-- ============================================================================

COMMENT ON COLUMN fish_species.class IS 'Fish category: Fresh (freshwater) or Salt (saltwater) - standardized proper case';

-- ============================================================================
-- STEP 6: VERIFICATION AND STATUS
-- ============================================================================

-- Verify the fix worked correctly
SELECT 
    'Class column alignment completed!' as status,
    COUNT(*) as total_fish,
    COUNT(CASE WHEN class = 'Fresh' THEN 1 END) as fresh_count,
    COUNT(CASE WHEN class = 'Salt' THEN 1 END) as salt_count,
    COUNT(CASE WHEN class IS NULL THEN 1 END) as null_count
FROM fish_species;

-- Show the constraint and index information
SELECT 
    'Constraints and Indexes:' as info,
    constraint_name,
    constraint_type
FROM information_schema.table_constraints 
WHERE table_name = 'fish_species' AND constraint_name LIKE '%class%'
UNION ALL
SELECT 
    'Index:' as info,
    indexname as constraint_name,
    'INDEX' as constraint_type
FROM pg_indexes 
WHERE tablename = 'fish_species' AND indexname LIKE '%class%';

RAISE NOTICE 'Class column alignment script completed successfully!';