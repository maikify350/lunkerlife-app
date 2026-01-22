import { FC, useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../services/supabase'
import { Card, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Notification from '../components/ui/Notification'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import FishGallery from '../components/FishGallery'
import { FishSpecies } from '../types/fish'
import { getImageUrl } from '../utils/imageHelpers'
import { useSelection } from '../contexts/SelectionContext'

interface ImagePreviewModalProps {
  isOpen: boolean
  imageUrl: string
  imageName: string
  onClose: () => void
}

const ImagePreviewModal: FC<ImagePreviewModalProps> = ({ isOpen, imageUrl, imageName, onClose }) => {
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative bg-white rounded-lg p-4 max-w-6xl max-h-90vh">
        <button
          onClick={onClose}
          className="absolute top-2 left-2 w-10 h-10 bg-gray-800 bg-opacity-60 text-white rounded-full flex items-center justify-center hover:bg-opacity-80 z-10 text-2xl font-bold"
        >
          ×
        </button>
        <img
          src={imageUrl}
          alt={imageName}
          className="max-w-full max-h-[75vh] object-contain rounded-lg"
          onLoad={(e) => {
            const img = e.currentTarget
            setDimensions({ width: img.naturalWidth, height: img.naturalHeight })
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/placeholder-fish.png'
          }}
        />
        {dimensions && (
          <div className="text-center mt-3 text-sm text-gray-600">
            <p className="font-medium">{imageName}</p>
            <p>Dimensions: {dimensions.width} × {dimensions.height} pixels</p>
          </div>
        )}
      </div>
    </div>
  )
}

const FishManagementTwoPanel: FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [classFilter, setClassFilter] = useState<string>('All')
  const [sortOption, setSortOption] = useState<string>('common_name')
  const [selectedFishId, setSelectedFishId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [fishImages, setFishImages] = useState<any[]>([])
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('')
  const [previewImageName, setPreviewImageName] = useState<string>('')
  const [notification, setNotification] = useState<{
    isOpen: boolean
    title: string
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
  }>({ isOpen: false, title: '', message: '', type: 'info' })
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean
    fishId: string | null
    fishName: string
  }>({ isOpen: false, fishId: null, fishName: '' })
  
  // Use shared selection context
  const { selectedFishIds: selectedRows, setSelectedFishIds: setSelectedRows } = useSelection()

  // Ref for fish list container to enable auto-scrolling
  const fishListRef = useRef<HTMLDivElement>(null)

  const { 
    data: species = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['fish-species', searchTerm, classFilter, sortOption],
    queryFn: async () => {
      let query = supabase
        .from('fish_species')
        .select('*')

      if (searchTerm.trim()) {
        query = query.ilike('common_name', `%${searchTerm.trim()}%`)
      }

      if (classFilter === 'Fresh') {
        query = query.eq('class', 'Fresh')
      } else if (classFilter === 'Salt') {
        query = query.eq('class', 'Salt')
      }

      if (sortOption === 'common_name') {
        query = query.order('common_name')
      } else if (sortOption === 'family') {
        query = query.order('family').order('common_name')
      } else if (sortOption === 'species') {
        query = query.order('species')
      } else if (sortOption === 'size') {
        query = query.order('avg_adult_length_inches', { ascending: true }).order('common_name')
      }

      const { data, error } = await query.limit(100)
      
      if (error) {
        console.error('Error fetching fish species:', error)
        throw error
      }
      
      return (data as FishSpecies[]) || []
    },
    retry: 1,
  })

  const selectedFish = species?.find(fish => fish.id === selectedFishId)

  // Query to fetch fish images when a fish is selected
  const { data: fishImagesData } = useQuery({
    queryKey: ['fish-images', selectedFishId],
    queryFn: async () => {
      if (!selectedFishId) return []
      
      const { data, error } = await supabase
        .from('fish_images')
        .select('*')
        .eq('fish_id', selectedFishId)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching fish images:', error)
        return []
      }
      
      return data || []
    },
    enabled: !!selectedFishId,
    retry: 1,
  })

  // Update fishImages when query data changes
  useEffect(() => {
    if (fishImagesData && fishImagesData.length > 0) {
      setFishImages(fishImagesData)
    } else if (selectedFish?.image_name_location) {
      // If no images in fish_images table, use the image_name_location
      const imageUrl = getImageUrl(selectedFish.image_name_location)
      if (imageUrl) {
        setFishImages([{
          id: 'main-image',
          image: imageUrl,
          url: imageUrl,
          filename: selectedFish.image_name_location,
          is_default: true,
          status: 'active'
        }])
      }
    } else {
      setFishImages([])
    }
  }, [fishImagesData, selectedFish])

  // Mutation: Upload images to Supabase Storage and insert records
  const uploadImagesMutation = async (files: FileList) => {
    if (!selectedFishId) return

    const uploadedImages: any[] = []

    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
      const filePath = `fish-images/${selectedFishId}/${fileName}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('fish-images')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Error uploading image:', uploadError)
        setNotification({
          isOpen: true,
          title: 'Upload Failed',
          message: `Failed to upload ${file.name}: ${uploadError.message}`,
          type: 'error'
        })
        continue
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('fish-images')
        .getPublicUrl(filePath)

      // Insert record into fish_images table
      const { data: insertData, error: insertError } = await supabase
        .from('fish_images')
        .insert({
          fish_id: selectedFishId,
          storage_path: filePath,
          filename: file.name,
          url: publicUrl,
          file_size: file.size,
          is_default: fishImages.length === 0, // First image is default
          status: 'active'
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error inserting image record:', insertError)
        continue
      }

      uploadedImages.push(insertData)
    }

    if (uploadedImages.length > 0) {
      setFishImages(prev => [...uploadedImages, ...prev])
      setNotification({
        isOpen: true,
        title: 'Upload Successful',
        message: `Successfully uploaded ${uploadedImages.length} image(s)`,
        type: 'success'
      })
    }
  }

  // Mutation: Soft delete (move to trash)
  const softDeleteImageMutation = async (imageId: string) => {
    const { error } = await supabase
      .from('fish_images')
      .update({ status: 'hidden', deleted_at: new Date().toISOString() })
      .eq('id', imageId)

    if (error) {
      console.error('Error soft-deleting image:', error)
      setNotification({
        isOpen: true,
        title: 'Delete Failed',
        message: `Failed to move image to trash: ${error.message}`,
        type: 'error'
      })
      return false
    }

    setFishImages(prev => prev.map(img =>
      img.id === imageId
        ? { ...img, status: 'hidden', deleted_at: new Date().toISOString() }
        : img
    ))
    return true
  }

  // Mutation: Restore from trash
  const restoreImageMutation = async (imageId: string) => {
    const { error } = await supabase
      .from('fish_images')
      .update({ status: 'active', deleted_at: null })
      .eq('id', imageId)

    if (error) {
      console.error('Error restoring image:', error)
      setNotification({
        isOpen: true,
        title: 'Restore Failed',
        message: `Failed to restore image: ${error.message}`,
        type: 'error'
      })
      return false
    }

    setFishImages(prev => prev.map(img =>
      img.id === imageId
        ? { ...img, status: 'active', deleted_at: null }
        : img
    ))
    return true
  }

  // Mutation: Permanently delete
  const hardDeleteImageMutation = async (imageId: string, imageRecord: any) => {
    // Delete from storage first
    if (imageRecord.storage_path) {
      const { error: storageError } = await supabase.storage
        .from('fish-images')
        .remove([imageRecord.storage_path])

      if (storageError) {
        console.error('Error deleting from storage:', storageError)
      }
    }

    // Delete from database
    const { error } = await supabase
      .from('fish_images')
      .delete()
      .eq('id', imageId)

    if (error) {
      console.error('Error hard-deleting image:', error)
      setNotification({
        isOpen: true,
        title: 'Delete Failed',
        message: `Failed to permanently delete image: ${error.message}`,
        type: 'error'
      })
      return false
    }

    setFishImages(prev => prev.filter(img => img.id !== imageId))
    return true
  }

  // Mutation: Set default image
  const setDefaultImageMutation = async (imageId: string) => {
    if (!selectedFishId) return

    // First, unset all defaults for this fish
    await supabase
      .from('fish_images')
      .update({ is_default: false })
      .eq('fish_id', selectedFishId)

    // Set new default
    const { error } = await supabase
      .from('fish_images')
      .update({ is_default: true })
      .eq('id', imageId)

    if (error) {
      console.error('Error setting default image:', error)
      setNotification({
        isOpen: true,
        title: 'Set Default Failed',
        message: `Failed to set default image: ${error.message}`,
        type: 'error'
      })
      return
    }

    setFishImages(prev => prev.map(img => ({
      ...img,
      is_default: img.id === imageId
    })))
  }

  // Handle keyboard navigation in fish list
  const handleFishListKeyDown = (e: React.KeyboardEvent) => {
    if (!species || species.length === 0) return
    
    const currentIndex = selectedFishId ? species.findIndex(fish => fish.id === selectedFishId) : -1
    
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const nextIndex = currentIndex < species.length - 1 ? currentIndex + 1 : 0
      setSelectedFishId(species[nextIndex].id)
      setIsCreating(false)
      
      // Auto-scroll to keep selected fish in view
      setTimeout(() => {
        scrollToSelectedFish(species[nextIndex].id)
      }, 10)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : species.length - 1
      setSelectedFishId(species[prevIndex].id)
      setIsCreating(false)
      
      // Auto-scroll to keep selected fish in view
      setTimeout(() => {
        scrollToSelectedFish(species[prevIndex].id)
      }, 10)
    }
  }

  // Scroll the selected fish into view
  const scrollToSelectedFish = (fishId: string) => {
    const fishElement = document.querySelector(`[data-fish-id="${fishId}"]`)
    if (fishElement && fishListRef.current) {
      fishElement.scrollIntoView({
        behavior: 'auto',
        block: 'nearest'
      })
    }
  }

  const handleCreateNew = () => {
    setSelectedFishId(null)
    setIsCreating(true)
  }

  const confirmDelete = () => {
    if (deleteConfirm.fishId) {
      setSelectedFishId(null)
      setIsCreating(false)
      setDeleteConfirm({ isOpen: false, fishId: null, fishName: '' })
    }
  }

  const getInvasiveStatusColor = (invasive: boolean) => {
    return invasive 
      ? 'bg-red-100 text-red-800 border-red-200' 
      : 'bg-green-100 text-green-800 border-green-200'
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fish Record Maintenance</h1>
            <p className="text-gray-600">Manage fish species data with two-panel workflow</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleCreateNew}
              disabled={isCreating}
              className="bg-ocean-600 hover:bg-ocean-700"
            >
              ➕ Add New Fish
            </Button>
          </div>
        </div>
      </div>

      {/* Two Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL - Fish List & Search */}
        <div className="flex-shrink-0 border-r border-gray-200 bg-gray-50 flex flex-col" style={{ width: '404px' }}>
          {/* Search & Filters */}
          <div className="p-4 bg-white border-b border-gray-200">
            <div className="space-y-4">
              {/* Class Filter Pills */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Filter by Water Type</label>
                  <div className="flex gap-2">
                    {['All', 'Fresh', 'Salt'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setClassFilter(filter)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          classFilter === filter
                            ? 'bg-ocean-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sort Dropdown */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Sort by</label>
                  <select 
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="common_name">Common Name</option>
                    <option value="family">Family</option>
                    <option value="species">Scientific Name</option>
                    <option value="size">Size (Length)</option>
                  </select>
                </div>
              </div>

              {/* Search Input */}
              <div>
                <Input
                  placeholder="Search fish species..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full !h-auto !py-0.5"
                />
                {species && (
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.size > 0 && selectedRows.size === species.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRows(new Set(species.map(f => f.id)))
                          } else {
                            setSelectedRows(new Set())
                          }
                        }}
                        className="mr-1"
                      />
                      Select All
                    </label>
                    <span>{species.length} species found</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Fish List */}
          <div 
            ref={fishListRef}
            className="flex-1 overflow-y-auto focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-inset"
            tabIndex={0}
            onKeyDown={handleFishListKeyDown}
          >
            {isLoading ? (
              <div className="p-4 space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white p-3 rounded border animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-600">
                <p>Error loading fish data</p>
              </div>
            ) : species && species.length > 0 ? (
              <div className="px-4">
                {species.map((fish) => (
                  <div 
                    key={fish.id}
                    data-fish-id={fish.id}
                    className={`bg-white pl-2 pr-3 py-1 border-b hover:bg-gray-50 transition-colors ${
                      selectedFishId === fish.id ? 'border-ocean-500 bg-yellow-200' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(fish.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedRows)
                          if (e.target.checked) {
                            newSelected.add(fish.id)
                          } else {
                            newSelected.delete(fish.id)
                          }
                          setSelectedRows(newSelected)
                        }}
                        className="flex-shrink-0"
                      />
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => {
                          setSelectedFishId(fish.id)
                          setIsCreating(false)
                          // Scroll clicked fish into view
                          setTimeout(() => {
                            scrollToSelectedFish(fish.id)
                          }, 10)
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {/* Fish thumbnail */}
                          {fish.image_name_location && (
                            <img 
                              src={getImageUrl(fish.image_name_location) || ''} 
                              alt={fish.common_name}
                              className="w-12 h-8 object-contain bg-gray-100 rounded flex-shrink-0"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                              }}
                            />
                          )}
                          <h4 className="font-medium text-gray-900 text-sm flex-1">
                            {fish.common_name}
                          </h4>
                          <div className="flex gap-1 flex-shrink-0">
                            {fish.class && (
                              <span className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded ${
                                fish.class === 'Fresh' ? 'bg-blue-100 text-blue-800' : 'bg-teal-100 text-teal-800'
                              }`}>
                                {fish.class}
                              </span>
                            )}
                            <span className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded ${getInvasiveStatusColor(fish.invasive)}`}>
                              {fish.invasive ? 'Inv' : 'Nat'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <div className="text-4xl mb-2">🐟</div>
                <p>No fish species found</p>
                {searchTerm && (
                  <Button size="sm" onClick={() => setSearchTerm('')} className="mt-2">
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL - Fish Details & Form */}
        <div className="flex-1 bg-gray-50 h-full">
          {(selectedFishId || isCreating) ? (
            <div className="h-full flex flex-col">
              {/* Form Header */}
              <div className="border-b border-gray-200 px-6 py-0">
                <div className="flex items-center gap-1">
                  {/* Image Count Badge */}
                  {!isCreating && selectedFish && (
                    <button
                      onClick={() => setIsGalleryOpen(true)}
                      className="w-8 h-8 bg-ocean-600 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-ocean-700 transition-colors"
                      title="Open image gallery"
                    >
                      {fishImages.filter(img => img.status !== 'hidden').length || (selectedFish.image ? 1 : 0)}
                    </button>
                  )}
                  
                   {/* Fish Image Thumbnail */}
                  {!isCreating && selectedFish && (
                    <div 
                      className="bg-gray-200 rounded-lg border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors my-1 ml-2"
                      style={{ width: '130px', height: '90px', paddingLeft: '8px', paddingRight: '8px' }}
                      onDoubleClick={() => {
                        const defaultImage = fishImages.find(img => img.is_default) || fishImages[0]
                        if (defaultImage?.url || defaultImage?.image) {
                          setPreviewImageUrl(defaultImage.url || defaultImage.image || '')
                          setPreviewImageName(defaultImage.filename || selectedFish.common_name || 'Fish image')
                          setIsImagePreviewOpen(true)
                        }
                      }}
                    >
                      {(fishImages.find(img => img.is_default) || fishImages[0])?.url ? (
                        <img 
                          src={(fishImages.find(img => img.is_default) || fishImages[0]).url || (fishImages.find(img => img.is_default) || fishImages[0]).image} 
                          alt={selectedFish.common_name}
                          className="w-full h-full object-contain rounded-lg"
                          style={{ width: '130px', height: '90px' }}
                        />
                      ) : selectedFish.image_name_location ? (
                        <img 
                          src={getImageUrl(selectedFish.image_name_location) || ''} 
                          alt={selectedFish.common_name}
                          className="w-full h-full object-contain rounded-lg"
                          style={{ width: '130px', height: '90px' }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      ) : null}
                    </div>
                  )}
                  
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {isCreating ? 'Add New Fish Species' : selectedFish?.common_name}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {isCreating ? 'Fill in the details for the new fish species' : 'Modify the fish species information below'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="px-6 py-1 pb-20 w-full bg-blue-50">
                  <form className="space-y-2 w-full">
                    {/* Description - Moved to Top */}
                    <Card>
                      <CardContent className="space-y-1 py-1">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                            rows={5}
                            value={selectedFish?.description || ''}
                            placeholder="General description of the fish..."
                          />
                        </div>

                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Common Name *
                            </label>
                            <Input
                              value={selectedFish?.common_name || ''}
                              placeholder="e.g., Largemouth Bass"
                              className="!h-auto !py-0.5"
                            />
                          </div>
                          <div className="col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Scientific Species
                            </label>
                            <Input
                              className="!h-auto !py-0.5"
                              value={selectedFish?.species || ''}
                              placeholder="e.g., Micropterus salmoides"
                            />
                          </div>
                          <div className="col-span-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Also Known As
                            </label>
                            <Input
                              className="!h-auto !py-0.5"
                              value={selectedFish?.also_known_as || ''}
                              placeholder="e.g., Black Bass, Green Trout, Bigmouth Bass, Bucket Mouth"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Family *
                            </label>
                            <Input
                              className="!h-auto !py-0.5"
                              value={selectedFish?.family || ''}
                              placeholder="e.g., Centrarchidae"
                            />
                          </div>
                          <div className="col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Water Type *
                            </label>
                            <select 
                              className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                              value={selectedFish?.class || 'Fresh'}
                            >
                              <option value="Fresh">Fresh Water</option>
                              <option value="Salt">Salt Water</option>
                            </select>
                          </div>
                          <div className="col-span-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Environmental Status
                            </label>
                            <Input
                              className="!h-auto !py-0.5"
                              value={selectedFish?.environmental_status || ''}
                              placeholder="e.g., Least Concern"
                            />
                          </div>
                          <div className="col-span-2 flex items-end pb-1">
                            <input
                              type="checkbox"
                              id="invasive"
                              checked={selectedFish?.invasive === true}
                              readOnly
                              className="w-5 h-5 mr-2 rounded border-gray-300"
                            />
                            <label htmlFor="invasive" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                              Invasive
                            </label>
                          </div>
                        </div>

                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Average Adult Length (inches)
                            </label>
                            <Input
                              className="!h-auto !py-0.5"
                              type="number"
                              step="0.1"
                              value={selectedFish?.avg_adult_length_inches || ''}
                              placeholder="e.g., 15.5"
                            />
                          </div>
                          <div className="col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Average Adult Weight (lbs)
                            </label>
                            <Input
                              className="!h-auto !py-0.5"
                              type="number"
                              step="0.1"
                              value={selectedFish?.avg_adult_weight_lbs || ''}
                              placeholder="e.g., 3.5"
                            />
                          </div>
                          <div className="col-span-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              World Record
                            </label>
                            <Input
                              className="!h-auto !py-0.5"
                              value={selectedFish?.world_record || ''}
                              placeholder="e.g., 22 lbs 4 oz - Georgia, 1932"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Known For
                          </label>
                          <textarea
                            className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                            rows={3}
                            value={selectedFish?.known_for || ''}
                            placeholder="What is this fish particularly known for?"
                          />
                        </div>

                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-5">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Range/Distribution
                            </label>
                            <textarea
                              className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                              rows={2}
                              value={selectedFish?.range_distribution || ''}
                              placeholder="Geographic distribution"
                            />
                          </div>
                          <div className="col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Water Body Type
                            </label>
                            <Input
                              className="!h-auto !py-0.5"
                              value={selectedFish?.water_body_type || ''}
                              placeholder="e.g., Lake, River"
                            />
                          </div>
                          <div className="col-span-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Image Name/Location
                            </label>
                            <Input
                              className="!h-auto !py-0.5"
                              value={selectedFish?.image_name_location || ''}
                              placeholder="e.g., Bass-Largemouth.png"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Habitat Description
                          </label>
                          <textarea
                            className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                            rows={3}
                            value={selectedFish?.habitat || ''}
                            placeholder="Describe the preferred habitat..."
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Diet & Feeding Habits
                            </label>
                            <textarea
                              className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                              rows={2}
                              value={selectedFish?.diet_feeding_habits || ''}
                              placeholder="What does this fish eat and how does it feed?"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Spawning Habits & Lifecycle
                            </label>
                            <textarea
                              className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                              rows={2}
                              value={selectedFish?.spawning_habits_lifecycle || ''}
                              placeholder="Reproductive behavior and lifecycle information..."
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fishing Techniques
                          </label>
                          <textarea
                            className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                            rows={2}
                            value={selectedFish?.fishing_techniques || ''}
                            placeholder="How to catch this fish, preferred baits, techniques..."
                          />
                        </div>
                      </CardContent>
                    </Card>



                    {/* Audit Fields - Display Only */}
                    <div className="text-center text-xs text-gray-400 italic pb-4">
                      {selectedFish?.created_at && (
                        <span>
                          Created: {new Date(selectedFish.created_at).toLocaleDateString()} {new Date(selectedFish.created_at).toLocaleTimeString()}
                          {` by admin`}
                          {selectedFish?.updated_at && ' | '}
                        </span>
                      )}
                      {selectedFish?.updated_at && (
                        <span>
                          Updated: {new Date(selectedFish.updated_at).toLocaleDateString()} {new Date(selectedFish.updated_at).toLocaleTimeString()}
                          {` by admin`}
                        </span>
                      )}
                      {!selectedFish?.created_at && !selectedFish?.updated_at && (
                        <span>No audit information available</span>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center">
              <div className="max-w-md">
                <div className="text-6xl mb-4">🐟</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Fish Record Management</h3>
                <p className="text-gray-600 mb-6">
                  Select a fish species from the list on the left to view and edit its details, or create a new fish species record.
                </p>
                <Button onClick={handleCreateNew} className="bg-ocean-600 hover:bg-ocean-700">
                  ➕ Add New Fish Species
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      <Notification
        isOpen={notification.isOpen}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, fishId: null, fishName: '' })}
        onConfirm={confirmDelete}
        title="Delete Fish Species"
        message={`Are you sure you want to delete "${deleteConfirm.fishName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Image Gallery Modal */}
      <FishGallery
        isOpen={isGalleryOpen}
        onClose={() => {
          setIsGalleryOpen(false)
        }}
        fishId={selectedFishId || ''}
        fishName={selectedFish?.common_name || ''}
        images={fishImages}
        onSetDefault={setDefaultImageMutation}
        onSoftDelete={async (imageId) => {
          const img = fishImages.find(i => i.id === imageId)
          await softDeleteImageMutation(imageId)
        }}
        onRestore={async (imageId) => {
          await restoreImageMutation(imageId)
        }}
        onHardDelete={async (imageId) => {
          const img = fishImages.find(i => i.id === imageId)
          await hardDeleteImageMutation(imageId, img)
        }}
        onUploadImages={uploadImagesMutation}
        onPreviewImage={(image) => {
          setPreviewImageUrl(image.url || image.image || '')
          setPreviewImageName(image.filename || fishName || 'Fish image')
          setIsImagePreviewOpen(true)
        }}
      />

      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={isImagePreviewOpen}
        imageUrl={previewImageUrl}
        imageName={previewImageName}
        onClose={() => setIsImagePreviewOpen(false)}
      />
    </div>
  )
}

export default FishManagementTwoPanel
