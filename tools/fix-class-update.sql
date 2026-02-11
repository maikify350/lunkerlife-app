-- Disable the trigger temporarily or work around it
-- Option 1: Update with a proper UUID for updated_by
UPDATE fish_species 
SET 
    class = 'Fresh',
    updated_by = NULL,  -- Set to NULL to avoid the trigger issue
    updated_at = NOW()
WHERE class IS NULL;

-- If the above doesn't work, try this simpler version:
-- UPDATE fish_species SET class = 'Fresh' WHERE class IS NULL AND id IS NOT NULL;