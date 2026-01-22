-- Migration: Add class field and audit fields after Excel import
-- Run this AFTER importing fish data from Excel/CSV

-- Step 1: Add class field (Fresh or Salt water type)
ALTER TABLE fish_species ADD COLUMN IF NOT EXISTS class VARCHAR(10) CHECK (class IN ('Fresh', 'Salt'));

-- Step 2: Update class based on known fish families/names
-- Freshwater families
UPDATE fish_species SET class = 'Fresh' WHERE class IS NULL AND family IN (
  'Ictaluridae', 'Centrarchidae', 'Salmonidae', 'Percidae', 'Esocidae', 
  'Cyprinidae', 'Clupeidae', 'Catostomidae', 'Lepisosteidae', 'Amiidae',
  'Lotidae', 'Gadidae'
);

-- Freshwater fish names (comprehensive list)
UPDATE fish_species SET class = 'Fresh' WHERE class IS NULL AND LOWER(common_name) IN (
  'largemouth bass', 'smallmouth bass', 'spotted bass', 'rock bass',
  'bluegill', 'pumpkinseed', 'green sunfish', 'redear sunfish', 'warmouth',
  'crappie', 'white crappie', 'black crappie',
  'channel catfish', 'flathead catfish', 'blue catfish', 'bullhead',
  'rainbow trout', 'brown trout', 'brook trout', 'lake trout', 'cutthroat trout',
  'walleye', 'sauger', 'saugeye',
  'northern pike', 'muskie', 'chain pickerel', 'tiger muskie',
  'carp', 'goldfish', 'baitfish',
  'whitefish', 'cisco', 'lake herring',
  'burbot', 'eelpout',
  'sucker', 'redhorse', 'buffalo fish',
  'bowfin', 'gar', 'longnose gar',
  'sturgeon', 'paddlefish',
  'yellow perch', 'white perch', 'white bass',
  'black bullhead', 'yellow bullhead', 'brown bullhead'
);

-- Saltwater fish names
UPDATE fish_species SET class = 'Salt' WHERE class IS NULL AND LOWER(common_name) IN (
  'striped bass', 'red drum', 'black drum', 'channel bass',
  'flounder', 'summer flounder', 'winter flounder', 'southern flounder',
  'sea trout', 'spotted seatrout', 'sand seatrout',
  'mackerel', 'king mackerel', 'spanish mackerel',
  'tuna', 'bluefin tuna', 'yellowfin tuna', 'albacore',
  'marlin', 'blue marlin', 'white marlin', 'striped marlin',
  'sailfish', 'swordfish',
  'shark', 'great white', 'hammerhead', 'thresher',
  'snapper', 'red snapper', 'mangrove snapper', 'lane snapper',
  'grouper', 'gag grouper', 'red grouper', 'scamp',
  'mahi mahi', 'dolphin fish',
  'wahoo', 'barracuda',
  'tarpon', 'bonefish', 'permit', 'jack crevalle', 'ladyfish',
  'pompano', 'tripletail', 'cobia', 'amberjack',
  'bluefish', 'weakfish', 'hickory shad', 'american shad', 'alewife',
  'sheepshead', 'pinfish', 'croaker', 'spot', 'whiting',
  'lingcod', 'cabezon', 'rockfish', 'vermilion snapper',
  'triggerfish', 'filefish', 'porgy', 'sea bass'
);

-- Default remaining to Fresh (since you're importing from Freshwater folder)
UPDATE fish_species SET class = 'Fresh' WHERE class IS NULL;

-- Step 3: Add audit fields
ALTER TABLE fish_species ADD COLUMN IF NOT EXISTS created_dt TIMESTAMP WITH TIME ZONE;
ALTER TABLE fish_species ADD COLUMN IF NOT EXISTS created_by TEXT;
ALTER TABLE fish_species ADD COLUMN IF NOT EXISTS updated_dt TIMESTAMP WITH TIME ZONE;
ALTER TABLE fish_species ADD COLUMN IF NOT EXISTS updated_by TEXT;

-- Step 4: Populate audit fields
UPDATE fish_species
SET 
  created_dt = COALESCE(created_dt, NOW()),
  created_by = COALESCE(created_by, 'Admin'),
  updated_dt = COALESCE(updated_dt, NOW()),
  updated_by = COALESCE(updated_by, 'Admin');

-- Step 5: Update trigger function
CREATE OR REPLACE FUNCTION update_fish_species_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_dt = NOW();
    NEW.updated_by = 'Admin';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
DROP TRIGGER IF EXISTS update_fish_species_updated_at ON fish_species;
CREATE TRIGGER update_fish_species_updated_at
    BEFORE UPDATE ON fish_species 
    FOR EACH ROW EXECUTE FUNCTION update_fish_species_updated_at();

-- Verification
SELECT 
    'Migration complete!' as status,
    COUNT(*) as total,
    COUNT(CASE WHEN class = 'Fresh' THEN 1 END) as freshwater,
    COUNT(CASE WHEN class = 'Salt' THEN 1 END) as saltwater,
    COUNT(CASE WHEN created_dt IS NOT NULL THEN 1 END) as with_audit
FROM fish_species;

-- Show class distribution
SELECT class, COUNT(*) as count FROM fish_species GROUP BY class ORDER BY class;
