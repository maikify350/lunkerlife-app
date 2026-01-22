-- Add class column to fish_species table
-- This will categorize fish as Fresh or Salt water

-- First, add the column without updating any rows
ALTER TABLE fish_species 
ADD COLUMN IF NOT EXISTS class VARCHAR(10) 
CHECK (class IN ('Fresh', 'Salt'))
DEFAULT 'Fresh';

-- Now update the default value for future inserts (optional)
ALTER TABLE fish_species 
ALTER COLUMN class DROP DEFAULT;

-- Verify the update worked
SELECT 
    id,
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

-- If needed, you can manually update specific fish to Salt water later
-- For example:
-- UPDATE fish_species SET class = 'Salt' WHERE family = 'SomeSaltwaterFamily';