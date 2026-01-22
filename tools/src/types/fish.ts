// Database types for LuckerLife Fish Database - Matching Spreadsheet Structure
// Based on the 19 fields from Google Sheets

export interface FishSpecies {
  // Primary key
  id: string
  
  // Spreadsheet Column 1: Image
  image?: string
  
  // Spreadsheet Column 2: Image Name & Location  
  image_name_location?: string
  
  // Spreadsheet Column 3: Common Name
  common_name: string
  
  // Spreadsheet Column 4: Also Known As
  also_known_as?: string
  
  // Spreadsheet Column 5: Invasive?
  invasive: boolean
  
  // Spreadsheet Column 6: Description
  description?: string
  
  // Spreadsheet Column 7: Family
  family?: string
  
  // Spreadsheet Column 8: Species (Scientific name)
  species?: string
  
  // Spreadsheet Column 9: Environmental Status
  environmental_status?: string
  
  // Spreadsheet Column 10: Habitat
  habitat?: string
  
  // Spreadsheet Column 11: Fishing Techniques
  fishing_techniques?: string
  
  // Spreadsheet Column 12: Spawning Habits/Lifecycle
  spawning_habits_lifecycle?: string
  
  // Spreadsheet Column 13: Diet/Feeding Habits
  diet_feeding_habits?: string
  
  // Spreadsheet Column 14: Range
  range_distribution?: string
  
  // Spreadsheet Column 15: Water Body Type
  water_body_type?: string
  
  // Spreadsheet Column 16: Avg Adult Weight (lbs)
  avg_adult_weight_lbs?: number
  
  // Spreadsheet Column 17: Known For
  known_for?: string
  
  // Spreadsheet Column 18: Avg Adult Length (in)
  avg_adult_length_inches?: number
  
  // Spreadsheet Column 19: World Record
  world_record?: string
  
  // Fish category (Fresh/Salt water)
  class?: 'Fresh' | 'Salt'
  
  // System fields
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

// View types for display
export interface FishDisplay {
  id: string
  common_name: string
  species?: string
  family?: string
  invasive: boolean
  environmental_status?: string
  avg_adult_weight_lbs?: number
  avg_adult_length_inches?: number
  water_body_type?: string
  image?: string
  description_preview?: string
  full_description?: string
  also_known_as?: string
  habitat?: string
  fishing_techniques?: string
  known_for?: string
  world_record?: string
  created_at: string
  updated_at: string
}

// Search interface
export interface FishSearchFilters {
  searchTerm?: string
  invasive?: boolean | null
  family?: string
  waterBodyType?: string
  environmentalStatus?: string
  minWeight?: number
  maxWeight?: number
  minLength?: number
  maxLength?: number
}

// Database operations
export interface Database {
  public: {
    Tables: {
      fish_species: {
        Row: FishSpecies
        Insert: Omit<FishSpecies, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<FishSpecies, 'id' | 'created_at'>>
      }
    }
    Views: {
      fish_display: {
        Row: FishDisplay
      }
    }
  }
}

// Form data for creating/editing fish
export interface FishFormData {
  common_name: string
  also_known_as?: string
  invasive: boolean
  description?: string
  family?: string
  species?: string
  environmental_status?: string
  habitat?: string
  fishing_techniques?: string
  spawning_habits_lifecycle?: string
  diet_feeding_habits?: string
  range_distribution?: string
  water_body_type?: string
  avg_adult_weight_lbs?: number
  known_for?: string
  avg_adult_length_inches?: number
  world_record?: string
  image?: string
  image_name_location?: string
}

// Import data structure for CSV/spreadsheet import
export interface FishImportRow {
  Image?: string
  'Image Name & Location'?: string
  'Common Name': string
  'Also Known As'?: string
  'Invasive?'?: string | boolean
  Description?: string
  Family?: string
  Species?: string
  'Environmental Status'?: string
  Habitat?: string
  'Fishing Techniques'?: string
  'Spawning Habits/Lifecycle'?: string
  'Diet/Feeding Habits'?: string
  Range?: string
  'Water Body Type'?: string
  'Avg Adult Weight (lbs)'?: string | number
  'Known For'?: string
  'Avg Adult Length (in)'?: string | number
  'World Record'?: string
}