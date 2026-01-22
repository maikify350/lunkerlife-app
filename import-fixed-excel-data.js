// Fixed import script that handles the Excel structure correctly
const XLSX = require('xlsx');
const fs = require('fs');

const SUPABASE_URL = 'https://gskbzaduwmsbaxddixmk.supabase.co'
const SUPABASE_KEY = 'sb_publishable_ZLynthSYzZz0RthCMq6zRw_7l-F4y9u'
const EXCEL_FILE_PATH = 'G:\\My Drive\\_Etzy_Alternative\\Projects\\LunkerLife\\Assets\\Fish Species\\Freshwater\\FishData_Freshwater_2026.xlsx'

// Function to convert Excel data to our database format
function convertExcelRowToFishRecord(row, index) {
    // Clean up function for text fields
    const clean = (value) => {
        if (!value || value === '' || value === 'undefined') return null;
        return String(value).trim();
    };

    // Clean up function for numeric fields  
    const cleanNum = (value) => {
        if (!value || value === '' || value === 'N/A' || value === 'undefined') return null;
        // Handle ranges like ".2-.5" by taking the average
        if (String(value).includes('-')) {
            const parts = String(value).split('-');
            if (parts.length === 2) {
                const min = parseFloat(parts[0]);
                const max = parseFloat(parts[1]);
                if (!isNaN(min) && !isNaN(max)) {
                    return (min + max) / 2;
                }
            }
        }
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
        image: clean(row[1]), // Column B - Image Name & Location
        image_name_location: clean(row[1]), // Column B - Image Name & Location  
        common_name: clean(row[2]) || `Unknown Fish ${index}`, // Column C - Common Name
        also_known_as: clean(row[3]), // Column D - Also Known As
        invasive: cleanBool(row[4]), // Column E - Invasive?
        description: clean(row[5]), // Column F - Description
        family: clean(row[6]), // Column G - Family
        species: clean(row[7]), // Column H - Species
        environmental_status: clean(row[8]), // Column I - Environmental Status
        habitat: clean(row[9]), // Column J - Habitat
        fishing_techniques: clean(row[10]), // Column K - Fishing Techniques
        spawning_habits_lifecycle: clean(row[11]), // Column L - Spawning Habits/Lifecycle
        diet_feeding_habits: clean(row[12]), // Column M - Diet/Feeding Habits
        range_distribution: clean(row[13]), // Column N - Range
        water_body_type: clean(row[14]), // Column O - Water Body Type
        avg_adult_weight_lbs: cleanNum(row[15]), // Column P - Avg Adult Weight (lbs)
        known_for: clean(row[16]), // Column Q - Known For
        avg_adult_length_inches: cleanNum(row[17]), // Column R - Avg Adult Length (in)
        world_record: clean(row[18]) // Column S - World Record
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
    console.log('🐟 LuckerLife Fish Data Importer (FIXED)');
    console.log('==========================================\n');

    try {
        // Step 1: Read Excel file
        console.log('1️⃣ Reading Excel file...');
        console.log(`   File: ${EXCEL_FILE_PATH}`);
        
        const workbook = XLSX.readFile(EXCEL_FILE_PATH);
        console.log(`   ✅ Workbook loaded with sheets: ${workbook.SheetNames.join(', ')}`);

        // Step 2: Get "North America" worksheet (the one with complete data)
        const sheetName = 'North America';
        const worksheet = workbook.Sheets[sheetName];
        console.log(`   📊 Processing sheet: "${sheetName}"`);

        // Step 3: Convert to array format (rows as arrays)
        console.log('\n2️⃣ Converting Excel data to arrays...');
        const arrayData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        console.log(`   ✅ Found ${arrayData.length} rows of data`);

        if (arrayData.length < 3) {
            console.log('   ❌ Not enough data found in Excel file');
            return;
        }

        // Step 4: Show headers (row 2, index 1)
        const headers = arrayData[1]; // Row 2 has the headers
        console.log(`   📋 Headers found (row 2):`, headers);

        // Step 5: Process data starting from row 3 (index 2)
        console.log('\n3️⃣ Converting to fish database format...');
        const fishRecords = [];
        let skippedRows = 0;
        let processedRows = 0;

        // Start from row 3 (index 2) since row 1 is "Table 1" and row 2 is headers
        for (let i = 2; i < arrayData.length; i++) {
            const row = arrayData[i];
            
            // Skip empty rows
            if (!row || row.length === 0 || !row.some(cell => cell && String(cell).trim() !== '')) {
                skippedRows++;
                continue;
            }

            const fishRecord = convertExcelRowToFishRecord(row, i);
            
            // Skip rows without a meaningful common name
            if (!fishRecord.common_name || fishRecord.common_name.includes('Unknown Fish')) {
                skippedRows++;
                continue;
            }

            fishRecords.push(fishRecord);
            processedRows++;

            // Log progress for first few fish
            if (processedRows <= 5) {
                console.log(`   🐟 Found: ${fishRecord.common_name} (${fishRecord.family || 'Unknown family'})`);
            }
        }

        console.log(`   ✅ Converted ${fishRecords.length} valid fish records`);
        if (skippedRows > 0) {
            console.log(`   ⚠️ Skipped ${skippedRows} empty/invalid rows`);
        }

        // Step 6: Save JSON backup
        const jsonFilePath = 'fish-data-backup.json';
        fs.writeFileSync(jsonFilePath, JSON.stringify(fishRecords, null, 2));
        console.log(`   💾 Saved backup to: ${jsonFilePath}`);

        // Step 7: Show sample fish
        console.log('\n📋 Sample fish data:');
        fishRecords.slice(0, 3).forEach((fish, i) => {
            console.log(`\n   ${i + 1}. ${fish.common_name}`);
            console.log(`      Family: ${fish.family || 'Unknown'}`);
            console.log(`      Species: ${fish.species || 'Unknown'}`);
            console.log(`      Invasive: ${fish.invasive ? 'Yes' : 'No'}`);
            if (fish.avg_adult_weight_lbs) {
                console.log(`      Weight: ${fish.avg_adult_weight_lbs} lbs`);
            }
            if (fish.avg_adult_length_inches) {
                console.log(`      Length: ${fish.avg_adult_length_inches} inches`);
            }
        });

        // Step 8: Upload to Supabase
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
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Step 9: Final results
        console.log('\n🎉 Import Complete!');
        console.log('=====================');
        console.log(`✅ Successfully imported: ${successCount} fish`);
        console.log(`❌ Failed imports: ${errorCount} fish`);
        console.log(`📊 Total processed: ${processedRows} rows from Excel`);

        if (errors.length > 0) {
            console.log('\n❌ Errors encountered:');
            errors.slice(0, 5).forEach(error => console.log(`   - ${error}`));
            if (errors.length > 5) {
                console.log(`   ... and ${errors.length - 5} more errors`);
            }
        }

        if (successCount > 0) {
            console.log(`\n🚀 Check your React app at: http://localhost:3003/species`);
            console.log(`🐟 You should now see ${successCount} fish species from your Excel file!`);
        }

    } catch (error) {
        console.error('💥 Error processing Excel file:', error.message);
        process.exit(1);
    }
}

// Run the import
processExcelFile();