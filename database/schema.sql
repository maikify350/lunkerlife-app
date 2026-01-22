-- LuckerLife Fish Database Schema
-- Scientific fish species database for mobile app data seeding
-- Based on Darwin Core standards and fishing app research

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For geographic coordinates (if needed)

-- ============================================================================
-- TAXONOMIC HIERARCHY TABLES
-- ============================================================================

-- Hierarchical taxonomic classification following scientific standards
CREATE TABLE taxonomic_ranks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rank_type VARCHAR(50) NOT NULL CHECK (rank_type IN ('kingdom', 'phylum', 'class', 'order', 'family', 'genus')),
    name VARCHAR(255) NOT NULL,
    parent_id UUID REFERENCES taxonomic_ranks(id),
    authority VARCHAR(255), -- Scientific authority who described this taxon
    year_described INTEGER, -- Year this taxon was first described
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure no duplicate names at same level under same parent
    UNIQUE(rank_type, name, parent_id)
);

-- ============================================================================
-- CORE FISH SPECIES TABLE
-- ============================================================================

-- Main fish species table with comprehensive scientific and practical data
CREATE TABLE fish_species (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scientific_name VARCHAR(255) UNIQUE NOT NULL, -- Genus species format
    genus_id UUID REFERENCES taxonomic_ranks(id), -- Links to genus in taxonomy
    species_name VARCHAR(100) NOT NULL, -- Just the species part
    
    -- Multi-language common names stored as JSONB
    -- Format: {"en": ["Common name 1", "Common name 2"], "es": ["Nombre común"], "local": ["Regional name"]}
    common_names JSONB NOT NULL DEFAULT '{}',
    
    -- Descriptive information
    description TEXT,
    
    -- Physical characteristics stored as JSONB for flexibility
    -- Format: {"averageLength": {"value": 30, "unit": "cm"}, "maxLength": {"value": 120, "unit": "cm"}, 
    --          "averageWeight": {"value": 2.3, "unit": "kg"}, "bodyShape": "fusiform", "colorPattern": "description"}
    physical_characteristics JSONB DEFAULT '{}',
    
    -- Habitat and environmental data
    -- Format: {"waterType": "freshwater", "temperatureRange": {"min": 0, "max": 25, "unit": "C"}, 
    --          "depth": {"min": 0, "max": 200, "unit": "m"}, "environment": "rivers, lakes"}
    habitat_data JSONB DEFAULT '{}',
    
    -- Conservation status using IUCN categories
    conservation_status VARCHAR(10) CHECK (conservation_status IN ('LC', 'NT', 'VU', 'EN', 'CR', 'EW', 'EX')),
    
    -- Fishing-specific information
    -- Format: {"commercialValue": "high", "gamefish": true, "seasonality": "spring,summer", 
    --          "bestBaits": ["worms", "minnows"], "techniques": ["trolling", "bottom fishing"]}
    fishing_info JSONB DEFAULT '{}',
    
    -- Verification and metadata
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

-- ============================================================================
-- IMAGE MANAGEMENT TABLES
-- ============================================================================

-- Comprehensive image storage with metadata and verification
CREATE TABLE fish_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fish_id UUID NOT NULL REFERENCES fish_species(id) ON DELETE CASCADE,
    
    -- Image categorization for identification
    image_type VARCHAR(50) NOT NULL CHECK (image_type IN ('profile', 'lateral', 'dorsal', 'ventral', 'head', 'detail', 'habitat', 'juvenile', 'adult', 'male', 'female', 'spawning')),
    
    -- File storage paths (Supabase Storage)
    file_path VARCHAR(500) NOT NULL, -- Original image path
    thumbnail_path VARCHAR(500), -- Thumbnail version
    
    -- Image technical metadata
    alt_text VARCHAR(255),
    file_size INTEGER, -- File size in bytes
    width INTEGER, -- Image width in pixels
    height INTEGER, -- Image height in pixels
    format VARCHAR(10), -- jpeg, png, webp, etc.
    
    -- Content and source metadata stored as JSONB
    -- Format: {"photographer": "Name", "location": {"lat": 45.5, "lon": -121.7}, "date": "2023-05-15",
    --          "tags": ["adult", "male", "spawning"], "equipment": "Canon EOS", "source": "field_study"}
    metadata JSONB DEFAULT '{}',
    
    -- Verification and quality control
    verified BOOLEAN DEFAULT FALSE,
    quality_score INTEGER CHECK (quality_score >= 1 AND quality_score <= 5),
    
    -- Display and ordering
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE, -- Primary image for species
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_by UUID
);

-- ============================================================================
-- GEOGRAPHIC DISTRIBUTION TABLES
-- ============================================================================

-- Track where fish species are found globally
CREATE TABLE fish_distribution (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fish_id UUID NOT NULL REFERENCES fish_species(id) ON DELETE CASCADE,
    
    -- Geographic information
    region VARCHAR(255) NOT NULL, -- North America, Europe, Asia, etc.
    country_code VARCHAR(3), -- ISO 3166-1 alpha-3 country code
    state_province VARCHAR(255), -- State, province, or administrative region
    
    -- Distribution details
    native BOOLEAN DEFAULT TRUE, -- Native vs introduced species
    abundance VARCHAR(50) CHECK (abundance IN ('abundant', 'common', 'uncommon', 'rare', 'extinct')),
    
    -- Coordinates for mapping (using PostGIS if available)
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Additional context
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- FISHING TECHNIQUES TABLES
-- ============================================================================

-- Fishing techniques and methods
CREATE TABLE fishing_techniques (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    equipment_needed TEXT[], -- Array of required equipment
    skill_level VARCHAR(50) CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Relationship between species and fishing techniques
CREATE TABLE species_techniques (
    fish_id UUID REFERENCES fish_species(id) ON DELETE CASCADE,
    technique_id UUID REFERENCES fishing_techniques(id) ON DELETE CASCADE,
    effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
    seasonal_notes TEXT,
    best_conditions TEXT,
    
    PRIMARY KEY (fish_id, technique_id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- USER MANAGEMENT TABLES
-- ============================================================================

-- User profiles for access control (extends Supabase Auth)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Search and filtering indexes
CREATE INDEX idx_fish_species_scientific_name ON fish_species(scientific_name);
CREATE INDEX idx_fish_species_genus ON fish_species(genus_id);
CREATE INDEX idx_fish_species_common_names ON fish_species USING GIN(common_names);
CREATE INDEX idx_fish_species_habitat ON fish_species USING GIN(habitat_data);
CREATE INDEX idx_fish_species_fishing_info ON fish_species USING GIN(fishing_info);

-- Full-text search index
CREATE INDEX idx_fish_species_search ON fish_species 
    USING GIN(to_tsvector('english', scientific_name || ' ' || coalesce(common_names::text, '')));

-- Image management indexes
CREATE INDEX idx_fish_images_fish_id ON fish_images(fish_id);
CREATE INDEX idx_fish_images_type ON fish_images(image_type);
CREATE INDEX idx_fish_images_verified ON fish_images(verified);
CREATE INDEX idx_fish_images_primary ON fish_images(is_primary);

-- Geographic indexes
CREATE INDEX idx_fish_distribution_fish_id ON fish_distribution(fish_id);
CREATE INDEX idx_fish_distribution_region ON fish_distribution(region);
CREATE INDEX idx_fish_distribution_country ON fish_distribution(country_code);
CREATE INDEX idx_fish_distribution_coords ON fish_distribution(latitude, longitude);

-- Taxonomic indexes
CREATE INDEX idx_taxonomic_ranks_parent ON taxonomic_ranks(parent_id);
CREATE INDEX idx_taxonomic_ranks_type_name ON taxonomic_ranks(rank_type, name);
CREATE INDEX idx_taxonomic_ranks_hierarchy ON taxonomic_ranks(parent_id, rank_type);

-- Technique relationship indexes
CREATE INDEX idx_species_techniques_fish ON species_techniques(fish_id);
CREATE INDEX idx_species_techniques_technique ON species_techniques(technique_id);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE fish_species ENABLE ROW LEVEL SECURITY;
ALTER TABLE fish_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE fish_distribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE fishing_techniques ENABLE ROW LEVEL SECURITY;
ALTER TABLE species_techniques ENABLE ROW LEVEL SECURITY;
ALTER TABLE taxonomic_ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Basic read access for authenticated users (to be refined based on roles)
CREATE POLICY "Allow read access for authenticated users" ON fish_species FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON fish_images FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON fish_distribution FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON fishing_techniques FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON species_techniques FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON taxonomic_ranks FOR SELECT TO authenticated USING (true);

-- User profile access
CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Apply updated_at triggers to all relevant tables
CREATE TRIGGER update_fish_species_updated_at BEFORE UPDATE ON fish_species 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fish_images_updated_at BEFORE UPDATE ON fish_images 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fish_distribution_updated_at BEFORE UPDATE ON fish_distribution 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fishing_techniques_updated_at BEFORE UPDATE ON fishing_techniques 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_species_techniques_updated_at BEFORE UPDATE ON species_techniques 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_taxonomic_ranks_updated_at BEFORE UPDATE ON taxonomic_ranks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA SEEDING
-- ============================================================================

-- Insert basic taxonomic hierarchy for fish
INSERT INTO taxonomic_ranks (rank_type, name, parent_id, authority, year_described) VALUES
('kingdom', 'Animalia', NULL, 'Linnaeus', 1758);

-- Get the kingdom ID for subsequent inserts
WITH kingdom AS (SELECT id FROM taxonomic_ranks WHERE name = 'Animalia')
INSERT INTO taxonomic_ranks (rank_type, name, parent_id, authority, year_described)
SELECT 'phylum', 'Chordata', kingdom.id, 'Bateson', 1885 FROM kingdom;

-- Insert vertebrate class
WITH phylum AS (SELECT id FROM taxonomic_ranks WHERE name = 'Chordata')
INSERT INTO taxonomic_ranks (rank_type, name, parent_id, authority, year_described)
SELECT 'class', 'Actinopterygii', phylum.id, 'Klein', 1885 FROM phylum;

-- Common fishing technique examples
INSERT INTO fishing_techniques (name, description, equipment_needed, skill_level) VALUES
('Trolling', 'Pulling lures or bait behind a moving boat', ARRAY['rod', 'reel', 'lures', 'boat'], 'intermediate'),
('Bottom Fishing', 'Fishing with weight to keep bait near bottom', ARRAY['rod', 'reel', 'weights', 'hooks', 'bait'], 'beginner'),
('Fly Fishing', 'Using artificial flies and specialized casting techniques', ARRAY['fly rod', 'fly reel', 'flies', 'line'], 'advanced'),
('Spin Fishing', 'Using spinning reels with lures or bait', ARRAY['spinning rod', 'spinning reel', 'lures', 'line'], 'beginner'),
('Jigging', 'Vertical fishing with weighted lures that are jerked up and down', ARRAY['rod', 'reel', 'jigs', 'line'], 'intermediate');

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Complete species view with taxonomy
CREATE VIEW species_with_taxonomy AS
SELECT 
    fs.*,
    g.name as genus_name,
    f.name as family_name,
    o.name as order_name,
    c.name as class_name,
    p.name as phylum_name,
    k.name as kingdom_name
FROM fish_species fs
LEFT JOIN taxonomic_ranks g ON fs.genus_id = g.id
LEFT JOIN taxonomic_ranks f ON g.parent_id = f.id
LEFT JOIN taxonomic_ranks o ON f.parent_id = o.id
LEFT JOIN taxonomic_ranks c ON o.parent_id = c.id
LEFT JOIN taxonomic_ranks p ON c.parent_id = p.id
LEFT JOIN taxonomic_ranks k ON p.parent_id = k.id;

-- Species with primary images
CREATE VIEW species_with_images AS
SELECT 
    fs.*,
    fi.file_path as primary_image,
    fi.thumbnail_path as primary_thumbnail
FROM fish_species fs
LEFT JOIN fish_images fi ON fs.id = fi.fish_id AND fi.is_primary = true;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE fish_species IS 'Core table storing scientific fish species data for mobile app seeding';
COMMENT ON TABLE fish_images IS 'Image management with metadata for fish identification';
COMMENT ON TABLE fish_distribution IS 'Geographic distribution tracking for mapping features';
COMMENT ON TABLE fishing_techniques IS 'Fishing methods and techniques database';
COMMENT ON TABLE taxonomic_ranks IS 'Hierarchical scientific classification following Darwin Core standards';

COMMENT ON COLUMN fish_species.common_names IS 'Multi-language common names stored as JSONB';
COMMENT ON COLUMN fish_species.physical_characteristics IS 'Physical data like length, weight, body shape';
COMMENT ON COLUMN fish_species.habitat_data IS 'Environmental data like water type, temperature, depth';
COMMENT ON COLUMN fish_species.fishing_info IS 'Fishing-specific data like techniques, baits, seasons';