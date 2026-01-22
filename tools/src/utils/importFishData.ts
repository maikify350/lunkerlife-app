// Utility to import fish data from Google Sheets or CSV
import { supabase } from '../services/supabase'
import { FishFormData } from '../types/fish'

// Function to convert Google Sheets data to our database format
export const convertSpreadsheetToFish = (rowData: any): FishFormData => {
  // Handle different possible field name variations from Google Sheets
  const getValue = (fieldVariations: string[]): string | undefined => {
    for (const field of fieldVariations) {
      if (rowData[field] !== undefined && rowData[field] !== null && rowData[field] !== '') {
        return String(rowData[field]).trim()
      }
    }
    return undefined
  }

  const getNumericValue = (fieldVariations: string[]): number | undefined => {
    const value = getValue(fieldVariations)
    if (!value) return undefined
    const num = parseFloat(value)
    return isNaN(num) ? undefined : num
  }

  const getBooleanValue = (fieldVariations: string[]): boolean => {
    const value = getValue(fieldVariations)
    if (!value) return false
    const normalized = value.toLowerCase().trim()
    return normalized === 'yes' || normalized === 'true' || normalized === '1'
  }

  return {
    // Required field
    common_name: getValue(['Common Name', 'common_name', 'CommonName']) || 'Unknown',
    
    // Optional fields matching spreadsheet columns
    also_known_as: getValue(['Also Known As', 'also_known_as', 'AlsoKnownAs', 'Alternative Names']),
    invasive: getBooleanValue(['Invasive?', 'invasive', 'Invasive', 'IsInvasive']),
    description: getValue(['Description', 'description']),
    family: getValue(['Family', 'family']),
    species: getValue(['Species', 'species', 'Scientific Name', 'ScientificName']),
    environmental_status: getValue(['Environmental Status', 'environmental_status', 'EnvironmentalStatus', 'Conservation Status']),
    habitat: getValue(['Habitat', 'habitat']),
    fishing_techniques: getValue(['Fishing Techniques', 'fishing_techniques', 'FishingTechniques', 'Techniques']),
    spawning_habits_lifecycle: getValue(['Spawning Habits/Lifecycle', 'spawning_habits_lifecycle', 'Spawning', 'Lifecycle']),
    diet_feeding_habits: getValue(['Diet/Feeding Habits', 'diet_feeding_habits', 'Diet', 'Feeding']),
    range_distribution: getValue(['Range', 'range_distribution', 'Distribution', 'Geographic Range']),
    water_body_type: getValue(['Water Body Type', 'water_body_type', 'WaterBodyType', 'Water Type']),
    avg_adult_weight_lbs: getNumericValue(['Avg Adult Weight (lbs)', 'avg_adult_weight_lbs', 'Weight', 'Average Weight']),
    known_for: getValue(['Known For', 'known_for', 'KnownFor', 'Notable For']),
    avg_adult_length_inches: getNumericValue(['Avg Adult Length (in)', 'avg_adult_length_inches', 'Length', 'Average Length']),
    world_record: getValue(['World Record', 'world_record', 'WorldRecord', 'Record']),
    image: getValue(['Image', 'image', 'Photo']),
    image_name_location: getValue(['Image Name & Location', 'image_name_location', 'Image Location', 'Photo Location'])
  }
}

// Function to import a single fish record
export const importFishRecord = async (fishData: FishFormData): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('fish_species')
      .insert([fishData])
      .select()

    if (error) {
      console.error('Error importing fish:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error importing fish:', error)
    return { success: false, error: String(error) }
  }
}

// Function to import multiple fish records from array
export const importMultipleFish = async (
  fishArray: any[], 
  onProgress?: (current: number, total: number, fishName: string) => void
): Promise<{ success: number; failed: number; errors: string[] }> => {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[]
  }

  for (let i = 0; i < fishArray.length; i++) {
    const rawData = fishArray[i]
    const fishData = convertSpreadsheetToFish(rawData)
    
    // Skip rows without common name
    if (!fishData.common_name || fishData.common_name === 'Unknown') {
      continue
    }

    onProgress?.(i + 1, fishArray.length, fishData.common_name)

    const result = await importFishRecord(fishData)
    
    if (result.success) {
      results.success++
    } else {
      results.failed++
      results.errors.push(`${fishData.common_name}: ${result.error}`)
    }

    // Small delay to prevent overwhelming the database
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  return results
}

// Function to validate spreadsheet data before import
export const validateSpreadsheetData = (data: any[]): { valid: boolean; issues: string[] } => {
  const issues: string[] = []
  
  if (!Array.isArray(data) || data.length === 0) {
    issues.push('No data found or data is not in array format')
    return { valid: false, issues }
  }

  const sampleRow = data[0]
  const expectedFields = ['Common Name', 'common_name', 'CommonName']
  const hasCommonName = expectedFields.some(field => field in sampleRow)
  
  if (!hasCommonName) {
    issues.push('No "Common Name" field found in data')
  }

  const rowsWithNames = data.filter(row => {
    const name = expectedFields.find(field => row[field])
    return name && String(row[name]).trim().length > 0
  })

  if (rowsWithNames.length === 0) {
    issues.push('No rows with valid common names found')
  }

  issues.push(`Found ${rowsWithNames.length} valid fish records out of ${data.length} total rows`)

  return { valid: issues.length <= 1, issues } // Only the count message is not an error
}

// Function to parse CSV data
export const parseCSVData = (csvText: string): any[] => {
  const lines = csvText.split('\n').filter(line => line.trim().length > 0)
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
  const data = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
    const row: any = {}
    
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    
    data.push(row)
  }

  return data
}