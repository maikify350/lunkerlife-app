-- Add class column to fish_species table for fresh/salt water classification
-- This column is essential for the mobile app filtering functionality

-- Add the class column with default value 'fresh' for existing records
ALTER TABLE fish_species ADD COLUMN class VARCHAR(10) DEFAULT 'fresh' CHECK (class IN ('fresh', 'salt'));

-- Create index for efficient filtering by class
CREATE INDEX idx_fish_class ON fish_species(class);

-- Add comment for clarity
COMMENT ON COLUMN fish_species.class IS 'Water type classification: fresh (freshwater) or salt (saltwater)';

-- Verify the change
SELECT 
    'Class column added successfully!' as status,
    COUNT(*) as total_fish,
    COUNT(CASE WHEN class = 'fresh' THEN 1 END) as freshwater_fish,
    COUNT(CASE WHEN class = 'salt' THEN 1 END) as saltwater_fish
FROM fish_species;