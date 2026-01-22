-- Add class field to support Fresh/Salt water categorization
-- This supports the UI filter requirements and import specifications

-- Add class column to fish_species table
ALTER TABLE fish_species 
ADD COLUMN class VARCHAR(10) DEFAULT 'Fresh' 
CHECK (class IN ('Fresh', 'Salt'));

-- Add index for efficient filtering
CREATE INDEX idx_fish_species_class ON fish_species(class);

-- Update existing records to have class='Fresh' (since current data is freshwater)
UPDATE fish_species SET class = 'Fresh' WHERE class IS NULL;

-- Add class to the fish_display view
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

-- Comments for documentation
COMMENT ON COLUMN fish_species.class IS 'Fish category: Fresh (freshwater) or Salt (saltwater)';

-- Verification query
SELECT 
    'Schema updated successfully!' as status,
    COUNT(*) as total_fish,
    COUNT(CASE WHEN class = 'Fresh' THEN 1 END) as fresh_count,
    COUNT(CASE WHEN class = 'Salt' THEN 1 END) as salt_count
FROM fish_species;