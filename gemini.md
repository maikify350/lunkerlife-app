# LuckerLife Fish Database Management Tool - Project Constitution

## Mission Statement
Build a deterministic, self-healing internal web application for managing fish reference data and images that will be seeded into a fishing mobile app. This tool prioritizes data integrity, scientific accuracy, and ease of use.

## Core Behavioral Rules (THE LAW)

### Data Integrity Rules
- All fish data must be scientifically accurate and follow taxonomic standards
- Scientific names must be unique and properly formatted (Genus species)
- Images must be properly categorized, verified, and tagged
- All database operations must be auditable and reversible
- Export functionality must maintain data consistency for mobile app consumption

### User Experience Rules
- Simple to use with good UI design
- Mobile-responsive for field use
- Fast search and filtering capabilities
- Intuitive taxonomy navigation
- Clear visual feedback for all operations
- **UI/UX Design**: Must follow two-panel layout specifications detailed in `UI-UX.md`

### Security & Access Rules
- All API keys stored in environment variables only
- Row Level Security (RLS) enabled on all database tables
- Image uploads require authentication
- Data export requires admin privileges
- All schema changes must go through MCP server

## Database Schema (ARCHITECTURAL INVARIANTS)

### Core Tables Structure

```sql
-- Taxonomic hierarchy supporting scientific classification
CREATE TABLE taxonomic_ranks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rank_type VARCHAR(50) NOT NULL CHECK (rank_type IN ('kingdom', 'phylum', 'class', 'order', 'family', 'genus')),
    name VARCHAR(255) NOT NULL,
    parent_id UUID REFERENCES taxonomic_ranks(id),
    authority VARCHAR(255),
    year_described INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(rank_type, name, parent_id)
);

-- Fish species with comprehensive scientific and practical data
CREATE TABLE fish_species (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scientific_name VARCHAR(255) UNIQUE NOT NULL,
    genus_id UUID REFERENCES taxonomic_ranks(id),
    species_name VARCHAR(100) NOT NULL,
    
    -- Multi-language common names
    common_names JSONB NOT NULL DEFAULT '{}',
    
    -- Descriptive information
    description TEXT,
    
    -- Physical characteristics
    physical_characteristics JSONB DEFAULT '{}', -- {averageLength, maxLength, averageWeight, maxWeight, bodyShape, colorPattern}
    
    -- Habitat and environmental data
    habitat_data JSONB DEFAULT '{}', -- {waterType, depth, temperature, environment, preferredDepth}
    
    -- Conservation and status
    conservation_status VARCHAR(10) CHECK (conservation_status IN ('LC', 'NT', 'VU', 'EN', 'CR', 'EW', 'EX')),
    
    -- Fishing-specific information
    fishing_info JSONB DEFAULT '{}', -- {commercialValue, gamefish, seasonality, bestBaits, techniques}
    
    -- Metadata
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

-- Image management with comprehensive metadata
CREATE TABLE fish_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fish_id UUID NOT NULL REFERENCES fish_species(id) ON DELETE CASCADE,
    
    -- Image categorization
    image_type VARCHAR(50) NOT NULL CHECK (image_type IN ('profile', 'lateral', 'dorsal', 'ventral', 'head', 'detail', 'habitat', 'juvenile', 'adult')),
    
    -- File storage
    file_path VARCHAR(500) NOT NULL,
    thumbnail_path VARCHAR(500),
    
    -- Image metadata
    alt_text VARCHAR(255),
    file_size INTEGER,
    width INTEGER,
    height INTEGER,
    format VARCHAR(10),
    
    -- Content metadata
    metadata JSONB DEFAULT '{}', -- {photographer, location, date, tags, equipment}
    
    -- Verification and quality
    verified BOOLEAN DEFAULT FALSE,
    quality_score INTEGER CHECK (quality_score >= 1 AND quality_score <= 5),
    
    -- Ordering and display
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_by UUID
);

-- Geographic distribution tracking
CREATE TABLE fish_distribution (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fish_id UUID NOT NULL REFERENCES fish_species(id) ON DELETE CASCADE,
    
    -- Geographic information
    region VARCHAR(255) NOT NULL,
    country_code VARCHAR(3),
    state_province VARCHAR(255),
    
    -- Distribution details
    native BOOLEAN DEFAULT TRUE,
    abundance VARCHAR(50) CHECK (abundance IN ('abundant', 'common', 'uncommon', 'rare', 'extinct')),
    
    -- Coordinates for mapping
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Additional notes
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fishing techniques and methods
CREATE TABLE fishing_techniques (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    equipment_needed TEXT[],
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

-- User management for access control
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Indexes for Performance

```sql
-- Search and filtering indexes
CREATE INDEX idx_fish_species_scientific_name ON fish_species(scientific_name);
CREATE INDEX idx_fish_species_genus ON fish_species(genus_id);
CREATE INDEX idx_fish_species_common_names ON fish_species USING GIN(common_names);
CREATE INDEX idx_fish_species_habitat ON fish_species USING GIN(habitat_data);

-- Image management indexes
CREATE INDEX idx_fish_images_fish_id ON fish_images(fish_id);
CREATE INDEX idx_fish_images_type ON fish_images(image_type);
CREATE INDEX idx_fish_images_verified ON fish_images(verified);

-- Geographic indexes
CREATE INDEX idx_fish_distribution_fish_id ON fish_distribution(fish_id);
CREATE INDEX idx_fish_distribution_region ON fish_distribution(region);
CREATE INDEX idx_fish_distribution_coords ON fish_distribution(latitude, longitude);

-- Taxonomic indexes
CREATE INDEX idx_taxonomic_ranks_parent ON taxonomic_ranks(parent_id);
CREATE INDEX idx_taxonomic_ranks_type_name ON taxonomic_ranks(rank_type, name);
```

### Row Level Security Policies

```sql
-- Enable RLS on all tables
ALTER TABLE fish_species ENABLE ROW LEVEL SECURITY;
ALTER TABLE fish_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE fish_distribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE fishing_techniques ENABLE ROW LEVEL SECURITY;
ALTER TABLE species_techniques ENABLE ROW LEVEL SECURITY;
ALTER TABLE taxonomic_ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Basic read access for authenticated users
CREATE POLICY "Allow read access for authenticated users" ON fish_species FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON fish_images FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON fish_distribution FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON fishing_techniques FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON species_techniques FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON taxonomic_ranks FOR SELECT TO authenticated USING (true);

-- Write access based on user roles (to be implemented)
-- CREATE POLICY "Allow write access for editors and admins" ON fish_species FOR ALL TO authenticated USING (check_user_role());
```

## Technology Stack (IMMUTABLE)

### Frontend Architecture
- **React 18** - Component-based UI framework
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first styling framework
- **Shadcn/ui** - Consistent component library
- **React Hook Form** - Form management with validation
- **React Query/TanStack Query** - Server state management
- **React Router** - Client-side routing

### Backend Architecture
- **Supabase PostgreSQL** - Primary database with ACID compliance
- **Supabase Auth** - User authentication and authorization
- **Supabase Storage** - Image and file storage with CDN
- **Supabase Real-time** - Live data synchronization
- **Supabase Edge Functions** - Serverless API endpoints

### Development Tools
- **Vite** - Fast development build tool
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **TypeScript** - Type checking and IntelliSense

### Deployment & Operations
- **Vercel** - Frontend hosting with automatic deployments
- **Supabase Cloud** - Backend infrastructure
- **GitHub** - Version control and CI/CD
- **Supabase MCP** - Database schema management

## API Design Patterns

### REST Endpoints for Mobile App
```typescript
// Fish species endpoints
GET /api/v1/species                     // List with pagination, filtering
GET /api/v1/species/:id                 // Individual species details
GET /api/v1/species/search              // Search with query parameters
GET /api/v1/species/:id/images          // Species images
GET /api/v1/species/:id/distribution    // Geographic data

// Taxonomy endpoints
GET /api/v1/taxonomy/families           // List fish families
GET /api/v1/taxonomy/:rank/:name        // Get taxonomic info

// Location-based queries
GET /api/v1/species/near/:lat/:lng/:radius  // Species near coordinates
GET /api/v1/species/region/:region         // Species by region

// Fishing information
GET /api/v1/species/:id/techniques      // Recommended techniques
GET /api/v1/species/:id/seasons         // Seasonal availability
```

### Data Export Formats
- **JSON** - Mobile app consumption
- **CSV** - Spreadsheet compatibility
- **Darwin Core Archive (DwC-A)** - Scientific data standards
- **JSON-LD** - Linked data format

## Maintenance & Operations

### Backup Strategy
- Automated daily database backups via Supabase
- Image storage redundancy with CDN
- Version control for schema changes
- Export capabilities for data portability

### Monitoring & Logging
- Application performance monitoring
- Database query performance tracking
- Image upload and processing logs
- User activity audit trails

### Update Procedures
- Schema changes via MCP server only
- Staged deployments (dev → staging → production)
- Rollback procedures for failed deployments
- Data migration scripts for schema updates

---

*This document serves as the single source of truth for the LuckerLife project. All development decisions must align with these architectural invariants and behavioral rules.*

**Last Updated**: January 22, 2026
**Version**: 1.0
**Status**: Active Constitution