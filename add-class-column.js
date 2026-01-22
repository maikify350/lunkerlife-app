// Script to add class column to fish_species table
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gskbzaduwmsbaxddixmk.supabase.co';
const supabaseKey = 'sb_publishable_ZLynthSYzZz0RthCMq6zRw_7l-F4y9u';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addClassColumn() {
  console.log('🔧 Adding class column to fish_species...');

  try {
    // First, try to create the add_fish_class_column function
    console.log('1️⃣ Creating helper function...');
    
    const createFunctionResult = await supabase.rpc('sql', { 
      query: `
        CREATE OR REPLACE FUNCTION add_fish_class_column()
        RETURNS TEXT AS $$
        BEGIN
          -- Check if column exists
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'fish_species' AND column_name = 'class'
          ) THEN
            -- Add the column
            ALTER TABLE fish_species ADD COLUMN class VARCHAR(10) DEFAULT 'fresh' CHECK (class IN ('fresh', 'salt'));
            CREATE INDEX IF NOT EXISTS idx_fish_class ON fish_species(class);
            RETURN 'Class column added successfully';
          ELSE
            RETURN 'Class column already exists';
          END IF;
        END;
        $$ LANGUAGE plpgsql;
      `
    });

    if (createFunctionResult.error) {
      console.log('❌ Cannot create function:', createFunctionResult.error.message);
      console.log('\n📝 Manual SQL needed - use Supabase Dashboard:');
      console.log('ALTER TABLE fish_species ADD COLUMN class VARCHAR(10) DEFAULT \'fresh\' CHECK (class IN (\'fresh\', \'salt\'));');
      console.log('CREATE INDEX idx_fish_class ON fish_species(class);');
      return;
    }

    // Now execute the function
    console.log('2️⃣ Adding class column...');
    const { data, error } = await supabase.rpc('add_fish_class_column');

    if (error) {
      console.log('❌ Error adding column:', error.message);
      return;
    }

    console.log('✅', data);

    // Verify by checking some fish
    console.log('3️⃣ Verifying class column...');
    const { data: fishData, error: verifyError } = await supabase
      .from('fish_species')
      .select('common_name, family, class')
      .limit(5);

    if (verifyError) {
      console.log('❌ Error verifying:', verifyError.message);
      return;
    }

    console.log('📊 Sample fish with class column:');
    fishData.forEach(fish => {
      console.log(`   🐟 ${fish.common_name} (${fish.family}) - class: ${fish.class || 'NULL'}`);
    });

    // Count fish by class
    const { data: freshCount, error: freshError } = await supabase
      .from('fish_species')
      .select('*', { count: 'exact', head: true })
      .eq('class', 'fresh');

    if (!freshError) {
      console.log(`\n🎉 SUCCESS! ${freshCount} freshwater fish now have class='fresh'`);
      console.log('🚀 Your React app can now filter by Fresh/Salt water types!');
    }

  } catch (err) {
    console.log('💥 Unexpected error:', err.message);
  }
}

// Run the script
addClassColumn();