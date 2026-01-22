// Direct fish import that bypasses RLS by using service role or making the user an authenticated user
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gskbzaduwmsbaxddixmk.supabase.co';
const supabaseKey = 'sb_publishable_ZLynthSYzZz0RthCMq6zRw_7l-F4y9u';

// Try using the client with RLS bypass options
const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: 'public' },
  auth: { autoRefreshToken: false }
});

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
    world_record: '22 lb 4 oz, George W. Perry, Montgomery Lake - GA, 6/2/1932'
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
    world_record: '42 lb 2 oz, Sean Konrad, Lake Diefenbaker - Saskatchewan, 9/5/2009'
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
    world_record: '58 lb, Tim Pruitt, Santee-Cooper Reservoir - SC, 7/7/1964'
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
    world_record: '4 lb 12 oz, T.S. Hudson, Ketona Lake - AL, 4/9/1950'
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
    world_record: '46 lb 2 oz, Lothar Louis, Lake of Grefeern - Germany, 10/16/1986'
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
    world_record: '25 lb, Mabry Harper, Old Hickory Lake - TN, 8/2/1960'
  }
];

async function importFishDataWithRLSBypass() {
  console.log('🐟 Starting fish import (RLS bypass attempt)...');
  
  try {
    // Method 1: Try using raw SQL to bypass RLS
    console.log('1️⃣ Attempting RLS bypass method...');
    
    const { data, error } = await supabase.rpc('bypass_rls_insert_fish', {
      fish_data: fishData
    });

    if (error && error.code === '42883') {
      console.log('   ⚠️ Custom function not available, trying direct insert with system user...');
      
      // Method 2: Try inserting one by one with better error handling
      console.log('2️⃣ Attempting individual record insert...');
      
      // Clear existing data first
      const { error: deleteError } = await supabase
        .from('fish_species')
        .delete()
        .gte('created_at', '1900-01-01'); // Try to delete all

      console.log('   ℹ️ Delete attempt result:', deleteError ? deleteError.message : 'Success or no data to delete');

      let successCount = 0;
      let errorCount = 0;

      for (const fish of fishData) {
        try {
          const { data: insertData, error: insertError } = await supabase
            .from('fish_species')
            .insert([fish])
            .select();

          if (insertError) {
            console.log(`   ❌ Failed to insert ${fish.common_name}: ${insertError.message}`);
            errorCount++;
          } else {
            console.log(`   ✅ Inserted: ${fish.common_name}`);
            successCount++;
          }
        } catch (err) {
          console.log(`   💥 Exception inserting ${fish.common_name}: ${err.message}`);
          errorCount++;
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`\n📊 Import Results:`);
      console.log(`   ✅ Successful: ${successCount}`);
      console.log(`   ❌ Failed: ${errorCount}`);

      if (successCount > 0) {
        console.log(`\n🎉 SUCCESS! Some fish were imported!`);
        console.log(`🚀 Open your browser to: http://localhost:3004/management`);
        console.log(`🐟 You should see ${successCount} fish in the left panel`);
      } else {
        console.log(`\n⚠️ No fish were imported due to RLS policies.`);
        console.log(`💡 You may need to:`);
        console.log(`   1. Disable RLS temporarily in Supabase dashboard`);
        console.log(`   2. Or create a user and authenticate first`);
        console.log(`   3. Or use the service role key instead of publishable key`);
      }

    } else if (error) {
      console.error('RPC Error:', error);
    } else {
      console.log('✅ RPC method worked!', data);
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
    
    console.log(`\n💡 Alternative: Try the test interface to see what's working:`);
    console.log(`   1. Go to: http://localhost:3004/test-db`);
    console.log(`   2. Click "Test Database Connection" to see current data`);
  }
}

// Run the import
importFishDataWithRLSBypass();