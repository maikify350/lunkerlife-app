-- Add status field to fish_images table for soft-delete support
-- Run this in Supabase SQL Editor

ALTER TABLE fish_images 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' 
CHECK (status IN ('active', 'hidden'));

-- Update existing images to active status
UPDATE fish_images SET status = 'active' WHERE status IS NULL;

-- Add updated_at for tracking changes
ALTER TABLE fish_images 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add deleted_at for tracking when item was hidden
ALTER TABLE fish_images 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN fish_images.status IS 'Image status: active (visible), hidden (in trash)';
COMMENT ON COLUMN fish_images.deleted_at IS 'Timestamp when image was moved to trash';

-- Create function to safely hide (soft delete) an image
CREATE OR REPLACE FUNCTION hide_fish_image(image_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE fish_images 
  SET status = 'hidden', 
      deleted_at = NOW(),
      updated_at = NOW()
  WHERE id = image_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to restore (unhide) an image from trash
CREATE OR REPLACE FUNCTION restore_fish_image(image_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE fish_images 
  SET status = 'active', 
      deleted_at = NULL,
      updated_at = NOW()
  WHERE id = image_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to permanently delete an image
CREATE OR REPLACE FUNCTION permanently_delete_fish_image(image_id UUID, delete_storage BOOLEAN DEFAULT true)
RETURNS void AS $$
DECLARE
  image_record RECORD;
BEGIN
  -- Get image record
  SELECT * INTO image_record FROM fish_images WHERE id = image_id;
  
  IF image_record IS NULL THEN
    RAISE EXCEPTION 'Image not found';
  END IF;
  
  -- Delete from database
  DELETE FROM fish_images WHERE id = image_id;
  
  -- Optionally delete from storage (commented out by default for safety)
  -- IF delete_storage AND image_record.storage_path IS NOT NULL THEN
  --   SELECT storage.remove(image_record.storage_path);
  -- END IF;
END;
$$ LANGUAGE plpgsql;

-- Views for filtering images

-- View: Only active (visible) images
CREATE OR REPLACE VIEW fish_images_active AS
SELECT * FROM fish_images WHERE status = 'active';

-- View: Only hidden (trash) images  
CREATE OR REPLACE VIEW fish_images_trash AS
SELECT * FROM fish_images WHERE status = 'hidden';

-- Verification query
SELECT 
  'Total images' as label,
  COUNT(*) as count
FROM fish_images
UNION ALL
SELECT 
  'Active images',
  COUNT(*)
FROM fish_images WHERE status = 'active'
UNION ALL
SELECT 
  'In trash (hidden)',
  COUNT(*)
FROM fish_images WHERE status = 'hidden';