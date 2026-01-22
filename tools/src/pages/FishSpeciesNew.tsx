import { FC, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../services/supabase'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { FishSpecies } from '../types/fish'

const FishSpeciesNew: FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [invasiveFilter, setInvasiveFilter] = useState<string>('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Query fish species data with new schema
  const { 
    data: species, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['fish-species', searchTerm, invasiveFilter],
    queryFn: async () => {
      let query = supabase
        .from('fish_species')
        .select('*')
        .order('common_name')

      if (searchTerm) {
        query = query.or(`common_name.ilike.%${searchTerm}%,also_known_as.ilike.%${searchTerm}%,species.ilike.%${searchTerm}%`)
      }

      if (invasiveFilter === 'invasive') {
        query = query.eq('invasive', true)
      } else if (invasiveFilter === 'native') {
        query = query.eq('invasive', false)
      }

      const { data, error } = await query.limit(50)
      
      if (error) {
        console.error('Error fetching fish species:', error)
        throw error
      }
      
      return data as FishSpecies[]
    },
    retry: 1,
  })

  const formatAlternativeNames = (alsoKnownAs?: string) => {
    if (!alsoKnownAs) return 'No alternative names'
    const names = alsoKnownAs.split(',').map(name => name.trim()).slice(0, 3)
    return names.join(', ')
  }

  const getInvasiveStatusColor = (invasive: boolean) => {
    return invasive 
      ? 'bg-red-100 text-red-800 border-red-200' 
      : 'bg-green-100 text-green-800 border-green-200'
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Fish Species Database</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Fish Species Database</h1>
        
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Database Not Set Up</h3>
              <p className="text-gray-600 mb-4">
                The fish species database needs to be initialized with your spreadsheet structure.
              </p>
              <div className="space-y-2 text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                <p><strong>Run these SQL scripts in Supabase Dashboard:</strong></p>
                <p>1. <code>database/migrations/002_actual_fish_schema.sql</code></p>
                <p>2. <code>database/seeds/003_spreadsheet_sample_data.sql</code></p>
                <p className="text-xs mt-2">This will create the correct 19-field structure from your Google Sheets</p>
              </div>
              <Button onClick={() => refetch()} className="mt-4">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fish Species Database</h1>
          <p className="text-gray-600 mt-1">
            Freshwater fish data from your spreadsheet - {species?.length || 0} species
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddModalOpen(true)}>
            ➕ Add Fish Species
          </Button>
          <Button variant="secondary">
            📊 Import from Sheets
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by common name, scientific name, or alternative names..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={invasiveFilter}
                onChange={(e) => setInvasiveFilter(e.target.value)}
              >
                <option value="">All Species</option>
                <option value="native">Native Species</option>
                <option value="invasive">Invasive Species</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option value="">All Water Types</option>
                <option value="Lakes">Lakes</option>
                <option value="Rivers">Rivers</option>
                <option value="Ponds">Ponds</option>
                <option value="Streams">Streams</option>
                <option value="Ocean">Ocean</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {species?.length || 0} fish species • {species?.filter(f => f.invasive).length || 0} invasive • {species?.filter(f => !f.invasive).length || 0} native
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">Export CSV</Button>
          <Button variant="ghost" size="sm">Export to Sheets</Button>
        </div>
      </div>

      {/* Species Grid */}
      {species && species.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {species.map((fish) => (
            <Card key={fish.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-ocean-700">
                      {fish.common_name}
                    </CardTitle>
                    {fish.species && (
                      <p className="text-sm italic text-gray-600">{fish.species}</p>
                    )}
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getInvasiveStatusColor(fish.invasive)}`}>
                    {fish.invasive ? 'Invasive' : 'Native'}
                  </span>
                </div>
                
                {fish.also_known_as && (
                  <p className="text-sm text-gray-500">
                    Also: {formatAlternativeNames(fish.also_known_as)}
                  </p>
                )}
              </CardHeader>
              
              <CardContent className="space-y-3">
                {/* Family */}
                {fish.family && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 mr-2">🏷️</span>
                    <span className="font-medium">Family:</span>
                    <span className="ml-1">{fish.family}</span>
                  </div>
                )}

                {/* Size Info */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {fish.avg_adult_length_inches && (
                    <div className="flex items-center text-gray-600">
                      <span className="w-4 h-4 mr-1">📏</span>
                      <span>{fish.avg_adult_length_inches}"</span>
                    </div>
                  )}
                  {fish.avg_adult_weight_lbs && (
                    <div className="flex items-center text-gray-600">
                      <span className="w-4 h-4 mr-1">⚖️</span>
                      <span>{fish.avg_adult_weight_lbs} lbs</span>
                    </div>
                  )}
                </div>

                {/* Water Body Type */}
                {fish.water_body_type && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 mr-2">🌊</span>
                    {fish.water_body_type}
                  </div>
                )}

                {/* Known For */}
                {fish.known_for && (
                  <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                    <strong>Known for:</strong> {fish.known_for}
                  </p>
                )}

                {/* Description Preview */}
                {fish.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {fish.description.length > 120 
                      ? `${fish.description.substring(0, 120)}...`
                      : fish.description
                    }
                  </p>
                )}

                {/* World Record */}
                {fish.world_record && fish.world_record !== 'Not typically targeted by anglers' && (
                  <p className="text-xs text-coral-600 bg-coral-50 p-2 rounded">
                    🏆 Record: {fish.world_record}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="ghost" size="sm">View Full Details</Button>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🐟</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Fish Species Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms or filters'
                  : 'Import your fish data from the Google Sheets to get started'
                }
              </p>
              <Button onClick={() => setIsAddModalOpen(true)}>
                ➕ Add Fish Species
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Species Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">Add New Fish Species</h3>
            <p className="text-gray-600 mb-4">
              This form will include all 19 fields from your spreadsheet:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
              <div>• Common Name</div>
              <div>• Also Known As</div>
              <div>• Scientific Species</div>
              <div>• Family</div>
              <div>• Invasive Status</div>
              <div>• Environmental Status</div>
              <div>• Description</div>
              <div>• Habitat</div>
              <div>• Fishing Techniques</div>
              <div>• Diet/Feeding Habits</div>
              <div>• Spawning Habits</div>
              <div>• Range/Distribution</div>
              <div>• Water Body Type</div>
              <div>• Avg Weight (lbs)</div>
              <div>• Avg Length (inches)</div>
              <div>• Known For</div>
              <div>• World Record</div>
              <div>• Image & Location</div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setIsAddModalOpen(false)}>
                Close
              </Button>
              <Button variant="secondary" disabled>
                Build Form Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FishSpeciesNew