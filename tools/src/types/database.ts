// Database types for LuckerLife Fish Database
// Generated from the schema in gemini.md

export interface Database {
  public: {
    Tables: {
      fish_species: {
        Row: FishSpecies
        Insert: Omit<FishSpecies, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<FishSpecies, 'id' | 'created_at'>>
      }
      fish_images: {
        Row: FishImage
        Insert: Omit<FishImage, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<FishImage, 'id' | 'created_at'>>
      }
      taxonomic_ranks: {
        Row: TaxonomicRank
        Insert: Omit<TaxonomicRank, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<TaxonomicRank, 'id' | 'created_at'>>
      }
      fish_distribution: {
        Row: FishDistribution
        Insert: Omit<FishDistribution, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<FishDistribution, 'id' | 'created_at'>>
      }
      fishing_techniques: {
        Row: FishingTechnique
        Insert: Omit<FishingTechnique, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<FishingTechnique, 'id' | 'created_at'>>
      }
      species_techniques: {
        Row: SpeciesTechnique
        Insert: Omit<SpeciesTechnique, 'created_at' | 'updated_at'>
        Update: Partial<Omit<SpeciesTechnique, 'fish_id' | 'technique_id' | 'created_at'>>
      }
      user_profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserProfile, 'id' | 'created_at'>>
      }
    }
    Views: {
      species_with_taxonomy: {
        Row: SpeciesWithTaxonomy
      }
      species_with_images: {
        Row: SpeciesWithImages
      }
    }
  }
}

// Core entity types
export interface FishSpecies {
  id: string
  scientific_name: string
  genus_id?: string
  species_name: string
  common_names: Record<string, string[]> // Multi-language common names
  description?: string
  physical_characteristics: PhysicalCharacteristics
  habitat_data: HabitatData
  conservation_status?: ConservationStatus
  fishing_info: FishingInfo
  verified: boolean
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

export interface FishImage {
  id: string
  fish_id: string
  image_type: ImageType
  file_path: string
  thumbnail_path?: string
  alt_text?: string
  file_size?: number
  width?: number
  height?: number
  format?: string
  metadata: ImageMetadata
  verified: boolean
  quality_score?: number
  display_order: number
  is_primary: boolean
  created_at: string
  updated_at: string
  uploaded_by?: string
}

export interface TaxonomicRank {
  id: string
  rank_type: TaxonomicRankType
  name: string
  parent_id?: string
  authority?: string
  year_described?: number
  created_at: string
  updated_at: string
}

export interface FishDistribution {
  id: string
  fish_id: string
  region: string
  country_code?: string
  state_province?: string
  native: boolean
  abundance?: AbundanceLevel
  latitude?: number
  longitude?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface FishingTechnique {
  id: string
  name: string
  description?: string
  equipment_needed: string[]
  skill_level?: SkillLevel
  created_at: string
  updated_at: string
}

export interface SpeciesTechnique {
  fish_id: string
  technique_id: string
  effectiveness_rating?: number
  seasonal_notes?: string
  best_conditions?: string
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  role: UserRole
  created_at: string
  updated_at: string
}

// Complex data types stored as JSONB
export interface PhysicalCharacteristics {
  averageLength?: {
    value: number
    unit: string
  }
  maxLength?: {
    value: number
    unit: string
  }
  averageWeight?: {
    value: number
    unit: string
  }
  maxWeight?: {
    value: number
    unit: string
  }
  bodyShape?: string
  colorPattern?: string
}

export interface HabitatData {
  waterType?: 'freshwater' | 'saltwater' | 'brackish'
  temperatureRange?: {
    min: number
    max: number
    unit: string
  }
  depth?: {
    min: number
    max: number
    unit: string
  }
  preferredDepth?: {
    min: number
    max: number
    unit: string
  }
  environment?: string
}

export interface FishingInfo {
  commercialValue?: 'high' | 'medium' | 'low'
  gamefish?: boolean
  seasonality?: string
  bestBaits?: string[]
  techniques?: string[]
}

export interface ImageMetadata {
  photographer?: string
  location?: {
    lat: number
    lon: number
  }
  date?: string
  tags?: string[]
  equipment?: string
  source?: string
}

// View types
export interface SpeciesWithTaxonomy extends FishSpecies {
  genus_name?: string
  family_name?: string
  order_name?: string
  class_name?: string
  phylum_name?: string
  kingdom_name?: string
}

export interface SpeciesWithImages extends FishSpecies {
  primary_image?: string
  primary_thumbnail?: string
}

// Enum types
export type TaxonomicRankType = 'kingdom' | 'phylum' | 'class' | 'order' | 'family' | 'genus'

export type ImageType = 
  | 'profile' 
  | 'lateral' 
  | 'dorsal' 
  | 'ventral' 
  | 'head' 
  | 'detail' 
  | 'habitat' 
  | 'juvenile' 
  | 'adult' 
  | 'male' 
  | 'female' 
  | 'spawning'

export type ConservationStatus = 'LC' | 'NT' | 'VU' | 'EN' | 'CR' | 'EW' | 'EX'

export type AbundanceLevel = 'abundant' | 'common' | 'uncommon' | 'rare' | 'extinct'

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export type UserRole = 'admin' | 'editor' | 'viewer'