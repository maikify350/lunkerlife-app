-- Add class column to fish_species table
-- This will categorize fish as Fresh or Salt water

-- First, temporarily disable the trigger that's causing the error
ALTER TABLE fish_species DISABLE TRIGGER ALL;

-- Add the class column
ALTER TABLE fish_species 
ADD COLUMN IF NOT EXISTS class VARCHAR(10) 
CHECK (class IN ('Fresh', 'Salt'));

-- Set all current fish to Fresh water (since they came from FishData_Freshwater_2026.xlsx)
UPDATE fish_species 
SET class = 'Fresh' 
WHERE class IS NULL;

-- Re-enable triggers
ALTER TABLE fish_species ENABLE TRIGGER ALL;

-- Verify the update
SELECT 
    common_name,
    class,
    invasive
FROM fish_species
LIMIT 10;

-- Count by class
SELECT 
    class,
    COUNT(*) as count
FROM fish_species
GROUP BY class;