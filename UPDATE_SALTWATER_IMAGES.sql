-- Update saltwater fish images
-- Run this in Supabase SQL Editor after uploading images to storage

UPDATE fish_species 
SET 
  image_name_location = 'Barracuda--Pickhande.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Barracuda--Pickhande.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'barracuda pickhande'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Barracuda-Great.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Barracuda-Great.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'barracuda great'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Barracuda-Yellow_Tail.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Barracuda-Yellow_Tail.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'barracuda yellow tail'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Bass-Barred_Sand.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Bass-Barred_Sand.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'bass barred sand'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Bass-Black_Sea.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Bass-Black_Sea.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'bass black sea'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Bass-Giant_Sea.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Bass-Giant_Sea.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'bass giant sea'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Bass-Striped.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Bass-Striped.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'bass striped'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Bluefish.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Bluefish.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'bluefish'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Bonefish.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Bonefish.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'bonefish'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Cobia.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Cobia.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'cobia'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Cod-Atlantic.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Cod-Atlantic.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'cod atlantic'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Cod-Pacific.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Cod-Pacific.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'cod pacific'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Dolphinfish_Mahi_Mahi.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Dolphinfish_Mahi_Mahi.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'dolphinfish mahi mahi'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Drum-Red.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Drum-Red.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'drum red'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Flounder-Summer.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Flounder-Summer.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'flounder summer'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Flounder-Winter.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Flounder-Winter.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'flounder winter'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Grouper-Black.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Grouper-Black.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'grouper black'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Grouper-Goliath.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Grouper-Goliath.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'grouper goliath'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Grouper-Nassau.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Grouper-Nassau.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'grouper nassau'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Haddock.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Haddock.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'haddock'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Hake-Silver.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Hake-Silver.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'hake silver'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Halibut-Atlantic.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Halibut-Atlantic.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'halibut atlantic'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Halibut-Pacific.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Halibut-Pacific.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'halibut pacific'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Jack-Bluefin_Trevally.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Jack-Bluefin_Trevally.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'jack bluefin trevally'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Jack-California_Yellowtail.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Jack-California_Yellowtail.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'jack california yellowtail'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Jack-Crevalle.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Jack-Crevalle.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'jack crevalle'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Jack-Giant_Trevally.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Jack-Giant_Trevally.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'jack giant trevally'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Jack-Talang_Queenfish.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Jack-Talang_Queenfish.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'jack talang queenfish'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Kahawai.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Kahawai.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'kahawai'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Leerfish.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Leerfish.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'leerfish'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Mackerel-Atlantic.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Mackerel-Atlantic.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'mackerel atlantic'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Mackerel-King.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Mackerel-King.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'mackerel king'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Mackerel-Narrow_Barred.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Mackerel-Narrow_Barred.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'mackerel narrow barred'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Marlin-Black.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Marlin-Black.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'marlin black'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Marlin-Blue.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Marlin-Blue.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'marlin blue'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Marlin-Striped.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Marlin-Striped.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'marlin striped'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Marlin-White.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Marlin-White.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'marlin white'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Opah.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Opah.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'opah'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Permit.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Permit.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'permit'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Pollock-Alaska.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Pollock-Alaska.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'pollock alaska'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Redfish-Acadian.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Redfish-Acadian.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'redfish acadian'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Rockfish.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Rockfish.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'rockfish'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Roosterfish.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Roosterfish.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'roosterfish'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Sailfish-Pacific.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Sailfish-Pacific.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'sailfish pacific'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Salifish-Atlantic.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Salifish-Atlantic.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'salifish atlantic'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Salmon-Atlantic.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Salmon-Atlantic.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'salmon atlantic'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Salmon-Chinook.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Salmon-Chinook.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'salmon chinook'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Salmon-Coho.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Salmon-Coho.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'salmon coho'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Scup.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Scup.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'scup'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Seabass-White.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Seabass-White.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'seabass white'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Seatrout-Spotted.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Seatrout-Spotted.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'seatrout spotted'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Shark-Blacktip.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Shark-Blacktip.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'shark blacktip'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Shark-Blue.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Shark-Blue.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'shark blue'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Shark-Bull.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Shark-Bull.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'shark bull'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Shark-Great-White.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Shark-Great-White.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'shark great white'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Shark-Great_Hammerhead.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Shark-Great_Hammerhead.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'shark great hammerhead'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Shark-Leopard.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Shark-Leopard.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'shark leopard'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Shark-Mako.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Shark-Mako.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'shark mako'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Shark-Sand_Tiger.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Shark-Sand_Tiger.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'shark sand tiger'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Shark-Scalloped_Hammerhead.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Shark-Scalloped_Hammerhead.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'shark scalloped hammerhead'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Shark-Spiny_Dogfish.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Shark-Spiny_Dogfish.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'shark spiny dogfish'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Shark-Thresher.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Shark-Thresher.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'shark thresher'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Shark-Tiger.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Shark-Tiger.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'shark tiger'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Shark-Whitetip_Reef.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Shark-Whitetip_Reef.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'shark whitetip reef'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Shark-Zebra.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Shark-Zebra.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'shark zebra'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Snapper-Cubera.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Snapper-Cubera.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'snapper cubera'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Snapper-Gray.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Snapper-Gray.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'snapper gray'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Snapper-Mutton.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Snapper-Mutton.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'snapper mutton'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Snapper-Red.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Snapper-Red.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'snapper red'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Snook-Common.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Snook-Common.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'snook common'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Spearfish-Atlantic.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Spearfish-Atlantic.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'spearfish atlantic'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Spearfish-Longbill.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Spearfish-Longbill.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'spearfish longbill'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Spearfish-Shortbill.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Spearfish-Shortbill.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'spearfish shortbill'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Spot.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Spot.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'spot'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Steenbras-Red.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Steenbras-Red.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'steenbras red'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Swordfish.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Swordfish.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'swordfish'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Tarpon.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Tarpon.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'tarpon'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Tautog.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Tautog.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'tautog'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Threadfin-King.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Threadfin-King.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'threadfin king'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Tripletail.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Tripletail.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'tripletail'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Tuna-Albacore.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Tuna-Albacore.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'tuna albacore'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Tuna-Blackfin.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Tuna-Blackfin.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'tuna blackfin'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Tuna-Dogtooth.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Tuna-Dogtooth.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'tuna dogtooth'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Tuna-Skipjack.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Tuna-Skipjack.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'tuna skipjack'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Tuna-Yellowfin.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Tuna-Yellowfin.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'tuna yellowfin'
  AND image IS NULL;

UPDATE fish_species 
SET 
  image_name_location = 'Wahoo.png',
  image = 'https://gskbzaduwmsbaxddixmk.supabase.co/storage/v1/object/public/fish-images/Wahoo.png'
WHERE class = 'Salt'
  AND LOWER(REPLACE(REPLACE(common_name, ', ', ' '), '-', ' ')) = 'wahoo'
  AND image IS NULL;

-- Verification: Check updated records
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
ORDER BY common_name;