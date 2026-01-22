-- LuckerLife Fish Data Import Script
-- Run this script in the Supabase SQL Editor
-- It will temporarily disable RLS, insert the data, and re-enable RLS

-- Temporarily disable RLS for fish_species table
ALTER TABLE fish_species DISABLE ROW LEVEL SECURITY;

-- Clear any existing data (optional - comment out if you want to append)
-- TRUNCATE TABLE fish_species;

-- Insert fish data from Excel
INSERT INTO fish_species (
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
    world_record
) VALUES
-- Alewife
(
    'Alewife.png',
    'Alewife',
    'Shad, Herring, Gaspereau, Klack, Kyack, Branch Herring, Fresh Water Herring, Grayback',
    true,
    'The alewife is a species of Herring. They exist as both anadromous and landlocked forms. The front of the body is deep and larger than other fish found in the same waters, and its common name is thought to have been derived from a corpulent female tavern keeper ("ale-wife"). The alewife has also been thought to be referenced as being "the wives of the eels" that come up the rivers at the same time as the alewife.

The alewife, like the sea herring, is grayish green above, darkest on the back, paler and silvery on sides and belly. Usually there is a dusky spot on either side just behind the margin of the gill cover (lacking in the herring) and the upper side may be faintly striped with dark longitudinal lines in large fish. The sides are iridescent in life, with shades of green and violet. The colors change, to some extent, in shade from darker to paler, or vice versa, to match the bottom below, as the fish run up stream in shallow water.

Alewives are decidedly general in their choice of streams, running indifferently up rivers as large as the Mississippi or streams so small and shallow that one can almost leap across it. The alewife grows to a length of about 15 inches, but adults average only about 10 to 11 inches long and about 8 to 9 ounces in weight.',
    'Clupeidae',
    'Alosa pseudoharengus',
    'Least Concern',
    'The alewife is a schooling species. Within habitat types, they tend to select cooler water temperatures. 

Juveniles remain in fresh water for the first six to eight months of their lives (unless landlocked in which case they spend their entire life in fresh water), feeding on small fishes and invertebrates.',
    'Primarily classified as a baitfish most shad and herring are typically caught by dip netting (scooping the fish out of shallow constricted areas during its migratory patterns up streams and rivers), cast netting, vertical dropping or cast snagging with a heftily weighted treble hook and occasionally by using a small lure or small hook rigged with cut bait.',
    'The anadromous alewife, like the shad and salmon undergoes most of its growth in the sea, but enters fresh water streams to spawn. Numbers of them are often seen in streams during spring alternately swimming ahead; resting in the eddy or behind some irregularity of the bottom; then moving ahead again. 

During the early runs sometimes one sex predominates, sometimes the other, but the late runs consist chiefly of males, as a rule, and these are said to outnumber the females greatly on the spawning grounds.

The alewife spawns in ponds, including those back of barrier beaches (if there are openings to the sea, natural or artificial) and in sluggish stretches of streams, never in swift water.

Each female deposits from 60,000 to 100,000 eggs or more, according to her size. Spawning lasts only a few days for each group of fish.

The spent fish run down stream again so soon after spawning that many of them pass others coming up, as can often be seen in the wild. Fish on their return journey to salt water are familiar sights in just about very alewife stream.

Spawning ordinarily takes place at temperatures of about 55° to 60° F. The eggs are pink like those of the sea herring and stick to brush, stones, or anything else they may make contact with or settle upon. Incubation typically takes about 6 days in 60° F water. The young alewives are about 5 mm long when hatched. They measure about 15 mm at around a month old when some begin to work their way downstream. Successive companies of fry move out of the ponds and downstream with the current throughout the summer. By autumn the young alewives have grown to about 2 to 4 inches long and have found their way down to salt water.',
    'Amphipods, copepods, fish eggs, small eels, small fish, zooplankton',
    'AL, CT, DE, FL, GA, IL, IN, MD, ME, MA, MI, MN, NC, NH, NY, OH, PA, RI, SC, VA, WI',
    'Bay, Lake, Ocean, River, Stream',
    0.35,
    'Alewife are best known for:

1. Commercial and Bait Use: While not typically targeted by sport anglers, Alewife are often used as bait for larger game fish due to their availability and abundance.

2. Forage Fish Role: They serve as an important forage fish in many aquatic ecosystems, providing a crucial food source for larger predatory fish, such as bass and trout.

3. Migration Patterns: Alewife are known for their migratory behavior, particularly in the context of spawning runs, where they move from saltwater to freshwater to reproduce, similar to salmon.

4. Ecological Impact: In some areas, Alewife have been introduced to freshwater systems where they have had significant ecological impacts, influencing food webs and competing with native species.

5. Environmental Indicator: Their presence and abundance can serve as an indicator of environmental health and the state of the aquatic ecosystem.

These characteristics make the Alewife an ecologically significant species, even if they are not a primary target for recreational fishing.',
    12.0,
    '1lb 14oz.
Bill Bennet
Inland Lake, MI
2002'
),
-- Hybrid Striped Bass
(
    'Bass-Hybrid-Striped.png',
    'Bass, Hybrid Striped',
    'Striper, Hybrid Striper, Hybrid, Lake Striper, Freshwater Striper, Wiper, Whiterock, Sunshine Bass, Rocket Bass, Palmetto Bass',
    false,
    'The hybrid striped bass is a cross between the striped bass (Morone saxatilis) and the white bass (Morone chrysops). 

It can be distinguished from the striped bass by broken rather than solid horizontal stripes on the body. Hybrids are considered better suited for culture in ponds than either parent species because they are more resilient to extremes of temperature and to low dissolved oxygen.',
    'Moronidae',
    'Morone saxatilis x Morone chrysops',
    'Least Concern',
    'Hybrid striped bass usually occupy open water and are stocked in many lakes and reservoirs within the United States. They are more tolerant to warm water than are striped bass and grow very rapidly.',
    'Hybrid striped bass fishing tackle often consists of the same heavy baitcasting, spincasting or spinning outfits with a good backbone and 15 to 25 pound test line similar to the gear used for traditional striped bass fishing.

Live bait is a preferred choice for hybrid angling and includes large minnows, gizzard shad and threadfin shad. Anglers typically hook the live bait and let it swim to entice a bite. Many leave the bail open and wait for the line to start darting after the fish has consumed the bait. After the fish has run for a bit the bail is flipped, the hook set and the angler hunkers down for one heck of a battle!

As far as artificial lures are concerned, large feathered or plastic jig combinations, spoons, crankbaits (that imitate shad or other fish) and bucktails are all deemed excellent choices for catching hybrid striped bass. Trolling, drift fishing, jump fishing and deep jigging are the top fishing methods for catching hybrid striped bass with lures.

When fishing with lures, many anglers watch for flocks of birds diving into the water as these birds are typically following schools of hybrids and stripers who are chasing baitfish to the surface. Once the flocks have been spotted the angler moves his boat close enough to cast into the frenzy in order to get in on a piece of the action. Several fish can be caught in a row when fishing this method however the fish can also disappear just as fast as they appear sometimes. Many anglers begin vertically jigging with heavy spoons or jigs once the school has submerged.',
    'The hybrid striped bass does not occur naturally. Like many hybrids, they experience great difficulty reproducing naturally. Eggs and sperm produced by hybrids are usually weak or improperly formed. The same is true of any fry that might be produced by chance fertilization. For this reason, hybrids are considered "functionally sterile."  

Hybrid striped bass populations are completely dependent on the stocking of each state''s Division of Wildlife on an annual basis to maintain sport fisheries. 

The hybrid striped bass is created by crossing a female striped bass with a male white bass.',
    'Small fish, invertebrates',
    'AL, AZ, AR, CA, CO, CT, DE, DC, FL, GA, HI, ID, IL, IN, IA, KS, KY, LA, ME, MD, MA, MI, MN, MS, MO, MT, NE, NV, NH, NJ, NM, NY, NC, ND, OH, OK, OR, PA, RI, SC, SD, TN, TX, UT, VT, VA, WA, WV, WI, WY',
    'Bay, Lake, River',
    7.5,
    'Hybrid Striped Bass are best known for:

1. Sport Fishing Appeal: They are popular among anglers for their strong fight and aggressive behavior, offering a challenging and rewarding fishing experience.

2. Hybrid Vigor: As hybrids of striped bass and white bass, they possess desirable traits from both species, such as higher growth rates, greater hardiness, and adaptability to a range of environmental conditions.

3. Adaptability: Capable of thriving in both freshwater and slightly salty waters, hybrid striped bass can be found in various habitats, making them accessible for fishing in diverse locations.

4. Size: Known for their potential to grow to substantial sizes, they are often pursued by anglers seeking sizeable catches.

5. Stocking Programs: Due to their popularity and adaptability, hybrid striped bass are often stocked in recreational fishing areas, enhancing local fishing opportunities.

These characteristics make Hybrid Striped Bass a highly sought-after fish in the world of sport fishing.',
    22.0,
    '27 lb 5 oz,
Jerald C. Shaum,
Shirly - AR,
4/24/97'
);

-- Add more fish records here...
-- NOTE: Due to the large amount of data, I'm showing just 2 examples
-- You would need to add all 85 fish records in this format

-- Re-enable RLS for fish_species table
ALTER TABLE fish_species ENABLE ROW LEVEL SECURITY;

-- Create a basic RLS policy to allow public reads
CREATE POLICY "Allow public read access" ON fish_species
    FOR SELECT USING (true);

-- Count inserted records
SELECT COUNT(*) as total_fish FROM fish_species;