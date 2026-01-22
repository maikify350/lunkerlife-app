-- LuckerLife Fish Database - SIMPLIFIED CLEAN SCHEMA
-- Focused only on fish management - no unnecessary taxonomy or technique tables

-- Drop all existing tables for clean slate
DROP TABLE IF EXISTS species_techniques CASCADE;
DROP TABLE IF EXISTS fish_distribution CASCADE;
DROP TABLE IF EXISTS fish_images CASCADE;
DROP TABLE IF EXISTS fishing_techniques CASCADE;
DROP TABLE IF EXISTS fish_species CASCADE;
DROP TABLE IF EXISTS taxonomic_ranks CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Drop views if they exist
DROP VIEW IF EXISTS fish_display CASCADE;
DROP VIEW IF EXISTS fish_search CASCADE;
DROP VIEW IF EXISTS species_with_taxonomy CASCADE;
DROP VIEW IF EXISTS species_with_images CASCADE;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- SINGLE FISH TABLE - EXACTLY MATCHING YOUR SPREADSHEET (19 FIELDS)
-- ============================================================================

CREATE TABLE fish_species (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- EXACT SPREADSHEET FIELDS (1-19)
    image VARCHAR(255),                           -- Column 1: Image
    image_name_location TEXT,                     -- Column 2: Image Name & Location
    common_name VARCHAR(255) NOT NULL,           -- Column 3: Common Name
    also_known_as TEXT,                          -- Column 4: Also Known As
    invasive BOOLEAN DEFAULT FALSE,              -- Column 5: Invasive?
    description TEXT,                            -- Column 6: Description
    family VARCHAR(255),                         -- Column 7: Family
    species VARCHAR(255),                        -- Column 8: Species (Scientific name)
    environmental_status VARCHAR(255),           -- Column 9: Environmental Status
    habitat TEXT,                                -- Column 10: Habitat
    fishing_techniques TEXT,                     -- Column 11: Fishing Techniques (as text field)
    spawning_habits_lifecycle TEXT,              -- Column 12: Spawning Habits/Lifecycle
    diet_feeding_habits TEXT,                    -- Column 13: Diet/Feeding Habits
    range_distribution TEXT,                     -- Column 14: Range
    water_body_type TEXT,                        -- Column 15: Water Body Type
    avg_adult_weight_lbs DECIMAL(8,2),          -- Column 16: Avg Adult Weight (lbs)
    known_for TEXT,                              -- Column 17: Known For
    avg_adult_length_inches DECIMAL(8,2),       -- Column 18: Avg Adult Length (in)
    world_record TEXT,                           -- Column 19: World Record
    
    -- System fields only
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

-- ============================================================================
-- ESSENTIAL INDEXES ONLY
-- ============================================================================

-- Core search indexes
CREATE INDEX idx_fish_common_name ON fish_species(common_name);
CREATE INDEX idx_fish_species_name ON fish_species(species);
CREATE INDEX idx_fish_family ON fish_species(family);
CREATE INDEX idx_fish_invasive ON fish_species(invasive);

-- Full-text search for main searchable fields
CREATE INDEX idx_fish_search ON fish_species 
    USING GIN(to_tsvector('english', 
        COALESCE(common_name, '') || ' ' ||
        COALESCE(also_known_as, '') || ' ' ||
        COALESCE(species, '') || ' ' ||
        COALESCE(description, '')
    ));

-- Filtering indexes
CREATE INDEX idx_fish_weight ON fish_species(avg_adult_weight_lbs);
CREATE INDEX idx_fish_length ON fish_species(avg_adult_length_inches);

-- ============================================================================
-- MINIMAL USER MANAGEMENT
-- ============================================================================

CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ESSENTIAL FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Apply trigger
CREATE TRIGGER update_fish_species_updated_at 
    BEFORE UPDATE ON fish_species 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (SIMPLE)
-- ============================================================================

-- Enable RLS
ALTER TABLE fish_species ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Simple policies for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON fish_species FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- ============================================================================
-- HELPFUL VIEWS (MINIMAL)
-- ============================================================================

-- Simple display view with truncated descriptions
CREATE VIEW fish_display AS
SELECT 
    id,
    common_name,
    species,
    family,
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
-- COMMENTS FOR CLARITY
-- ============================================================================

COMMENT ON TABLE fish_species IS 'Single fish table matching Google Sheets exactly - 19 fields for mobile app data seeding';
COMMENT ON COLUMN fish_species.fishing_techniques IS 'Text field storing fishing techniques as comma-separated string';
COMMENT ON COLUMN fish_species.invasive IS 'Boolean flag - true if invasive species, false if native';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify schema creation
SELECT 
    'SIMPLIFIED fish database schema created successfully!' as status,
    COUNT(*) as total_columns 
FROM information_schema.columns 
WHERE table_name = 'fish_species' AND table_schema = 'public';