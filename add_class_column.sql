-- Add class column to fish_species table
-- This will categorize fish as Fresh or Salt water

-- Add the class column
ALTER TABLE fish_species 
ADD COLUMN IF NOT EXISTS class VARCHAR(10) 
CHECK (class IN ('Fresh', 'Salt'));

-- Set all current fish to Fresh water (since they came from FishData_Freshwater_2026.xlsx)
UPDATE fish_species 
SET class = 'Fresh' 
WHERE class IS NULL;

-- Verify the update
SELECT 
    common_name,
    class,
    invasive
FROM fish_species
LIMIT 10;