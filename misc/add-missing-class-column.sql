-- Add Missing Class Column
-- Simple script to add the class column if it's completely missing

-- ============================================================================
-- STEP 1: Add class column (will error if it already exists - that's OK)
-- ============================================================================

-- Try to add the column - wrap in transaction to handle if it already exists
BEGIN;

-- Check if column exists first
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'fish_species' 
        AND column_name = 'class'
        AND table_schema = 'public'
    ) THEN
        -- Column doesn't exist, add it
        ALTER TABLE fish_species 
        ADD COLUMN class VARCHAR(10) DEFAULT 'Fresh' 
        CHECK (class IN ('Fresh', 'Salt'));
        
        RAISE NOTICE 'Added class column successfully!';
    ELSE
        RAISE NOTICE 'Class column already exists!';
    END IF;
END $$;

COMMIT;

-- ============================================================================
-- STEP 2: Update all existing records to have Fresh as default
-- ============================================================================

UPDATE fish_species 
SET class = 'Fresh' 
WHERE class IS NULL OR class = '';

-- ============================================================================
-- STEP 3: Add index for performance
-- ============================================================================

-- Drop index if it exists with old name
DROP INDEX IF EXISTS idx_fish_class;

-- Create index with proper name
CREATE INDEX IF NOT EXISTS idx_fish_species_class ON fish_species(class);

-- ============================================================================
-- STEP 4: Update the view to include class column
-- ============================================================================

-- Recreate the fish_display view to include class
DROP VIEW IF EXISTS fish_display CASCADE;

CREATE VIEW fish_display AS
SELECT 
    id,
    common_name,
    species,
    family,
    class,  -- <-- This is the important addition
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
-- STEP 5: Verification
-- ============================================================================

-- Show results
SELECT 
    'CLASS COLUMN STATUS' as status,
    COUNT(*) as total_fish,
    COUNT(CASE WHEN class = 'Fresh' THEN 1 END) as fresh_count,
    COUNT(CASE WHEN class = 'Salt' THEN 1 END) as salt_count,
    COUNT(CASE WHEN class IS NULL THEN 1 END) as null_count
FROM fish_species;

-- Show sample records with class
SELECT 
    'SAMPLE DATA WITH CLASS' as info,
    common_name,
    family,
    class,
    invasive
FROM fish_species 
LIMIT 5;

RAISE NOTICE 'Class column setup completed!';