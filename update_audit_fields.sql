-- Update audit fields to set created_by and updated_by to 'admin'
-- This updates all records where these fields are NULL

-- Temporarily disable triggers to avoid issues
ALTER TABLE fish_species DISABLE TRIGGER ALL;

-- Update created_by for all NULL values
UPDATE fish_species 
SET created_by = 'admin'
WHERE created_by IS NULL;

-- Update updated_by for all NULL values
UPDATE fish_species 
SET updated_by = 'admin'
WHERE updated_by IS NULL;

-- Re-enable triggers
ALTER TABLE fish_species ENABLE TRIGGER ALL;

-- Verify the updates
SELECT 
    common_name,
    created_by,
    updated_by,
    created_at,
    updated_at
FROM fish_species
LIMIT 10;