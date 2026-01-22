// Direct fish import using Supabase connection
// This will clear existing data and import fish species directly

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gskbzaduwmsbaxddixmk.supabase.co';
const supabaseKey = 'sb_publishable_ZLynthSYzZz0RthCMq6zRw_7l-F4y9u';

const supabase = createClient(supabaseUrl, supabaseKey);

const fishData = [
  {
    image: 'Bass-Largemouth.png',
    image_name_location: 'Bass-Largemouth.png',
    common_name: 'Bass, Largemouth',
    also_known_as: 'Black Bass, Bigmouth, Bucketmouth, Green Bass, Green Trout',
    invasive: false,
    description: 'The largemouth bass is the most popular game fish in North America. It is usually dark greenish above fading to a whitish belly, but variable depending on the water it lives in.',
    family: 'Centrarchidae',
    species: 'Micropterus salmoides',
    environmental_status: 'Least Concern',
    habitat: 'Largemouths inhabit warm, shallow lakes, ponds and slow-moving streams, with plenty of submerged vegetation, brush, stumps and logs.',
    fishing_techniques: 'Topwater lures, spinnerbaits, jigs, soft plastics, crankbaits are all effective for largemouth bass fishing.',
    spawning_habits_lifecycle: 'Spawns from late April to early June when water warms to between 62° and 78°F. Males fan out nests along protected shorelines.',
    diet_feeding_habits: 'Small fish, aquatic insects, terrestrial insects, worms, snakes, salamanders, frogs, tadpoles, small mammals, ducklings',
    range_distribution: 'Throughout North America, introduced worldwide',
    water_body_type: 'Lake, Pond, River',
    avg_adult_weight_lbs: 3.0,
    known_for: 'Most popular sport fish in North America, known for aggressive strikes and strong fighting ability',
    avg_adult_length_inches: 15.0,
    world_record: '22 lb 4 oz, George W. Perry, Montgomery Lake - GA, 6/2/1932',
    class: 'Fresh'
  },
  {
    image: 'Trout-Rainbow.png',
    image_name_location: 'Trout-Rainbow.png',
    common_name: 'Trout, Rainbow',
    also_known_as: 'Steelhead, Bow',
    invasive: false,
    description: 'Rainbow trout are among the most beautiful and sought-after freshwater game fish. They have a distinctive pink stripe along their sides and are known for their acrobatic fights.',
    family: 'Salmonidae',
    species: 'Oncorhynchus mykiss',
    environmental_status: 'Least Concern',
    habitat: 'Cold, clear streams and lakes with high oxygen content. Prefer temperatures between 50-60°F.',
    fishing_techniques: 'Fly fishing with dry flies, nymphs, and streamers. Spinning with small lures, spoons, and bait.',
    spawning_habits_lifecycle: 'Spawn in spring in gravel redds. Females dig nests in gravel where eggs are fertilized and covered.',
    diet_feeding_habits: 'Insects, small fish, crustaceans, worms. Surface feeding on emerging insects common.',
    range_distribution: 'Native to Pacific coast, widely introduced throughout North America',
    water_body_type: 'Lake, River, Stream',
    avg_adult_weight_lbs: 2.5,
    known_for: 'Exceptional fighting ability, acrobatic jumps, beautiful coloration, excellent table fare',
    avg_adult_length_inches: 14.0,
    world_record: '42 lb 2 oz, Sean Konrad, Lake Diefenbaker - Saskatchewan, 9/5/2009',
    class: 'Fresh'
  },
  {
    image: 'Catfish-Channel.png',
    image_name_location: 'Catfish-Channel.png',
    common_name: 'Catfish, Channel',
    also_known_as: 'Channel Cat, Fiddler',
    invasive: false,
    description: 'Channel catfish are one of North America most popular food and sport fish. They have a deeply forked tail and are excellent eating.',
    family: 'Ictaluridae',
    species: 'Ictalurus punctatus',
    environmental_status: 'Least Concern',
    habitat: 'Rivers, lakes, and ponds with soft bottoms. Prefer areas with cover like fallen trees, rock piles, or vegetation.',
    fishing_techniques: 'Bottom fishing with live bait, cut bait, stink baits. Popular baits include worms, minnows, chicken liver, and commercial catfish baits.',
    spawning_habits_lifecycle: 'Spawn in late spring/early summer. Males prepare nests in cavities under logs, rocks, or banks and guard the eggs.',
    diet_feeding_habits: 'Omnivorous - insects, small fish, crayfish, mollusks, plant material, organic matter',
    range_distribution: 'Native to central and eastern North America, widely introduced',
    water_body_type: 'Lake, Pond, River',
    avg_adult_weight_lbs: 2.8,
    known_for: 'Excellent table fare, strong fighters, widely available, easy to catch',
    avg_adult_length_inches: 18.0,
    world_record: '58 lb, Tim Pruitt, Santee-Cooper Reservoir - SC, 7/7/1964',
    class: 'Fresh'
  },
  {
    image: 'Sunfish-Bluegill.png',
    image_name_location: 'Sunfish-Bluegill.png',
    common_name: 'Sunfish, Bluegill',
    also_known_as: 'Bream, Brim, Copper Nose',
    invasive: false,
    description: 'Bluegill are a popular panfish known for their willingness to bite and excellent table fare. They have a distinctive blue-black gill flap.',
    family: 'Centrarchidae',
    species: 'Lepomis macrochirus',
    environmental_status: 'Least Concern',
    habitat: 'Shallow areas of lakes, ponds, and slow streams near vegetation, fallen trees, or other cover.',
    fishing_techniques: 'Light tackle with small hooks. Live bait like worms, crickets, or small jigs and spinners work well.',
    spawning_habits_lifecycle: 'Spawn in spring in shallow water. Males create circular nests in gravel or sand and guard the eggs and fry.',
    diet_feeding_habits: 'Insects, small crustaceans, fish eggs, small fish, plant material',
    range_distribution: 'Native to eastern North America, widely introduced',
    water_body_type: 'Lake, Pond, Stream',
    avg_adult_weight_lbs: 0.5,
    known_for: 'Great for beginners, excellent table fare, abundant, fun to catch on light tackle',
    avg_adult_length_inches: 8.0,
    world_record: '4 lb 12 oz, T.S. Hudson, Ketona Lake - AL, 4/9/1950',
    class: 'Fresh'
  },
  {
    image: 'Pike-Northern.png',
    image_name_location: 'Pike-Northern.png',
    common_name: 'Pike, Northern',
    also_known_as: 'Great Northern Pike, Jackfish, Snake',
    invasive: false,
    description: 'Northern pike are aggressive predators known for their torpedo-shaped body and razor-sharp teeth. They are ambush predators that strike with explosive speed.',
    family: 'Esocidae',
    species: 'Esox lucius',
    environmental_status: 'Least Concern',
    habitat: 'Weedy areas of lakes and slow rivers. Prefer areas with vegetation for ambush hunting.',
    fishing_techniques: 'Large spoons, spinnerbaits, jerkbaits, and large soft plastics. Live bait fishing with large minnows is also effective.',
    spawning_habits_lifecycle: 'Spawn in early spring in shallow, weedy areas soon after ice-out. Eggs are scattered over vegetation.',
    diet_feeding_habits: 'Fish, frogs, small mammals, waterfowl. Opportunistic predators that will eat almost anything that moves.',
    range_distribution: 'Northern regions of North America, Europe, and Asia',
    water_body_type: 'Lake, River',
    avg_adult_weight_lbs: 5.0,
    known_for: 'Aggressive strikes, powerful fights, impressive size potential, exciting fishing',
    avg_adult_length_inches: 24.0,
    world_record: '46 lb 2 oz, Lothar Louis, Lake of Grefeern - Germany, 10/16/1986',
    class: 'Fresh'
  },
  {
    image: 'Walleye.png',
    image_name_location: 'Walleye.png',
    common_name: 'Walleye',
    also_known_as: 'Yellow Pike, Yellow Pickerel, Wall-eyed Pike',
    invasive: false,
    description: 'Walleye are prized for their excellent eating quality and are considered one of the best-tasting freshwater fish. They have distinctive large, glassy eyes.',
    family: 'Percidae',
    species: 'Sander vitreus',
    environmental_status: 'Least Concern',
    habitat: 'Clear lakes and rivers with rocky or gravel bottoms. Often found in deeper water during the day.',
    fishing_techniques: 'Jigging with live bait, trolling with crankbaits, casting jigs and soft plastics. Night fishing can be very productive.',
    spawning_habits_lifecycle: 'Spawn in spring over rocky areas in rivers or lake shorelines. Males arrive first and females deposit eggs over gravel.',
    diet_feeding_habits: 'Small fish, crayfish, insects, leeches. Feed primarily at dawn, dusk, and night.',
    range_distribution: 'Northern United States and southern Canada',
    water_body_type: 'Lake, River',
    avg_adult_weight_lbs: 2.0,
    known_for: 'Exceptional table fare, consistent fishing, good size, cooperative biting habits',
    avg_adult_length_inches: 16.0,
    world_record: '25 lb, Mabry Harper, Old Hickory Lake - TN, 8/2/1960',
    class: 'Fresh'
  },
  {
    image: 'Bass-Smallmouth.png',
    image_name_location: 'Bass-Smallmouth.png',
    common_name: 'Bass, Smallmouth',
    also_known_as: 'Bronzeback, Smallie',
    invasive: false,
    description: 'Smallmouth bass are pound-for-pound one of the strongest fighting freshwater fish. They prefer clearer, cooler water than largemouth bass.',
    family: 'Centrarchidae',
    species: 'Micropterus dolomieu',
    environmental_status: 'Least Concern',
    habitat: 'Rocky areas of clear lakes and flowing rivers. Prefer cooler water temperatures than largemouth bass.',
    fishing_techniques: 'Topwater lures, spinnerbaits, crankbaits, jigs, soft plastics. Excellent on light tackle and fly fishing gear.',
    spawning_habits_lifecycle: 'Spawn in late spring/early summer. Males create nests in gravel or rocky areas and guard eggs and fry.',
    diet_feeding_habits: 'Crayfish, small fish, insects. Crayfish are a primary food source in most waters.',
    range_distribution: 'Native to eastern North America, widely introduced',
    water_body_type: 'Lake, River, Stream',
    avg_adult_weight_lbs: 2.0,
    known_for: 'Incredible fighting ability, acrobatic jumps, excellent on light tackle',
    avg_adult_length_inches: 14.0,
    world_record: '11 lb 15 oz, David Hayes, Dale Hollow Lake - KY, 7/9/1955',
    class: 'Fresh'
  },
  {
    image: 'Crappie-Black.png',
    image_name_location: 'Crappie-Black.png',
    common_name: 'Crappie, Black',
    also_known_as: 'Calico Bass, Strawberry Bass',
    invasive: false,
    description: 'Black crappie are excellent eating panfish with sweet, white meat. They often school in large numbers making for fast action fishing.',
    family: 'Centrarchidae',
    species: 'Pomoxis nigromaculatus',
    environmental_status: 'Least Concern',
    habitat: 'Areas with structure like fallen trees, brush piles, or vegetation in lakes and slow rivers.',
    fishing_techniques: 'Light tackle with small jigs, minnows, or small spinners. Vertical jigging around structure is very effective.',
    spawning_habits_lifecycle: 'Spawn in spring in shallow areas. Males create nests in gravel or sand near cover and guard the nest.',
    diet_feeding_habits: 'Small fish, insects, crustaceans, zooplankton. Feed heavily on small minnows and insects.',
    range_distribution: 'Eastern North America, widely introduced',
    water_body_type: 'Lake, Pond, River',
    avg_adult_weight_lbs: 0.75,
    known_for: 'Excellent table fare, schooling behavior allows for multiple catches, sweet-tasting meat',
    avg_adult_length_inches: 10.0,
    world_record: '6 lb, Lettie Robertson, Kerr Lake - VA, 1981',
    class: 'Fresh'
  },
  {
    image: 'Perch-Yellow.png',
    image_name_location: 'Perch-Yellow.png',
    common_name: 'Perch, Yellow',
    also_known_as: 'American Perch, Lake Perch',
    invasive: false,
    description: 'Yellow perch are popular panfish known for their distinctive yellow coloration with dark vertical bars. They are excellent eating and fun to catch.',
    family: 'Percidae',
    species: 'Perca flavescens',
    environmental_status: 'Least Concern',
    habitat: 'Clear lakes and slow rivers with vegetation. Often found in schools in open water or near structure.',
    fishing_techniques: 'Light tackle with small jigs, live bait like worms or minnows, small spoons and spinners.',
    spawning_habits_lifecycle: 'Spawn in early spring over vegetation in shallow areas. Eggs are laid in long gelatinous strands.',
    diet_feeding_habits: 'Small fish, insects, crayfish, zooplankton. Opportunistic feeders that hunt in schools.',
    range_distribution: 'Northern United States and southern Canada',
    water_body_type: 'Lake, Pond, River',
    avg_adult_weight_lbs: 0.5,
    known_for: 'Excellent table fare, schooling behavior, beautiful coloration, consistent action',
    avg_adult_length_inches: 9.0,
    world_record: '4 lb 3 oz, Borger Borger, Crosswinds Lake - NJ, 5/1985',
    class: 'Fresh'
  },
  {
    image: 'Alewife.png',
    image_name_location: 'Alewife.png',
    common_name: 'Alewife',
    also_known_as: 'Shad, Herring, Gaspereau',
    invasive: true,
    description: 'The alewife is a species of herring that can be both beneficial as forage fish and problematic when introduced to new waters.',
    family: 'Clupeidae',
    species: 'Alosa pseudoharengus',
    environmental_status: 'Least Concern',
    habitat: 'Coastal areas, lakes connected to the ocean, and some landlocked populations in the Great Lakes.',
    fishing_techniques: 'Primarily caught by dip netting during spawning runs, cast nets, or as bycatch when targeting other species.',
    spawning_habits_lifecycle: 'Anadromous populations spawn in freshwater streams and rivers in spring. Landlocked populations spawn in shallow lake areas.',
    diet_feeding_habits: 'Zooplankton, small crustaceans, small fish, fish eggs',
    range_distribution: 'Atlantic coast of North America, introduced to Great Lakes',
    water_body_type: 'Bay, Lake, Ocean, River, Stream',
    avg_adult_weight_lbs: 0.35,
    known_for: 'Important forage fish for larger game species, but can become overpopulated in some systems',
    avg_adult_length_inches: 12.0,
    world_record: '1lb 14oz, Bill Bennet, Inland Lake - MI, 2002',
    class: 'Fresh'
  }
];

async function importFishData() {
  console.log('🐟 Starting direct fish import...');
  
  try {
    // Step 1: Clear existing data
    console.log('1️⃣ Clearing existing fish data...');
    const { error: deleteError } = await supabase
      .from('fish_species')
      .delete()
      .gte('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

    if (deleteError) {
      console.error('Error clearing data:', deleteError);
      return;
    }
    console.log('   ✅ Existing data cleared');

    // Step 2: Add class column if it doesn't exist
    console.log('2️⃣ Checking/adding class column...');
    try {
      // Try to insert a test record with class to see if column exists
      const testData = { ...fishData[0], common_name: 'TEST_RECORD_DELETE_ME' };
      const { error: testError } = await supabase
        .from('fish_species')
        .insert([testData]);
      
      if (testError && testError.message.includes('column "class" of relation')) {
        console.log('   ⚠️ Class column does not exist. You may need to run the schema update manually.');
      } else {
        // Delete the test record
        await supabase
          .from('fish_species')
          .delete()
          .eq('common_name', 'TEST_RECORD_DELETE_ME');
      }
    } catch (error) {
      console.log('   ⚠️ Could not test class column. Proceeding with import...');
    }

    // Step 3: Insert fish data
    console.log('3️⃣ Importing fish species...');
    const { data, error } = await supabase
      .from('fish_species')
      .insert(fishData)
      .select();

    if (error) {
      console.error('Error importing fish data:', error);
      console.log('\n💡 If you see a "class" column error, you need to add the class column to your database schema.');
      console.log('   This can be done by running the migration script in Supabase dashboard.');
      return;
    }

    console.log('✅ Fish data imported successfully!');
    console.log(`📊 Imported ${data.length} fish species:`);
    
    data.forEach((fish, index) => {
      console.log(`   ${index + 1}. ${fish.common_name} (${fish.family}) - ${fish.invasive ? 'Invasive' : 'Native'}`);
    });

    // Step 4: Verify import
    console.log('\n4️⃣ Verifying import...');
    const { data: allFish, error: verifyError } = await supabase
      .from('fish_species')
      .select('id, common_name, family, invasive, class')
      .order('common_name');

    if (verifyError) {
      console.error('Error verifying import:', verifyError);
      return;
    }

    console.log(`\n🎉 IMPORT COMPLETE!`);
    console.log(`📈 Database Summary:`);
    console.log(`   • Total fish: ${allFish.length}`);
    console.log(`   • Native species: ${allFish.filter(f => !f.invasive).length}`);
    console.log(`   • Invasive species: ${allFish.filter(f => f.invasive).length}`);
    console.log(`   • Fresh water: ${allFish.filter(f => f.class === 'Fresh').length}`);
    
    console.log(`\n🚀 Next steps:`);
    console.log(`   1. Open your browser to: http://localhost:3004/management`);
    console.log(`   2. You should now see the fish list on the left`);
    console.log(`   3. Click any fish to view/edit details on the right`);
    console.log(`   4. Test the All/Fresh/Salt filter buttons`);

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Run the import
importFishData();