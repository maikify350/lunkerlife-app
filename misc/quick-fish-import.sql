-- Quick Fish Data Import for Testing
-- This imports a subset of fish to test the interface

-- Clear existing data and start fresh
DELETE FROM fish_species;

-- Insert 10 sample fish species with complete data
INSERT INTO fish_species (
    image, 
    image_name_location, 
    common_name, 
    also_known_as, 
    invasive, 
    description, 
    family, 
    species, 
    environmental_status, 
    habitat, 
    fishing_techniques, 
    spawning_habits_lifecycle, 
    diet_feeding_habits, 
    range_distribution, 
    water_body_type, 
    avg_adult_weight_lbs, 
    known_for, 
    avg_adult_length_inches, 
    world_record,
    class
) VALUES 

-- 1. Largemouth Bass
('Bass-Largemouth.png', 'Bass-Largemouth.png', 'Bass, Largemouth', 'Black Bass, Bigmouth, Bucketmouth, Green Bass, Green Trout', false, 'The largemouth bass is the most popular game fish in North America. It is usually dark greenish above fading to a whitish belly, but variable depending on the water it lives in.', 'Centrarchidae', 'Micropterus salmoides', 'Least Concern', 'Largemouths inhabit warm, shallow lakes, ponds and slow-moving streams, with plenty of submerged vegetation, brush, stumps and logs.', 'Topwater lures, spinnerbaits, jigs, soft plastics, crankbaits are all effective for largemouth bass fishing.', 'Spawns from late April to early June when water warms to between 62° and 78°F. Males fan out nests along protected shorelines.', 'Small fish, aquatic insects, terrestrial insects, worms, snakes, salamanders, frogs, tadpoles, small mammals, ducklings', 'Throughout North America, introduced worldwide', 'Lake, Pond, River', 3.0, 'Most popular sport fish in North America, known for aggressive strikes and strong fighting ability', 15.0, '22 lb 4 oz, George W. Perry, Montgomery Lake - GA, 6/2/1932', 'Fresh'),

-- 2. Rainbow Trout  
('Trout-Rainbow.png', 'Trout-Rainbow.png', 'Trout, Rainbow', 'Steelhead, Bow', false, 'Rainbow trout are among the most beautiful and sought-after freshwater game fish. They have a distinctive pink stripe along their sides and are known for their acrobatic fights.', 'Salmonidae', 'Oncorhynchus mykiss', 'Least Concern', 'Cold, clear streams and lakes with high oxygen content. Prefer temperatures between 50-60°F.', 'Fly fishing with dry flies, nymphs, and streamers. Spinning with small lures, spoons, and bait.', 'Spawn in spring in gravel redds. Females dig nests in gravel where eggs are fertilized and covered.', 'Insects, small fish, crustaceans, worms. Surface feeding on emerging insects common.', 'Native to Pacific coast, widely introduced throughout North America', 'Lake, River, Stream', 2.5, 'Exceptional fighting ability, acrobatic jumps, beautiful coloration, excellent table fare', 14.0, '42 lb 2 oz, Sean Konrad, Lake Diefenbaker - Saskatchewan, 9/5/2009', 'Fresh'),

-- 3. Channel Catfish
('Catfish-Channel.png', 'Catfish-Channel.png', 'Catfish, Channel', 'Channel Cat, Fiddler', false, 'Channel catfish are one of North America most popular food and sport fish. They have a deeply forked tail and are excellent eating.', 'Ictaluridae', 'Ictalurus punctatus', 'Least Concern', 'Rivers, lakes, and ponds with soft bottoms. Prefer areas with cover like fallen trees, rock piles, or vegetation.', 'Bottom fishing with live bait, cut bait, stink baits. Popular baits include worms, minnows, chicken liver, and commercial catfish baits.', 'Spawn in late spring/early summer. Males prepare nests in cavities under logs, rocks, or banks and guard the eggs.', 'Omnivorous - insects, small fish, crayfish, mollusks, plant material, organic matter', 'Native to central and eastern North America, widely introduced', 'Lake, Pond, River', 2.8, 'Excellent table fare, strong fighters, widely available, easy to catch', 18.0, '58 lb, Tim Pruitt, Santee-Cooper Reservoir - SC, 7/7/1964', 'Fresh'),

-- 4. Bluegill
('Sunfish-Bluegill.png', 'Sunfish-Bluegill.png', 'Sunfish, Bluegill', 'Bream, Brim, Copper Nose', false, 'Bluegill are a popular panfish known for their willingness to bite and excellent table fare. They have a distinctive blue-black gill flap.', 'Centrarchidae', 'Lepomis macrochirus', 'Least Concern', 'Shallow areas of lakes, ponds, and slow streams near vegetation, fallen trees, or other cover.', 'Light tackle with small hooks. Live bait like worms, crickets, or small jigs and spinners work well.', 'Spawn in spring in shallow water. Males create circular nests in gravel or sand and guard the eggs and fry.', 'Insects, small crustaceans, fish eggs, small fish, plant material', 'Native to eastern North America, widely introduced', 'Lake, Pond, Stream', 0.5, 'Great for beginners, excellent table fare, abundant, fun to catch on light tackle', 8.0, '4 lb 12 oz, T.S. Hudson, Ketona Lake - AL, 4/9/1950', 'Fresh'),

-- 5. Northern Pike
('Pike-Northern.png', 'Pike-Northern.png', 'Pike, Northern', 'Great Northern Pike, Jackfish, Snake', false, 'Northern pike are aggressive predators known for their torpedo-shaped body and razor-sharp teeth. They are ambush predators that strike with explosive speed.', 'Esocidae', 'Esox lucius', 'Least Concern', 'Weedy areas of lakes and slow rivers. Prefer areas with vegetation for ambush hunting.', 'Large spoons, spinnerbaits, jerkbaits, and large soft plastics. Live bait fishing with large minnows is also effective.', 'Spawn in early spring in shallow, weedy areas soon after ice-out. Eggs are scattered over vegetation.', 'Fish, frogs, small mammals, waterfowl. Opportunistic predators that will eat almost anything that moves.', 'Northern regions of North America, Europe, and Asia', 'Lake, River', 5.0, 'Aggressive strikes, powerful fights, impressive size potential, exciting fishing', 24.0, '46 lb 2 oz, Lothar Louis, Lake of Grefeern - Germany, 10/16/1986', 'Fresh'),

-- 6. Walleye
('Walleye.png', 'Walleye.png', 'Walleye', 'Yellow Pike, Yellow Pickerel, Wall-eyed Pike', false, 'Walleye are prized for their excellent eating quality and are considered one of the best-tasting freshwater fish. They have distinctive large, glassy eyes.', 'Percidae', 'Sander vitreus', 'Least Concern', 'Clear lakes and rivers with rocky or gravel bottoms. Often found in deeper water during the day.', 'Jigging with live bait, trolling with crankbaits, casting jigs and soft plastics. Night fishing can be very productive.', 'Spawn in spring over rocky areas in rivers or lake shorelines. Males arrive first and females deposit eggs over gravel.', 'Small fish, crayfish, insects, leeches. Feed primarily at dawn, dusk, and night.', 'Northern United States and southern Canada', 'Lake, River', 2.0, 'Exceptional table fare, consistent fishing, good size, cooperative biting habits', 16.0, '25 lb, Mabry Harper, Old Hickory Lake - TN, 8/2/1960', 'Fresh'),

-- 7. Smallmouth Bass  
('Bass-Smallmouth.png', 'Bass-Smallmouth.png', 'Bass, Smallmouth', 'Bronzeback, Smallie', false, 'Smallmouth bass are pound-for-pound one of the strongest fighting freshwater fish. They prefer clearer, cooler water than largemouth bass.', 'Centrarchidae', 'Micropterus dolomieu', 'Least Concern', 'Rocky areas of clear lakes and flowing rivers. Prefer cooler water temperatures than largemouth bass.', 'Topwater lures, spinnerbaits, crankbaits, jigs, soft plastics. Excellent on light tackle and fly fishing gear.', 'Spawn in late spring/early summer. Males create nests in gravel or rocky areas and guard eggs and fry.', 'Crayfish, small fish, insects. Crayfish are a primary food source in most waters.', 'Native to eastern North America, widely introduced', 'Lake, River, Stream', 2.0, 'Incredible fighting ability, acrobatic jumps, excellent on light tackle', 14.0, '11 lb 15 oz, David Hayes, Dale Hollow Lake - KY, 7/9/1955', 'Fresh'),

-- 8. Crappie, Black
('Crappie-Black.png', 'Crappie-Black.png', 'Crappie, Black', 'Calico Bass, Strawberry Bass', false, 'Black crappie are excellent eating panfish with sweet, white meat. They often school in large numbers making for fast action fishing.', 'Centrarchidae', 'Pomoxis nigromaculatus', 'Least Concern', 'Areas with structure like fallen trees, brush piles, or vegetation in lakes and slow rivers.', 'Light tackle with small jigs, minnows, or small spinners. Vertical jigging around structure is very effective.', 'Spawn in spring in shallow areas. Males create nests in gravel or sand near cover and guard the nest.', 'Small fish, insects, crustaceans, zooplankton. Feed heavily on small minnows and insects.', 'Eastern North America, widely introduced', 'Lake, Pond, River', 0.75, 'Excellent table fare, schooling behavior allows for multiple catches, sweet-tasting meat', 10.0, '6 lb, Lettie Robertson, Kerr Lake - VA, 1981', 'Fresh'),

-- 9. Yellow Perch
('Perch-Yellow.png', 'Perch-Yellow.png', 'Perch, Yellow', 'American Perch, Lake Perch', false, 'Yellow perch are popular panfish known for their distinctive yellow coloration with dark vertical bars. They are excellent eating and fun to catch.', 'Percidae', 'Perca flavescens', 'Least Concern', 'Clear lakes and slow rivers with vegetation. Often found in schools in open water or near structure.', 'Light tackle with small jigs, live bait like worms or minnows, small spoons and spinners.', 'Spawn in early spring over vegetation in shallow areas. Eggs are laid in long gelatinous strands.', 'Small fish, insects, crayfish, zooplankton. Opportunistic feeders that hunt in schools.', 'Northern United States and southern Canada', 'Lake, Pond, River', 0.5, 'Excellent table fare, schooling behavior, beautiful coloration, consistent action', 9.0, '4 lb 3 oz, Borger Borger, Crosswinds Lake - NJ, 5/1985', 'Fresh'),

-- 10. Alewife (invasive example)
('Alewife.png', 'Alewife.png', 'Alewife', 'Shad, Herring, Gaspereau', true, 'The alewife is a species of herring that can be both beneficial as forage fish and problematic when introduced to new waters.', 'Clupeidae', 'Alosa pseudoharengus', 'Least Concern', 'Coastal areas, lakes connected to the ocean, and some landlocked populations in the Great Lakes.', 'Primarily caught by dip netting during spawning runs, cast nets, or as bycatch when targeting other species.', 'Anadromous populations spawn in freshwater streams and rivers in spring. Landlocked populations spawn in shallow lake areas.', 'Zooplankton, small crustaceans, small fish, fish eggs', 'Atlantic coast of North America, introduced to Great Lakes', 'Bay, Lake, Ocean, River, Stream', 0.35, 'Important forage fish for larger game species, but can become overpopulated in some systems', 12.0, '1lb 14oz, Bill Bennet, Inland Lake - MI, 2002', 'Fresh');

-- Verify the import
SELECT 
    'Fish import completed!' as status,
    COUNT(*) as total_fish,
    COUNT(CASE WHEN invasive = true THEN 1 END) as invasive_count,
    COUNT(CASE WHEN invasive = false THEN 1 END) as native_count,
    COUNT(CASE WHEN class = 'Fresh' THEN 1 END) as fresh_count
FROM fish_species;

-- Show sample of imported data
SELECT common_name, family, invasive, class, avg_adult_weight_lbs, avg_adult_length_inches 
FROM fish_species 
ORDER BY common_name 
LIMIT 10;