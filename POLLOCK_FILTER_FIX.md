# 🔧 QUICK FIX FOR POLLOCK ISSUE

## Problem:
Pollock, Atlantic shows in "missing images" filter even though it has an uploaded image in the `fish_images` table.

## Root Cause:
The filter only checks `image` and `image_name_location` fields, not the `fish_images` table.

## Solution:
Update the client-side filter logic to query `fish_images` table and exclude fish that have uploaded images.

## Code Fix Needed:
In `FishManagementTwoPanel.tsx` around line 138-152, replace the broken image logic with:

```typescript
// If showing only missing images, filter to check all image sources
if (showOnlyMissingImages) {
  // Get all fish IDs that have uploaded images
  const { data: fishWithImages } = await supabase
    .from('fish_images')
    .select('fish_id')
    .eq('status', 'active')
  
  const fishIdsWithImages = new Set(fishWithImages?.map(img => img.fish_id) || [])
  
  // Filter to only fish without images or with broken images
  results = results.filter(fish => {
    const hasUploadedImage = fishIdsWithImages.has(fish.id)
    const hasLegacyImage = fish.image || fish.image_name_location
    const hasBrokenImage = brokenImageFishIds.has(fish.id)
    
    // Show if: no images at all OR has broken image
    return (!hasUploadedImage && !hasLegacyImage) || hasBrokenImage
  })
}
```

## Manual Fix:
1. Open `tools/src/pages/FishManagementTwoPanel.tsx`
2. Find line 138-152 (the broken image filter logic)
3. Replace with the code above
4. Build and deploy

This will properly exclude fish like Pollock, Atlantic that have uploaded images.
