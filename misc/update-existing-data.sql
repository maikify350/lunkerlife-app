-- Migration: Update existing fish data with class field and audit fields
-- Run this AFTER the seed data from Excel has been imported

-- Step 1: Add class field to fish_species (if not already added via migration)
-- This is the field that determines Fresh vs Salt water type

-- Step 2: Update class field based on family/type
-- Most of the Excel data is freshwater fish, let's categorize them
UPDATE fish_species
SET class = 'Fresh'
WHERE class IS NULL 
  AND family IN ('Centrarchidae', 'Ictaluridae', 'Salmonidae', 'Percidae', 'Esocidae', 'Cyprinidae', 'Clupeidae');

-- Update known freshwater families
UPDATE fish_species
SET class = 'Fresh'
WHERE class IS NULL
  AND (common_name IN (
    'Largemouth Bass', 'Smallmouth Bass', 'Bluegill', 'Channel Catfish',
    'Rainbow Trout', 'Walleye', 'Northern Pike', 'Crappie', 'Carp', 'Alewife',
    'Brown Trout', 'Brook Trout', 'Lake Trout', 'Cutthroat Trout', 'Lake Whitefish',
    'Chain Pickerel', 'Muskie', 'Pumpkinseed', 'Green Sunfish', 'Redear Sunfish',
    'Yellow Perch', 'White Bass', 'Rock Bass', 'Warmouth', 'Bowfin', 'Gar',
    'Burbot', 'Sucker', 'Buffalo Fish', 'Paddlefish', 'Sturgeon'
  ));

-- Saltwater/marine fish
UPDATE fish_species
SET class = 'Salt'
WHERE class IS NULL
  AND (common_name IN (
    'Striped Bass', 'Red Drum', 'Flounder', 'Sea Trout', 'Mackerel',
    'Tuna', 'Marlin', 'Sailfish', 'Swordfish', 'Shark', 'Ray',
    'Snapper', 'Grouper', 'Mahi Mahi', 'Wahoo', 'Barracuda',
    'Tarpon', 'Bonefish', 'Permit', 'Jack Crevalle', 'Ladyfish',
    'Sand Seatrout', 'Spotted Seatrout', 'Black Drum', 'Sheepshead',
    'Pompano', 'Tripletail', 'Cobia', 'Amberjack', 'King Mackerel',
    'Spanish Mackerel', 'Bluefish', 'Weakfish', 'Hickory Shad',
    'American Shad', 'Atlantic Salmon'
  ));

-- Default remaining to Fresh
UPDATE fish_species
SET class = 'Fresh'
WHERE class IS NULL;

-- Step 3: Add audit fields if missing
ALTER TABLE fish_species
ADD COLUMN IF NOT EXISTS created_dt TIMESTAMP WITH TIME ZONE;

ALTER TABLE fish_species
ADD COLUMN IF NOT EXISTS created_by TEXT;

ALTER TABLE fish_species
ADD COLUMN IF NOT EXISTS updated_dt TIMESTAMP WITH TIME ZONE;

ALTER TABLE fish_species
ADD COLUMN IF NOT EXISTS updated_by TEXT;

-- Step 4: Populate audit fields for existing records
UPDATE fish_species
SET 
  created_dt = COALESCE(created_dt, NOW()),
  created_by = COALESCE(created_by, 'Admin'),
  updated_dt = NOW(),
  updated_by = 'Admin'
WHERE created_dt IS NULL OR updated_dt IS NULL;

-- Step 5: Update trigger function if needed
CREATE OR REPLACE FUNCTION update_fish_species_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_dt = NOW();
    NEW.updated_by = COALESCE(NEW.updated_by, 'Admin');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger (drop if exists first)
DROP TRIGGER IF EXISTS update_fish_species_updated_at ON fish_species;
CREATE TRIGGER update_fish_species_updated_at
    BEFORE UPDATE ON fish_species 
    FOR EACH ROW EXECUTE FUNCTION update_fish_species_updated_at();

-- Verification
SELECT 
    'Update complete!' as status,
    COUNT(*) as total_fish,
    SUM(CASE WHEN class = 'Fresh' THEN 1 ELSE 0 END) as freshwater,
    SUM(CASE WHEN class = 'Salt' THEN 1 ELSE 0 END) as saltwater
FROM fish_species;

SELECT 
    'Audit fields populated' as status,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'fish_species'
AND column_name IN ('class', 'created_dt', 'created_by', 'updated_dt', 'updated_by')
ORDER BY ordinal_position;
