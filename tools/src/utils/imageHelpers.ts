/**
 * Image helper utilities for fish images
 */

const STORAGE_BUCKET_URL = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/'

/**
 * Get the full image URL from the image name/location
 * @param imageNameLocation - The image filename from the database
 * @returns The full URL to the image in Supabase storage
 */
export function getImageUrl(imageNameLocation: string | null | undefined): string | null {
  if (!imageNameLocation) return null
  
  // If it's already a full URL, return it
  if (imageNameLocation.startsWith('http://') || imageNameLocation.startsWith('https://')) {
    return imageNameLocation
  }
  
  // Otherwise, build the URL from the bucket
  return `${STORAGE_BUCKET_URL}${imageNameLocation}`
}

/**
 * Get a placeholder image URL for fish without images
 */
export function getPlaceholderImage(): string {
  return '/placeholder-fish.png'
}

/**
 * Extract filename from a URL or path
 */
export function getFilenameFromPath(path: string): string {
  return path.split('/').pop() || 'Fish image'
}