-- LuckerLife Fish Database - ACTUAL Schema Matching Spreadsheet
-- This replaces the previous schema with fields matching the Google Sheets data structure

-- Drop existing tables if they exist (for clean slate)
DROP TABLE IF EXISTS species_techniques CASCADE;
DROP TABLE IF EXISTS fish_distribution CASCADE;
DROP TABLE IF EXISTS fish_images CASCADE;
DROP TABLE IF EXISTS fishing_techniques CASCADE;
DROP TABLE IF EXISTS fish_species CASCADE;
DROP TABLE IF EXISTS taxonomic_ranks CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- MAIN FISH TABLE MATCHING SPREADSHEET STRUCTURE
-- ============================================================================

CREATE TABLE fish_species (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Column 1: Image (file reference)
    image VARCHAR(255),
    
    -- Column 2: Image Name & Location
    image_name_location TEXT,
    
    -- Column 3: Common Name
    common_name VARCHAR(255) NOT NULL,
    
    -- Column 4: Also Known As
    also_known_as TEXT,
    
    -- Column 5: Invasive?
    invasive BOOLEAN DEFAULT FALSE,
    
    -- Column 6: Description
    description TEXT,
    
    -- Column 7: Family
    family VARCHAR(255),
    
    -- Column 8: Species (Scientific name)
    species VARCHAR(255),
    
    -- Column 9: Environmental Status
    environmental_status VARCHAR(255),
    
    -- Column 10: Habitat
    habitat TEXT,
    
    -- Column 11: Fishing Techniques
    fishing_techniques TEXT,
    
    -- Column 12: Spawning Habits/Lifecycle
    spawning_habits_lifecycle TEXT,
    
    -- Column 13: Diet/Feeding Habits
    diet_feeding_habits TEXT,
    
    -- Column 14: Range
    range_distribution TEXT,
    
    -- Column 15: Water Body Type
    water_body_type TEXT,
    
    -- Column 16: Avg Adult Weight (lbs)
    avg_adult_weight_lbs DECIMAL(8,2),
    
    -- Column 17: Known For
    known_for TEXT,
    
    -- Column 18: Avg Adult Length (in)
    avg_adult_length_inches DECIMAL(8,2),
    
    -- Column 19: World Record
    world_record TEXT,
    
    -- Additional system fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Primary search indexes
CREATE INDEX idx_fish_common_name ON fish_species(common_name);
CREATE INDEX idx_fish_species_name ON fish_species(species);
CREATE INDEX idx_fish_family ON fish_species(family);
CREATE INDEX idx_fish_invasive ON fish_species(invasive);

-- Full-text search on key text fields
CREATE INDEX idx_fish_search ON fish_species 
    USING GIN(to_tsvector('english', 
        COALESCE(common_name, '') || ' ' ||
        COALESCE(also_known_as, '') || ' ' ||
        COALESCE(species, '') || ' ' ||
        COALESCE(description, '')
    ));

-- Numeric range indexes for filtering
CREATE INDEX idx_fish_weight ON fish_species(avg_adult_weight_lbs);
CREATE INDEX idx_fish_length ON fish_species(avg_adult_length_inches);

-- ============================================================================
-- USER MANAGEMENT (SIMPLE)
-- ============================================================================

CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Apply trigger to main table
CREATE TRIGGER update_fish_species_updated_at 
    BEFORE UPDATE ON fish_species 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE fish_species ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Basic policies for development (adjust for production)
CREATE POLICY "Allow all operations for authenticated users" ON fish_species FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View for display with calculated fields
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
    -- Truncated description for card display
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

-- View for search with combined text
CREATE VIEW fish_search AS
SELECT 
    id,
    common_name,
    species,
    family,
    invasive,
    (common_name || ' ' || 
     COALESCE(also_known_as, '') || ' ' || 
     COALESCE(species, '') || ' ' || 
     COALESCE(family, '')
    ) as search_text,
    avg_adult_weight_lbs,
    avg_adult_length_inches,
    water_body_type,
    environmental_status
FROM fish_species;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE fish_species IS 'Main fish database table matching Google Sheets structure with 19 fields';
COMMENT ON COLUMN fish_species.common_name IS 'Primary common name from spreadsheet';
COMMENT ON COLUMN fish_species.also_known_as IS 'Alternative names, nicknames, regional names';
COMMENT ON COLUMN fish_species.invasive IS 'Boolean flag if species is invasive';
COMMENT ON COLUMN fish_species.species IS 'Scientific species name';
COMMENT ON COLUMN fish_species.avg_adult_weight_lbs IS 'Average adult weight in pounds';
COMMENT ON COLUMN fish_species.avg_adult_length_inches IS 'Average adult length in inches';

-- Verify schema creation
SELECT 'Fish database schema created successfully to match spreadsheet!' as status,
       COUNT(*) as total_columns 
FROM information_schema.columns 
WHERE table_name = 'fish_species' AND table_schema = 'public';