-- Migration: Add audit fields to fish_species table
-- Adds created_dt, created_by, updated_dt, updated_by fields
-- Run this in Supabase SQL Editor

-- Step 1: Add the new columns with default values
ALTER TABLE fish_species
ADD COLUMN IF NOT EXISTS created_dt TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE fish_species
ADD COLUMN IF NOT EXISTS created_by TEXT DEFAULT 'Admin';

ALTER TABLE fish_species
ADD COLUMN IF NOT EXISTS updated_dt TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE fish_species
ADD COLUMN IF NOT EXISTS updated_by TEXT DEFAULT 'Admin';

-- Step 2: Update existing records to have timestamps
UPDATE fish_species
SET created_dt = COALESCE(created_dt, NOW()),
    updated_dt = COALESCE(updated_dt, NOW());

-- Step 3: Create trigger function for auto-updating updated_dt
CREATE OR REPLACE FUNCTION update_fish_species_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_dt = NOW();
    NEW.updated_by = COALESCE(NEW.updated_by, 'Admin');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Drop existing trigger if it exists, then recreate
DROP TRIGGER IF EXISTS update_fish_species_updated_at ON fish_species;

CREATE TRIGGER update_fish_species_updated_at
    BEFORE UPDATE ON fish_species
    FOR EACH ROW
    EXECUTE FUNCTION update_fish_species_updated_at();

-- Verification
SELECT
    'Audit fields added successfully!' as status,
    COUNT(*) as total_columns
FROM information_schema.columns
WHERE table_name = 'fish_species'
AND column_name IN ('created_dt', 'created_by', 'updated_dt', 'updated_by');

-- Show the new columns
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'fish_species'
AND column_name IN ('created_dt', 'created_by', 'updated_dt', 'updated_by')
ORDER BY ordinal_position;
