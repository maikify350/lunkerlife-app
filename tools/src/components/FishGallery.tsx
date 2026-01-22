import { FC, useState, useRef, useEffect } from 'react'
import Button from './ui/Button'

interface FishGalleryProps {
  isOpen: boolean
  onClose: (newDefaultImageId?: string) => void
  fishId: string
  fishName: string
  images: any[]
  onSetDefault: (imageId: string) => void
  onSoftDelete: (imageId: string) => void  // Move to trash
  onRestore: (imageId: string) => void     // Restore from trash
  onHardDelete: (imageId: string) => void  // Permanently delete
  onUploadImages: (files: FileList) => void
  onPreviewImage?: (image: any) => void     // Optional callback for full preview
}

const FishGallery: FC<FishGalleryProps> = ({
  isOpen,
  onClose,
  fishName,
  images,
  onSetDefault,
  onSoftDelete,
  onRestore,
  onHardDelete,
  onUploadImages,
  onPreviewImage
}) => {
  const [dragOver, setDragOver] = useState(false)
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
  const [previewImageId, setPreviewImageId] = useState<string | null>(null)
  const [previewImageDimensions, setPreviewImageDimensions] = useState<{width: number, height: number} | null>(null)
  const [showTrash, setShowTrash] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filter images based on view mode
  const activeImages = images.filter(img => img.status !== 'hidden' || img.status === undefined)
  const trashImages = images.filter(img => img.status === 'hidden')
  const displayedImages = showTrash ? trashImages : activeImages

  // Set the first active image as preview and get dimensions
  useEffect(() => {
    if (displayedImages.length > 0 && !previewImageId) {
      const defaultImage = displayedImages.find(img => img.is_default)
      const firstImage = displayedImages[0]
      setPreviewImageId(defaultImage?.id || firstImage.id)
    }
    if (displayedImages.length === 0 && previewImageId) {
      setPreviewImageId(null)
      setPreviewImageDimensions(null)
    }
  }, [displayedImages, previewImageId])

  if (!isOpen) return null

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      onUploadImages(files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadImages(e.target.files)
    }
  }

  const handleImageSelect = (imageId: string) => {
    const newSelected = new Set(selectedImages)
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId)
    } else {
      newSelected.add(imageId)
    }
    setSelectedImages(newSelected)
  }

  const handleSoftDeleteSelected = async () => {
    if (selectedImages.size === 0) return
    
    const activeImageCount = images.filter(img => img.status !== 'hidden').length
    if (activeImageCount - selectedImages.size < 1) {
      alert('Cannot move to trash: You must keep at least one active image.')
      setSelectedImages(new Set())
      return
    }
    
    if (confirm(`Move ${selectedImages.size} image(s) to trash? They can be restored later.`)) {
      for (const imageId of selectedImages) {
        await onSoftDelete(imageId)
      }
      setSelectedImages(new Set())
    }
  }

  const handleSoftDelete = async (imageId: string) => {
    const activeImageCount = images.filter(img => img.status !== 'hidden').length
    if (activeImageCount <= 1) {
      alert('Cannot move to trash: You must keep at least one active image.')
      return
    }
    
    if (confirm('Move this image to trash? It can be restored later.')) {
      await onSoftDelete(imageId)
    }
  }

  const handleRestoreSelected = async () => {
    if (selectedImages.size === 0) return
    
    if (confirm(`Restore ${selectedImages.size} image(s) from trash?`)) {
      for (const imageId of selectedImages) {
        await onRestore(imageId)
      }
      setSelectedImages(new Set())
    }
  }

  const handleHardDeleteSelected = async () => {
    if (selectedImages.size === 0) return
    
    const confirmMessage = `⚠️ PERMANENTLY DELETE ${selectedImages.size} image(s)?\n\nThis action CANNOT be undone!\nThe images will be completely removed from the system.`
    
    if (confirm(confirmMessage)) {
      if (confirm(`Are you absolutely sure? This will permanently delete ${selectedImages.size} image(s).`)) {
        for (const imageId of selectedImages) {
          const img = images.find(i => i.id === imageId)
          if (img) {
            await onHardDelete(imageId)
          }
        }
        setSelectedImages(new Set())
      }
    }
  }

  const handleSetAsDefault = async (imageId: string) => {
    setPreviewImageId(imageId)
    await onSetDefault(imageId)
  }

  const handleGalleryClose = () => {
    onClose(previewImageId || undefined)
  }

  const handleRestore = async (imageId: string) => {
    await onRestore(imageId)
  }

  const handleHardDelete = async (imageId: string) => {
    if (confirm('⚠️ PERMANENTLY DELETE this image?\n\nThis action cannot be undone!')) {
      const img = images.find(i => i.id === imageId)
      if (img) {
        await onHardDelete(imageId)
      }
    }
  }

  const toggleViewMode = () => {
    setShowTrash(!showTrash)
    setSelectedImages(new Set())
  }

  // Get the preview image and handle image loading for dimensions
  const previewImage = images.find(img => img.id === previewImageId) || displayedImages[0]
  
  const handlePreviewImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    setPreviewImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl max-h-[90vh] w-full mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Image Gallery</h2>
            <p className="text-sm text-gray-600">
              {showTrash 
                ? `${fishName} - Trash (${trashImages.length} images)` 
                : `${fishName} (${activeImages.length} images)`}
            </p>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center gap-2 mr-4">
            <button
              onClick={() => !showTrash || toggleViewMode()}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                !showTrash 
                  ? 'bg-ocean-600 text-white' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              🖼️ Active ({activeImages.length})
            </button>
            <button
              onClick={() => showTrash || toggleViewMode()}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1 ${
                showTrash 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              🗑️ Trash ({trashImages.length})
              {trashImages.length > 0 && (
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            {selectedImages.size > 0 && (
              <>
                {!showTrash ? (
                  <Button
                    onClick={handleSoftDeleteSelected}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    🗑️ Move to Trash ({selectedImages.size})
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleRestoreSelected}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      ♻️ Restore ({selectedImages.size})
                    </Button>
                    <Button
                      onClick={handleHardDeleteSelected}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      ❌ Permanently Delete ({selectedImages.size})
                    </Button>
                  </>
                )}
              </>
            )}
            
            <button
              onClick={handleGalleryClose}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Image Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {!showTrash && (
            <div
              className={`border-2 border-dashed rounded-lg p-4 mb-4 text-center transition-colors ${
                dragOver 
                  ? 'border-ocean-500 bg-ocean-50' 
                  : 'border-gray-300 bg-gray-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <p className="text-gray-600 text-sm">
                Drag and drop images here or{' '}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-ocean-600 hover:text-ocean-700 underline"
                >
                  click to upload
                </button>
              </p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
            </div>
          )}

          {showTrash && trashImages.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🗑️</span>
                <span className="font-medium text-orange-800 text-sm">Trash Bin</span>
              </div>
              <p className="text-xs text-orange-700">
                Images in trash are hidden from the main view but not permanently deleted. 
                You can restore them or permanently delete them.
              </p>
            </div>
          )}

          {displayedImages.length === 0 ? (
            showTrash ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">♻️</div>
                <p className="text-gray-500 text-sm">Trash is empty</p>
                <p className="text-xs text-gray-400">Deleted images will appear here</p>
                <Button onClick={toggleViewMode} className="mt-4 bg-ocean-600 text-white">
                  ← Back to Active Images
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🖼️</div>
                <p className="text-gray-500 text-sm">No images yet</p>
                <p className="text-xs text-gray-400">Upload some images to get started</p>
              </div>
            )
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {displayedImages.map((image, index) => (
                <div
                  key={image.id || index}
                  data-fish-image-id={image.id}
                  className={`relative group rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    previewImageId === image.id
                      ? 'border-ocean-500 shadow-lg ring-2 ring-ocean-200'
                      : selectedImages.has(image.id) 
                        ? 'border-orange-500 shadow-lg' 
                        : showTrash 
                          ? 'border-gray-300 opacity-75' 
                          : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPreviewImageId(image.id)}
                  onDoubleClick={() => onPreviewImage && onPreviewImage(image)}
                >
                  <div className="h-24 bg-gray-100">
                    <img
                      src={image.url || image.image}
                      alt={`${fishName} ${index + 1}`}
                      className={`w-full h-full object-cover ${showTrash ? 'grayscale-50' : ''}`}
                    />
                  </div>
                  <div className="bg-white px-2 py-1 text-xs text-gray-600 truncate border-t border-gray-200">
                    {image.filename || `Image ${index + 1}`}
                  </div>

                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity">
                    {showTrash && (
                      <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                        In Trash
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSetAsDefault(image.id)
                      }}
                      className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-white transition-all ${
                        previewImageId === image.id 
                          ? 'bg-red-600' 
                          : 'bg-transparent hover:bg-white hover:bg-opacity-50'
                      }`}
                      title={previewImageId === image.id ? 'Current default' : 'Click to set as default'}
                    >
                      {previewImageId === image.id && (
                        <div className="w-full h-full rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleImageSelect(image.id)
                      }}
                      className={`absolute top-2 left-2 w-6 h-6 rounded border-2 border-white transition-all ${
                        selectedImages.has(image.id)
                          ? 'bg-ocean-600'
                          : 'bg-transparent hover:bg-white hover:bg-opacity-50'
                      }`}
                    >
                      {selectedImages.has(image.id) && (
                        <div className="text-white text-xs">✓</div>
                      )}
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    {image.file_size && <p>{(image.file_size / 1024).toFixed(1)} KB</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Default Image Preview - Bottom Section with Full Details */}
        {previewImage && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-start gap-4">
              {/* Large Preview */}
              <div 
                className="w-80 h-48 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                onDoubleClick={() => onPreviewImage && onPreviewImage(previewImage)}
                title="Double-click for full preview"
              >
                <img
                  src={previewImage.url || previewImage.image}
                  alt="Default preview"
                  className={`w-full h-full object-contain ${showTrash ? 'grayscale-50' : ''}`}
                  onLoad={handlePreviewImageLoad}
                />
              </div>
              
              {/* Preview Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    previewImageId === previewImage?.id || previewImage?.is_default
                      ? 'bg-red-600' 
                      : 'bg-gray-300'
                  }`}>
                    {(previewImageId === previewImage?.id || previewImage?.is_default) && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {showTrash ? 'Trashed Image' : 'Default Image'}
                  </span>
                  {previewImage?.is_default && (
                    <span className="text-xs text-green-600">(Original default)</span>
                  )}
                  {previewImage?.status === 'hidden' && (
                    <span className="text-xs text-orange-600">(Deleted)</span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Filename:</strong> {previewImage.filename || `Image preview`}
                </p>
                
                {previewImage.file_size && (
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Size:</strong> {(previewImage.file_size / 1024).toFixed(1)} KB
                  </p>
                )}
                
                {previewImageDimensions && (
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Dimensions:</strong> {previewImageDimensions.width} × {previewImageDimensions.height} pixels
                  </p>
                )}
                
                {previewImage.storage_path && (
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Storage Path:</strong> {previewImage.storage_path}
                  </p>
                )}
                
                {previewImage.created_at && (
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Uploaded:</strong> {new Date(previewImage.created_at).toLocaleString()}
                  </p>
                )}
                
                {previewImage.deleted_at && showTrash && (
                  <p className="text-sm text-orange-600 mb-1">
                    <strong>Deleted:</strong> {new Date(previewImage.deleted_at).toLocaleString()}
                  </p>
                )}
                
                <div className="flex gap-2 mt-4">
                  {!showTrash && previewImage.status !== 'hidden' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleSetAsDefault(previewImage.id)}
                        className="bg-ocean-600 text-white"
                      >
                        ⭐ Set as Default
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSoftDelete(previewImage.id)}
                        className="bg-orange-500 text-white"
                      >
                        🗑️ Move to Trash
                      </Button>
                    </>
                  )}
                  {showTrash && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleRestore(previewImage.id)}
                        className="bg-green-600 text-white"
                      >
                        ♻️ Restore
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleHardDelete(previewImage.id)}
                        className="bg-red-600 text-white"
                      >
                        ❌ Permanently Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  )
}

export default FishGallery