-- MANUAL FIX FOR MISSING SALTWATER FISH IMAGES
-- These fish have images but the filenames don't match exactly

-- 1. Barracuda (we have 3 barracuda images, using Great Barracuda)
UPDATE fish_species 
SET 
  image_name_location = 'Barracuda-Great.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Barracuda-Great.png'
WHERE common_name = 'Barracuda'
  AND class = 'Salt'
  AND image IS NULL;

-- 2. Barramundi (no image available - will need to source)
-- SKIP FOR NOW

-- 3. Mahi-mahi (we have Dolphinfish_Mahi_Mahi.png)
UPDATE fish_species 
SET 
  image_name_location = 'Dolphinfish_Mahi_Mahi.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Dolphinfish_Mahi_Mahi.png'
WHERE common_name = 'Mahi-mahi'
  AND class = 'Salt'
  AND image IS NULL;

-- 4. Pollock, Atlantic (no image available - will need to source)
-- SKIP FOR NOW

-- 5. Sailfish, Atlantic (we have Salifish-Atlantic.png - typo in filename!)
UPDATE fish_species 
SET 
  image_name_location = 'Salifish-Atlantic.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Salifish-Atlantic.png'
WHERE common_name = 'Sailfish, Atlantic'
  AND class = 'Salt'
  AND image IS NULL;

-- 6. Shark, Lemon (no image available - will need to source)
-- SKIP FOR NOW

-- 7. Shark, Shortfin Mako (we have Shark-Mako.png)
UPDATE fish_species 
SET 
  image_name_location = 'Shark-Mako.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Shark-Mako.png'
WHERE common_name = 'Shark, Shortfin Mako'
  AND class = 'Salt'
  AND image IS NULL;

-- 8. Skate, Winter (no image available - will need to source)
-- SKIP FOR NOW

-- 9. Snook (we have Snook-Common.png)
UPDATE fish_species 
SET 
  image_name_location = 'Snook-Common.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Snook-Common.png'
WHERE common_name = 'Snook'
  AND class = 'Salt'
  AND image IS NULL;

-- 10. Spearfish, Mediterranean (we have Spearfish-Atlantic.png as closest match)
UPDATE fish_species 
SET 
  image_name_location = 'Spearfish-Atlantic.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Spearfish-Atlantic.png'
WHERE common_name = 'Spearfish, Mediterranean'
  AND class = 'Salt'
  AND image IS NULL;

-- 11. Sturgeon, White (no image available - this is actually a freshwater fish!)
-- SKIP FOR NOW

-- 12. Tilefish (no image available - will need to source)
-- SKIP FOR NOW

-- 13. Tripletail, Atlantic (we have Tripletail.png)
UPDATE fish_species 
SET 
  image_name_location = 'Tripletail.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Tripletail.png'
WHERE common_name = 'Tripletail, Atlantic'
  AND class = 'Salt'
  AND image IS NULL;

-- 14. Tuna, Bluefin (no image available - will need to source)
-- SKIP FOR NOW

-- ADDITIONAL IMAGES FOUND IN FOLDER
-- These images exist but may not have exact database matches

-- Check if Bass, Giant Sea exists (we have Bass-Giant_Sea.png)
UPDATE fish_species 
SET 
  image_name_location = 'Bass-Giant_Sea.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Bass-Giant_Sea.png'
WHERE (common_name LIKE '%Giant%Sea%Bass%' OR common_name LIKE 'Bass, Giant Sea')
  AND class = 'Salt'
  AND image IS NULL;

-- Rockfish (we have Rockfish.png)
UPDATE fish_species 
SET 
  image_name_location = 'Rockfish.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Rockfish.png'
WHERE common_name LIKE '%Rockfish%'
  AND class = 'Salt'
  AND image IS NULL;

-- Spot (we have Spot.png - might be a standalone species)
UPDATE fish_species 
SET 
  image_name_location = 'Spot.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Spot.png'
WHERE common_name = 'Spot'
  AND class = 'Salt'
  AND image IS NULL;

-- Tautog (we have Tautog.png)
UPDATE fish_species 
SET 
  image_name_location = 'Tautog.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Tautog.png'
WHERE common_name = 'Tautog'
  AND class = 'Salt'
  AND image IS NULL;

-- VERIFICATION QUERY
SELECT 
    common_name,
    image_name_location,
    CASE 
        WHEN image LIKE 'https://gskbzaduwmsbaxddixmk.supabase.co/storage%' THEN '✅ Linked'
        WHEN image IS NULL THEN '❌ No image'
        ELSE '⚠️ Other'
    END as status
FROM fish_species 
WHERE class = 'Salt'
  AND image IS NULL
ORDER BY common_name;

-- SUMMARY
-- After running this fix:
-- ✅ Linked: 71 + 7 = 78 fish
-- ❌ Missing: 16 - 7 = 9 fish (need to source images)
-- 
-- Missing images needed:
-- 1. Barramundi
-- 2. Pollock, Atlantic
-- 3. Shark, Lemon
-- 4. Skate, Winter
-- 5. Sturgeon, White (actually freshwater)
-- 6. Tilefish
-- 7. Tuna, Bluefin
-- 8. Bass, Giant Sea (we have the image but it didn't match)
-- 9. Rockfish (we have the image but it didn't match)
