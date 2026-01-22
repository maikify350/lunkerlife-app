import { FC, useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../services/supabase'
import { FishSpecies } from '../types/fish'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

interface SortOption {
  label: string
  value: string
  field: string
  direction: 'asc' | 'desc'
  show: boolean
}

interface ImageModalProps {
  isOpen: boolean
  imageUrl: string
  onClose: () => void
}

interface ImageGalleryProps {
  isOpen: boolean
  fishId: string
  onClose: () => void
  onImageSelect: (imageUrl: string) => void
}

interface UploadModalProps {
  isOpen: boolean
  fishId: string
  onClose: () => void
  onUploadSuccess: () => void
}

const FishRecordManager: FC = () => {
  // State management
  const [selectedFishId, setSelectedFishId] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<'all' | 'fresh' | 'salt'>('all')
  const [sortOption, setSortOption] = useState('common_name_asc')
  const [sortOptions, setSortOptions] = useState<SortOption[]>([])
  const [formData, setFormData] = useState<Partial<FishSpecies>>({})
  const [isDirty, setIsDirty] = useState(false)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  const queryClient = useQueryClient()

  // Load sorting options
  useEffect(() => {
    const loadSortingOptions = async () => {
      try {
        const response = await fetch('/sorting.json')
        const options: SortOption[] = await response.json()
        setSortOptions(options.filter(opt => opt.show))
      } catch (error) {
        console.error('Failed to load sorting options:', error)
        // Fallback sorting options
        setSortOptions([
          { label: 'Common Name (A-Z)', value: 'common_name_asc', field: 'common_name', direction: 'asc', show: true }
        ])
      }
    }
    loadSortingOptions()
  }, [])

  // Fish list query with filtering and sorting
  const { data: fishList, isLoading } = useQuery({
    queryKey: ['fish-list', activeFilter, sortOption],
    queryFn: async () => {
      const selectedSort = sortOptions.find(opt => opt.value === sortOption)
      
      let query = supabase
        .from('fish_species')
        .select('*')

          // Apply filter (using invasive field since class column may not exist yet)
          if (activeFilter === 'fresh') {
            // For now, treat non-invasive as "fresh" until class column is added
            query = query.eq('invasive', false)
          } else if (activeFilter === 'salt') {
            // For now, treat invasive as "salt" until class column is added  
            query = query.eq('invasive', true)
          }

      // Apply sorting
      if (selectedSort) {
        query = query.order(selectedSort.field, { ascending: selectedSort.direction === 'asc' })
      }

      const { data, error } = await query.limit(200)
      
      if (error) {
        console.error('Error fetching fish list:', error)
        throw error
      }
      
      return data as FishSpecies[]
    },
    enabled: sortOptions.length > 0,
  })

  // Selected fish details query
  const { data: selectedFish } = useQuery({
    queryKey: ['fish-details', selectedFishId],
    queryFn: async () => {
      if (!selectedFishId) return null
      
      const { data, error } = await supabase
        .from('fish_species')
        .select('*')
        .eq('id', selectedFishId)
        .single()
      
      if (error) {
        console.error('Error fetching fish details:', error)
        throw error
      }
      
      return data as FishSpecies
    },
    enabled: !!selectedFishId,
  })

  // Update form data when selected fish changes
  useEffect(() => {
    if (selectedFish) {
      setFormData(selectedFish)
      setIsDirty(false)
    }
  }, [selectedFish])

  // Save fish mutation
  const saveFishMutation = useMutation({
    mutationFn: async (fishData: Partial<FishSpecies>) => {
      if (!selectedFishId) throw new Error('No fish selected')
      
      const updateData = {
        ...fishData,
        updated_at: new Date().toISOString(),
        updated_by: 'Admin'
      }
      
      const { data, error } = await supabase
        .from('fish_species')
        .update(updateData)
        .eq('id', selectedFishId)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fish-list'] })
      queryClient.invalidateQueries({ queryKey: ['fish-details'] })
      setIsDirty(false)
    },
  })

  // Handle form field changes
  const handleFieldChange = (field: keyof FishSpecies, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setIsDirty(true)
  }

  // Handle save
  const handleSave = () => {
    if (isDirty) {
      saveFishMutation.mutate(formData)
    }
  }

  // Handle fish selection
  const handleFishSelect = (fishId: string) => {
    if (isDirty) {
      const confirmLeave = confirm('You have unsaved changes. Are you sure you want to leave?')
      if (!confirmLeave) return
    }
    setSelectedFishId(fishId)
  }

  // Handle image double-click
  const handleImageDoubleClick = () => {
    if (formData.image) {
      setImageModalOpen(true)
    }
  }

  return (
    <div className="h-screen flex">
      {/* LEFT PANEL - Navigator */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Filter Pills */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'fresh', label: 'Fresh' },
              { key: 'salt', label: 'Salt' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key as 'all' | 'fresh' | 'salt')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === filter.key
                    ? 'bg-ocean-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="p-4 border-b border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Fish List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-3 rounded border animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2">
              {fishList?.map((fish) => (
                <div
                  key={fish.id}
                  onClick={() => handleFishSelect(fish.id)}
                  className={`p-3 rounded cursor-pointer mb-1 transition-colors ${
                    selectedFishId === fish.id
                      ? 'bg-ocean-100 border border-ocean-300'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-gray-900">{fish.common_name}</div>
                  {fish.species && (
                    <div className="text-sm text-gray-600 italic">{fish.species}</div>
                  )}
                </div>
              ))}
              
              {fishList?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No fish found for the selected filter
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL - Details Editor */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedFish ? (
          <>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{selectedFish.common_name}</h2>
                <Button
                  onClick={handleSave}
                  disabled={!isDirty || saveFishMutation.isPending}
                  className={`px-6 py-2 rounded-full ${
                    isDirty
                      ? 'bg-ocean-600 hover:bg-ocean-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {saveFishMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Image Section */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Fish Image</h3>
                <div className="flex items-start gap-4">
                  {/* Current Image Display */}
                  <div className="flex-shrink-0">
                    {formData.image ? (
                      <img
                        src={`/database/seeds/fish_images/${formData.image}`}
                        alt={formData.common_name}
                        className="w-48 h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                        onDoubleClick={handleImageDoubleClick}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder-fish.png'
                        }}
                      />
                    ) : (
                      <div className="w-48 h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Image Controls */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image Location
                      </label>
                      <div className="flex gap-2">
                        <Input
                          value={formData.image_name_location || ''}
                          onChange={(e) => handleFieldChange('image_name_location', e.target.value)}
                          placeholder="Image filename or location"
                          className="flex-1"
                        />
                        <Button
                          onClick={() => setUploadModalOpen(true)}
                          variant="secondary"
                          size="sm"
                        >
                          Upload Image
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={() => setGalleryOpen(true)}
                      variant="secondary"
                      size="sm"
                    >
                      View Image Gallery
                    </Button>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Common Name
                    </label>
                    <Input
                      value={formData.common_name || ''}
                      onChange={(e) => handleFieldChange('common_name', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Scientific Species
                    </label>
                    <Input
                      value={formData.species || ''}
                      onChange={(e) => handleFieldChange('species', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Family
                    </label>
                    <Input
                      value={formData.family || ''}
                      onChange={(e) => handleFieldChange('family', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Environmental Status
                    </label>
                    <Input
                      value={formData.environmental_status || ''}
                      onChange={(e) => handleFieldChange('environmental_status', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Also Known As
                    </label>
                    <Input
                      value={formData.also_known_as || ''}
                      onChange={(e) => handleFieldChange('also_known_as', e.target.value)}
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="invasive"
                      checked={formData.invasive || false}
                      onChange={(e) => handleFieldChange('invasive', e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="invasive" className="text-sm font-medium text-gray-700">
                      Invasive Species
                    </label>
                  </div>
                </div>
              </div>

              {/* Physical Characteristics */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Physical Characteristics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Average Adult Length (inches)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.avg_adult_length_inches || ''}
                      onChange={(e) => handleFieldChange('avg_adult_length_inches', e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Average Adult Weight (lbs)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.avg_adult_weight_lbs || ''}
                      onChange={(e) => handleFieldChange('avg_adult_weight_lbs', e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </div>
                </div>
              </div>

              {/* Habitat & Environment */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Habitat & Environment</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Water Body Type
                      </label>
                      <Input
                        value={formData.water_body_type || ''}
                        onChange={(e) => handleFieldChange('water_body_type', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Range/Distribution
                      </label>
                      <Input
                        value={formData.range_distribution || ''}
                        onChange={(e) => handleFieldChange('range_distribution', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Habitat Description
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      rows={3}
                      value={formData.habitat || ''}
                      onChange={(e) => handleFieldChange('habitat', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Fields */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      rows={4}
                      value={formData.description || ''}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Diet & Feeding Habits
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      rows={3}
                      value={formData.diet_feeding_habits || ''}
                      onChange={(e) => handleFieldChange('diet_feeding_habits', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fishing Techniques
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      rows={3}
                      value={formData.fishing_techniques || ''}
                      onChange={(e) => handleFieldChange('fishing_techniques', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Known For
                    </label>
                    <Input
                      value={formData.known_for || ''}
                      onChange={(e) => handleFieldChange('known_for', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      World Record
                    </label>
                    <Input
                      value={formData.world_record || ''}
                      onChange={(e) => handleFieldChange('world_record', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* No Selection State */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🐟</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Select a Fish</h3>
              <p className="text-gray-600">
                Choose a fish from the list on the left to view and edit its details.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={imageModalOpen}
        imageUrl={formData.image ? `/database/seeds/fish_images/${formData.image}` : ''}
        onClose={() => setImageModalOpen(false)}
      />

      {/* Image Gallery Modal */}
      <ImageGallery
        isOpen={galleryOpen}
        fishId={selectedFishId || ''}
        onClose={() => setGalleryOpen(false)}
        onImageSelect={(imageUrl) => {
          handleFieldChange('image', imageUrl)
          setGalleryOpen(false)
        }}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        fishId={selectedFishId || ''}
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={() => {
          setUploadModalOpen(false)
          // Refresh the fish data
          queryClient.invalidateQueries({ queryKey: ['fish-details'] })
        }}
      />
    </div>
  )
}

// Image Modal Component
const ImageModal: FC<ImageModalProps> = ({ isOpen, imageUrl, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose} />
      <div className="relative bg-white rounded-lg p-4 max-w-4xl max-h-4xl">
        <button
          onClick={onClose}
          className="absolute top-2 left-2 w-8 h-8 bg-gray-800 bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 z-10"
        >
          ×
        </button>
        <img
          src={imageUrl}
          alt="Fish"
          className="max-w-full max-h-full"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/placeholder-fish.png'
          }}
        />
      </div>
    </div>
  )
}

// Image Gallery Component (placeholder)
const ImageGallery: FC<ImageGalleryProps> = ({ isOpen, fishId, onClose, onImageSelect }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg p-6 max-w-4xl max-h-4xl w-full m-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Image Gallery</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <div className="text-center py-8 text-gray-500">
          Image gallery functionality coming soon...
        </div>
      </div>
    </div>
  )
}

// Upload Modal Component (placeholder)
const UploadModal: FC<UploadModalProps> = ({ isOpen, fishId, onClose, onUploadSuccess }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg p-6 max-w-md w-full m-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Upload Image</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <div className="text-center py-8 text-gray-500">
          Image upload functionality coming soon...
        </div>
      </div>
    </div>
  )
}

export default FishRecordManager