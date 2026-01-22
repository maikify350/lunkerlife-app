# Supabase Storage Setup for Fish Images

## Step 1: Create Storage Bucket

1. **Go to your Supabase Dashboard**: https://gskbzaduwmsbaxddixmk.supabase.co
2. **Navigate to Storage** in the left sidebar
3. **Create a new bucket**:
   - Name: `fish-images`
   - Public: Yes (so images can be accessed via URL)
   - File size limit: 50MB (plenty for fish images)

## Step 2: Upload Fish Images

Upload all images from `D:\WIP\LuckerLife\database\seeds\fish_images\` to the `fish-images` bucket.

**Batch upload process:**
1. In Storage > fish-images bucket
2. Click "Upload files" 
3. Select all .png files from your local fish_images folder
4. Upload them to the root of the bucket

## Step 3: Update Database URLs

After uploading, run this SQL to update the image URLs:

```sql
UPDATE fish_species 
SET image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/' || image
WHERE image IS NOT NULL 
  AND image != '' 
  AND image NOT LIKE 'http%'
  AND image NOT LIKE 'https%';
```

## Step 4: Verify Setup

```sql
-- Check image URLs
SELECT 
    common_name,
    image,
    CASE 
        WHEN image LIKE 'https://gskbzaduwmsbaxddixmk.supabase.co/storage%' THEN '✅ Supabase Storage'
        WHEN image IS NULL OR image = '' THEN '❌ No image'
        ELSE '⚠️ Other source'
    END as image_status
FROM fish_species 
WHERE image IS NOT NULL AND image != ''
ORDER BY common_name
LIMIT 10;
```

## Benefits of Supabase Storage:
- ✅ CDN-powered image delivery
- ✅ Automatic optimization
- ✅ Integrated with your Supabase project
- ✅ No need for separate S3 setup
- ✅ Built-in authentication if needed later