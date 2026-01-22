-- LuckerLife Fish Database - Initial Seed Data
-- This script populates the database with essential taxonomic hierarchy and sample data
-- Run this AFTER the initial schema migration

-- ============================================================================
-- BASIC TAXONOMIC HIERARCHY FOR FISH
-- ============================================================================

-- Insert basic taxonomic hierarchy for fish
INSERT INTO taxonomic_ranks (rank_type, name, parent_id, authority, year_described) VALUES
('kingdom', 'Animalia', NULL, 'Linnaeus', 1758)
ON CONFLICT (rank_type, name, parent_id) DO NOTHING;

-- Get the kingdom ID for subsequent inserts
DO $$
DECLARE
    kingdom_id UUID;
    phylum_id UUID;
    class_id UUID;
    order_salmoniformes_id UUID;
    order_perciformes_id UUID;
    family_salmonidae_id UUID;
    family_centrarchidae_id UUID;
    genus_oncorhynchus_id UUID;
    genus_micropterus_id UUID;
BEGIN
    -- Get kingdom ID
    SELECT id INTO kingdom_id FROM taxonomic_ranks WHERE name = 'Animalia' AND rank_type = 'kingdom';
    
    -- Insert Phylum Chordata
    INSERT INTO taxonomic_ranks (rank_type, name, parent_id, authority, year_described)
    VALUES ('phylum', 'Chordata', kingdom_id, 'Bateson', 1885)
    ON CONFLICT (rank_type, name, parent_id) DO NOTHING;
    
    SELECT id INTO phylum_id FROM taxonomic_ranks WHERE name = 'Chordata' AND rank_type = 'phylum';
    
    -- Insert Class Actinopterygii (ray-finned fish)
    INSERT INTO taxonomic_ranks (rank_type, name, parent_id, authority, year_described)
    VALUES ('class', 'Actinopterygii', phylum_id, 'Klein', 1885)
    ON CONFLICT (rank_type, name, parent_id) DO NOTHING;
    
    SELECT id INTO class_id FROM taxonomic_ranks WHERE name = 'Actinopterygii' AND rank_type = 'class';
    
    -- Insert Orders
    INSERT INTO taxonomic_ranks (rank_type, name, parent_id, authority, year_described)
    VALUES 
        ('order', 'Salmoniformes', class_id, 'Bleeker', 1859),
        ('order', 'Perciformes', class_id, 'Bleeker', 1859)
    ON CONFLICT (rank_type, name, parent_id) DO NOTHING;
    
    SELECT id INTO order_salmoniformes_id FROM taxonomic_ranks WHERE name = 'Salmoniformes' AND rank_type = 'order';
    SELECT id INTO order_perciformes_id FROM taxonomic_ranks WHERE name = 'Perciformes' AND rank_type = 'order';
    
    -- Insert Families
    INSERT INTO taxonomic_ranks (rank_type, name, parent_id, authority, year_described)
    VALUES 
        ('family', 'Salmonidae', order_salmoniformes_id, 'Jarocki', 1822),
        ('family', 'Centrarchidae', order_perciformes_id, 'Bleeker', 1859)
    ON CONFLICT (rank_type, name, parent_id) DO NOTHING;
    
    SELECT id INTO family_salmonidae_id FROM taxonomic_ranks WHERE name = 'Salmonidae' AND rank_type = 'family';
    SELECT id INTO family_centrarchidae_id FROM taxonomic_ranks WHERE name = 'Centrarchidae' AND rank_type = 'family';
    
    -- Insert Genera
    INSERT INTO taxonomic_ranks (rank_type, name, parent_id, authority, year_described)
    VALUES 
        ('genus', 'Oncorhynchus', family_salmonidae_id, 'Suckley', 1861),
        ('genus', 'Micropterus', family_centrarchidae_id, 'Lacepède', 1802)
    ON CONFLICT (rank_type, name, parent_id) DO NOTHING;
    
END $$;

-- ============================================================================
-- SAMPLE FISH SPECIES
-- ============================================================================

-- Insert some sample fish species for testing
DO $$
DECLARE
    genus_oncorhynchus_id UUID;
    genus_micropterus_id UUID;
BEGIN
    -- Get genus IDs
    SELECT id INTO genus_oncorhynchus_id FROM taxonomic_ranks WHERE name = 'Oncorhynchus' AND rank_type = 'genus';
    SELECT id INTO genus_micropterus_id FROM taxonomic_ranks WHERE name = 'Micropterus' AND rank_type = 'genus';
    
    -- Insert Rainbow Trout
    INSERT INTO fish_species (
        scientific_name, 
        genus_id, 
        species_name, 
        common_names, 
        description,
        physical_characteristics,
        habitat_data,
        conservation_status,
        fishing_info,
        verified
    ) VALUES (
        'Oncorhynchus mykiss',
        genus_oncorhynchus_id,
        'mykiss',
        '{"en": ["Rainbow Trout", "Steelhead"], "es": ["Trucha Arcoíris"], "local": ["Rainbow"]}',
        'A species of trout native to cold-water tributaries of the Pacific Ocean in Asia and North America. Known for its distinctive pink stripe and excellent fighting ability.',
        '{"averageLength": {"value": 30, "unit": "cm"}, "maxLength": {"value": 120, "unit": "cm"}, "averageWeight": {"value": 2.3, "unit": "kg"}, "maxWeight": {"value": 25, "unit": "kg"}, "bodyShape": "fusiform", "colorPattern": "Silver with pink lateral stripe, black spots on back and dorsal fin"}',
        '{"waterType": "freshwater", "temperatureRange": {"min": 0, "max": 25, "unit": "C"}, "preferredDepth": {"min": 0, "max": 200, "unit": "m"}, "environment": "rivers, lakes, streams"}',
        'LC',
        '{"commercialValue": "high", "gamefish": true, "seasonality": "spring,summer,fall", "bestBaits": ["worms", "salmon eggs", "spinners", "flies"], "techniques": ["fly fishing", "spin fishing", "trolling"]}',
        true
    ),
    
    -- Insert Largemouth Bass
    (
        'Micropterus salmoides',
        genus_micropterus_id,
        'salmoides',
        '{"en": ["Largemouth Bass", "Black Bass"], "es": ["Lobina Negra"], "local": ["Bass", "Bucket Mouth"]}',
        'A carnivorous freshwater gamefish native to eastern North America but widely introduced elsewhere. Known for aggressive strikes and acrobatic fights.',
        '{"averageLength": {"value": 40, "unit": "cm"}, "maxLength": {"value": 97, "unit": "cm"}, "averageWeight": {"value": 1.8, "unit": "kg"}, "maxWeight": {"value": 10, "unit": "kg"}, "bodyShape": "laterally compressed", "colorPattern": "Dark green with lighter belly, distinctive lateral line"}',
        '{"waterType": "freshwater", "temperatureRange": {"min": 5, "max": 35, "unit": "C"}, "preferredDepth": {"min": 0, "max": 20, "unit": "m"}, "environment": "lakes, ponds, slow rivers, vegetation areas"}',
        'LC',
        '{"commercialValue": "medium", "gamefish": true, "seasonality": "spring,summer,fall", "bestBaits": ["plastic worms", "crankbaits", "spinnerbaits", "jigs"], "techniques": ["bass fishing", "casting", "trolling"]}',
        true
    )
    ON CONFLICT (scientific_name) DO NOTHING;
    
END $$;

-- ============================================================================
-- FISHING TECHNIQUES
-- ============================================================================

-- Insert common fishing technique examples
INSERT INTO fishing_techniques (name, description, equipment_needed, skill_level) VALUES
('Fly Fishing', 'Using artificial flies and specialized casting techniques to mimic insects and other fish food', ARRAY['fly rod', 'fly reel', 'flies', 'leader', 'tippet'], 'advanced'),
('Spin Fishing', 'Using spinning reels with lures or natural bait for versatile freshwater and saltwater fishing', ARRAY['spinning rod', 'spinning reel', 'lures', 'line', 'swivels'], 'beginner'),
('Trolling', 'Pulling lures or bait behind a moving boat to cover large areas of water', ARRAY['rod', 'reel', 'trolling lures', 'boat', 'downriggers'], 'intermediate'),
('Bottom Fishing', 'Fishing with weight to keep bait near the bottom where many fish feed', ARRAY['rod', 'reel', 'weights', 'hooks', 'bait'], 'beginner'),
('Jigging', 'Vertical fishing with weighted lures that are jerked up and down to attract fish', ARRAY['jigging rod', 'reel', 'jigs', 'line'], 'intermediate'),
('Casting', 'Casting lures or bait to specific locations and retrieving with various techniques', ARRAY['casting rod', 'reel', 'lures', 'line'], 'beginner'),
('Ice Fishing', 'Fishing through holes in ice during winter months', ARRAY['ice rod', 'reel', 'auger', 'ice shelter', 'tip-ups'], 'intermediate'),
('Surf Fishing', 'Fishing from the shore into ocean surf and waves', ARRAY['surf rod', 'reel', 'pyramid sinkers', 'circle hooks', 'bait'], 'intermediate')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- LINK SAMPLE SPECIES TO TECHNIQUES
-- ============================================================================

-- Link Rainbow Trout to appropriate fishing techniques
DO $$
DECLARE
    rainbow_trout_id UUID;
    fly_fishing_id UUID;
    spin_fishing_id UUID;
    trolling_id UUID;
BEGIN
    -- Get species and technique IDs
    SELECT id INTO rainbow_trout_id FROM fish_species WHERE scientific_name = 'Oncorhynchus mykiss';
    SELECT id INTO fly_fishing_id FROM fishing_techniques WHERE name = 'Fly Fishing';
    SELECT id INTO spin_fishing_id FROM fishing_techniques WHERE name = 'Spin Fishing';
    SELECT id INTO trolling_id FROM fishing_techniques WHERE name = 'Trolling';
    
    -- Insert relationships
    INSERT INTO species_techniques (fish_id, technique_id, effectiveness_rating, seasonal_notes, best_conditions)
    VALUES 
        (rainbow_trout_id, fly_fishing_id, 5, 'Excellent in spring and fall when insects are active', 'Clear water, overcast days, evening hatches'),
        (rainbow_trout_id, spin_fishing_id, 4, 'Good year-round technique', 'Moving water, early morning and evening'),
        (rainbow_trout_id, trolling_id, 4, 'Effective in larger lakes', 'Deep water during summer heat')
    ON CONFLICT (fish_id, technique_id) DO NOTHING;
END $$;

-- Link Largemouth Bass to appropriate fishing techniques
DO $$
DECLARE
    largemouth_bass_id UUID;
    spin_fishing_id UUID;
    casting_id UUID;
    trolling_id UUID;
BEGIN
    -- Get species and technique IDs
    SELECT id INTO largemouth_bass_id FROM fish_species WHERE scientific_name = 'Micropterus salmoides';
    SELECT id INTO spin_fishing_id FROM fishing_techniques WHERE name = 'Spin Fishing';
    SELECT id INTO casting_id FROM fishing_techniques WHERE name = 'Casting';
    SELECT id INTO trolling_id FROM fishing_techniques WHERE name = 'Trolling';
    
    -- Insert relationships
    INSERT INTO species_techniques (fish_id, technique_id, effectiveness_rating, seasonal_notes, best_conditions)
    VALUES 
        (largemouth_bass_id, spin_fishing_id, 5, 'Most effective technique year-round', 'Around structure, vegetation, drop-offs'),
        (largemouth_bass_id, casting_id, 5, 'Peak effectiveness in spring and fall', 'Shallow water during spawning season'),
        (largemouth_bass_id, trolling_id, 3, 'Less effective but useful for locating fish', 'Open water, suspended fish')
    ON CONFLICT (fish_id, technique_id) DO NOTHING;
END $$;

-- ============================================================================
-- SAMPLE DISTRIBUTION DATA
-- ============================================================================

-- Insert geographic distribution for sample species
DO $$
DECLARE
    rainbow_trout_id UUID;
    largemouth_bass_id UUID;
BEGIN
    -- Get species IDs
    SELECT id INTO rainbow_trout_id FROM fish_species WHERE scientific_name = 'Oncorhynchus mykiss';
    SELECT id INTO largemouth_bass_id FROM fish_species WHERE scientific_name = 'Micropterus salmoides';
    
    -- Rainbow Trout distribution
    INSERT INTO fish_distribution (fish_id, region, country_code, state_province, native, abundance, notes)
    VALUES 
        (rainbow_trout_id, 'North America', 'USA', 'California', true, 'common', 'Native to Pacific coast tributaries'),
        (rainbow_trout_id, 'North America', 'USA', 'Montana', false, 'common', 'Introduced and well-established'),
        (rainbow_trout_id, 'North America', 'CAN', 'British Columbia', true, 'abundant', 'Native range in coastal rivers'),
        (rainbow_trout_id, 'Europe', 'GBR', 'Scotland', false, 'common', 'Introduced for sport fishing'),
        (rainbow_trout_id, 'South America', 'CHL', 'Patagonia', false, 'common', 'Successfully introduced')
    ON CONFLICT DO NOTHING;
    
    -- Largemouth Bass distribution
    INSERT INTO fish_distribution (fish_id, region, country_code, state_province, native, abundance, notes)
    VALUES 
        (largemouth_bass_id, 'North America', 'USA', 'Florida', true, 'abundant', 'Native range, optimal habitat'),
        (largemouth_bass_id, 'North America', 'USA', 'Texas', true, 'abundant', 'Native range with extensive lake systems'),
        (largemouth_bass_id, 'North America', 'USA', 'California', false, 'common', 'Introduced and widely stocked'),
        (largemouth_bass_id, 'Asia', 'JPN', 'Honshu', false, 'common', 'Popular introduced gamefish'),
        (largemouth_bass_id, 'Europe', 'ESP', 'Catalonia', false, 'uncommon', 'Limited introduction in reservoirs')
    ON CONFLICT DO NOTHING;
    
END $$;

-- ============================================================================
-- VERIFICATION AND SUMMARY
-- ============================================================================

-- Display summary of inserted data
SELECT 
    'Database seeded successfully!' as status,
    (SELECT COUNT(*) FROM taxonomic_ranks) as taxonomy_count,
    (SELECT COUNT(*) FROM fish_species) as species_count,
    (SELECT COUNT(*) FROM fishing_techniques) as techniques_count,
    (SELECT COUNT(*) FROM species_techniques) as species_technique_links,
    (SELECT COUNT(*) FROM fish_distribution) as distribution_records;