// Import fish data from Excel file and upload to Supabase
const XLSX = require('xlsx');
const fs = require('fs');

const SUPABASE_URL = 'https://gskbzaduwmsbaxddixmk.supabase.co'
const SUPABASE_KEY = 'sb_publishable_ZLynthSYzZz0RthCMq6zRw_7l-F4y9u'

const EXCEL_FILE_PATH = 'G:\\My Drive\\_Etzy_Alternative\\Projects\\LunkerLife\\Assets\\Fish Species\\Freshwater\\FishData_Freshwater_2026.xlsx'

// Function to convert Excel data to our database format
function convertExcelRowToFishRecord(row) {
    // Clean up function for text fields
    const clean = (value) => {
        if (!value || value === '') return null;
        return String(value).trim();
    };

    // Clean up function for numeric fields  
    const cleanNum = (value) => {
        if (!value || value === '' || value === 'N/A') return null;
        const num = parseFloat(value);
        return isNaN(num) ? null : num;
    };

    // Clean up function for boolean fields
    const cleanBool = (value) => {
        if (!value || value === '') return false;
        const str = String(value).toLowerCase().trim();
        return str === 'yes' || str === 'true' || str === '1';
    };

    return {
        image: clean(row['Image']),
        image_name_location: clean(row['Image Name & Location']),
        common_name: clean(row['Common Name']) || 'Unknown Fish',
        also_known_as: clean(row['Also Known As']),
        invasive: cleanBool(row['Invasive?']),
        description: clean(row['Description']),
        family: clean(row['Family']),
        species: clean(row['Species']),
        environmental_status: clean(row['Environmental Status']),
        habitat: clean(row['Habitat']),
        fishing_techniques: clean(row['Fishing Techniques']),
        spawning_habits_lifecycle: clean(row['Spawning Habits/Lifecycle']),
        diet_feeding_habits: clean(row['Diet/Feeding Habits']),
        range_distribution: clean(row['Range']),
        water_body_type: clean(row['Water Body Type']),
        avg_adult_weight_lbs: cleanNum(row['Avg Adult Weight (lbs)']),
        known_for: clean(row['Known For']),
        avg_adult_length_inches: cleanNum(row['Avg Adult Length (in)']),
        world_record: clean(row['World Record'])
    };
}

// Function to upload fish data to Supabase
async function uploadFishToSupabase(fishData) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/fish_species`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(fishData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Main function to process the Excel file
async function processExcelFile() {
    console.log('🐟 LuckerLife Fish Data Importer');
    console.log('=====================================\n');

    try {
        // Step 1: Read Excel file
        console.log('1️⃣ Reading Excel file...');
        console.log(`   File: ${EXCEL_FILE_PATH}`);
        
        const workbook = XLSX.readFile(EXCEL_FILE_PATH);
        console.log(`   ✅ Workbook loaded with sheets: ${workbook.SheetNames.join(', ')}`);

        // Step 2: Get first worksheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        console.log(`   📊 Processing sheet: "${sheetName}"`);

        // Step 3: Convert to JSON
        console.log('\n2️⃣ Converting Excel data to JSON...');
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log(`   ✅ Found ${jsonData.length} rows of data`);

        if (jsonData.length === 0) {
            console.log('   ❌ No data found in Excel file');
            return;
        }

        // Step 4: Show sample of column names
        const sampleRow = jsonData[0];
        const columnNames = Object.keys(sampleRow);
        console.log(`   📋 Columns found (${columnNames.length}):`);
        columnNames.forEach(col => console.log(`      - "${col}"`));

        // Step 5: Convert and validate data
        console.log('\n3️⃣ Converting to fish database format...');
        const fishRecords = [];
        let skippedRows = 0;

        for (let i = 0; i < jsonData.length; i++) {
            const row = jsonData[i];
            const fishRecord = convertExcelRowToFishRecord(row);
            
            // Skip rows without a common name
            if (!fishRecord.common_name || fishRecord.common_name === 'Unknown Fish') {
                skippedRows++;
                continue;
            }
            
            fishRecords.push(fishRecord);
        }

        console.log(`   ✅ Converted ${fishRecords.length} valid fish records`);
        if (skippedRows > 0) {
            console.log(`   ⚠️ Skipped ${skippedRows} rows without valid common names`);
        }

        // Step 6: Save JSON backup
        const jsonFilePath = 'fish-data-backup.json';
        fs.writeFileSync(jsonFilePath, JSON.stringify(fishRecords, null, 2));
        console.log(`   💾 Saved backup to: ${jsonFilePath}`);

        // Step 7: Upload to Supabase
        console.log('\n4️⃣ Uploading fish data to Supabase...');
        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        for (let i = 0; i < fishRecords.length; i++) {
            const fish = fishRecords[i];
            console.log(`   📤 [${i + 1}/${fishRecords.length}] Uploading: ${fish.common_name}`);

            const result = await uploadFishToSupabase(fish);
            
            if (result.success) {
                successCount++;
            } else {
                errorCount++;
                errors.push(`${fish.common_name}: ${result.error}`);
                console.log(`      ❌ Failed: ${result.error}`);
            }

            // Small delay to avoid overwhelming the API
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Step 8: Final results
        console.log('\n🎉 Import Complete!');
        console.log('=====================');
        console.log(`✅ Successfully imported: ${successCount} fish`);
        console.log(`❌ Failed imports: ${errorCount} fish`);

        if (errors.length > 0) {
            console.log('\n❌ Errors encountered:');
            errors.slice(0, 5).forEach(error => console.log(`   - ${error}`));
            if (errors.length > 5) {
                console.log(`   ... and ${errors.length - 5} more errors`);
            }
        }

        console.log(`\n🚀 Check your React app at: http://localhost:3003/species`);

    } catch (error) {
        console.error('💥 Error processing Excel file:', error.message);
        process.exit(1);
    }
}

// Run the import
processExcelFile();