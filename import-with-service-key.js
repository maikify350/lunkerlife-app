// Import script that bypasses RLS using service key or direct SQL
const XLSX = require('xlsx');
const fs = require('fs');

// For RLS bypass, we need the service key (not publishable key)
const SUPABASE_URL = 'https://gskbzaduwmsbaxddixmk.supabase.co'
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

// Function to generate SQL INSERT statements
function generateSQLInserts(fishRecords) {
    let sqlStatements = [];
    
    // Temporarily disable RLS for import
    sqlStatements.push('-- Temporarily disable RLS for import');
    sqlStatements.push('SET session_replication_role = replica;');
    sqlStatements.push('');
    
    // Clear existing data if any
    sqlStatements.push('-- Clear existing data');
    sqlStatements.push('DELETE FROM fish_species;');
    sqlStatements.push('');
    
    // Insert statements
    sqlStatements.push('-- Insert fish data');
    
    fishRecords.forEach((fish, index) => {
        const values = [
            fish.image ? `'${fish.image.replace(/'/g, "''")}'` : 'NULL',
            fish.image_name_location ? `'${fish.image_name_location.replace(/'/g, "''")}'` : 'NULL',
            `'${fish.common_name.replace(/'/g, "''")}'`,
            fish.also_known_as ? `'${fish.also_known_as.replace(/'/g, "''")}'` : 'NULL',
            fish.invasive ? 'TRUE' : 'FALSE',
            fish.description ? `'${fish.description.replace(/'/g, "''")}'` : 'NULL',
            fish.family ? `'${fish.family.replace(/'/g, "''")}'` : 'NULL',
            fish.species ? `'${fish.species.replace(/'/g, "''")}'` : 'NULL',
            fish.environmental_status ? `'${fish.environmental_status.replace(/'/g, "''")}'` : 'NULL',
            fish.habitat ? `'${fish.habitat.replace(/'/g, "''")}'` : 'NULL',
            fish.fishing_techniques ? `'${fish.fishing_techniques.replace(/'/g, "''")}'` : 'NULL',
            fish.spawning_habits_lifecycle ? `'${fish.spawning_habits_lifecycle.replace(/'/g, "''")}'` : 'NULL',
            fish.diet_feeding_habits ? `'${fish.diet_feeding_habits.replace(/'/g, "''")}'` : 'NULL',
            fish.range_distribution ? `'${fish.range_distribution.replace(/'/g, "''")}'` : 'NULL',
            fish.water_body_type ? `'${fish.water_body_type.replace(/'/g, "''")}'` : 'NULL',
            fish.avg_adult_weight_lbs || 'NULL',
            fish.known_for ? `'${fish.known_for.replace(/'/g, "''")}'` : 'NULL',
            fish.avg_adult_length_inches || 'NULL',
            fish.world_record ? `'${fish.world_record.replace(/'/g, "''")}'` : 'NULL'
        ];
        
        const insertSQL = `INSERT INTO fish_species (image, image_name_location, common_name, also_known_as, invasive, description, family, species, environmental_status, habitat, fishing_techniques, spawning_habits_lifecycle, diet_feeding_habits, range_distribution, water_body_type, avg_adult_weight_lbs, known_for, avg_adult_length_inches, world_record) VALUES (${values.join(', ')});`;
        
        sqlStatements.push(insertSQL);
    });
    
    sqlStatements.push('');
    sqlStatements.push('-- Re-enable RLS');
    sqlStatements.push('SET session_replication_role = DEFAULT;');
    sqlStatements.push('');
    sqlStatements.push('-- Verify import');
    sqlStatements.push('SELECT COUNT(*) as total_fish_imported FROM fish_species;');
    sqlStatements.push('SELECT common_name, family, invasive FROM fish_species ORDER BY common_name LIMIT 10;');
    
    return sqlStatements.join('\\n');
}

// Main function to process the Excel file and generate SQL
async function processExcelToSQL() {
    console.log('🐟 LuckerLife Fish Data to SQL Converter');
    console.log('=========================================\\n');

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
        console.log('\\n2️⃣ Converting Excel data to arrays...');
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
        console.log('\\n3️⃣ Converting to fish database format...');
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

        // Step 6: Generate SQL
        console.log('\\n4️⃣ Generating SQL import script...');
        const sqlScript = generateSQLInserts(fishRecords);
        
        // Step 7: Save SQL file
        const sqlFilePath = 'import-fish-data.sql';
        fs.writeFileSync(sqlFilePath, sqlScript);
        console.log(`   ✅ SQL script saved to: ${sqlFilePath}`);

        // Step 8: Save JSON backup
        const jsonFilePath = 'fish-data-backup.json';
        fs.writeFileSync(jsonFilePath, JSON.stringify(fishRecords, null, 2));
        console.log(`   💾 JSON backup saved to: ${jsonFilePath}`);

        // Step 9: Show sample fish
        console.log('\\n📋 Sample fish data:');
        fishRecords.slice(0, 3).forEach((fish, i) => {
            console.log(`\\n   ${i + 1}. ${fish.common_name}`);
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

        console.log('\\n🎉 SQL Generation Complete!');
        console.log('============================');
        console.log(`✅ Generated SQL script: ${sqlFilePath}`);
        console.log(`📊 Contains ${fishRecords.length} fish records`);
        console.log(`🔧 Next step: Run the SQL script in Supabase SQL editor`);
        console.log(`🌐 Supabase URL: ${SUPABASE_URL}`);
        console.log(`\\n📋 Instructions:`);
        console.log(`   1. Open Supabase dashboard -> SQL Editor`);
        console.log(`   2. Copy and paste the contents of ${sqlFilePath}`);
        console.log(`   3. Run the script`);
        console.log(`   4. Check your React app at: http://localhost:3003/species`);

    } catch (error) {
        console.error('💥 Error processing Excel file:', error.message);
        process.exit(1);
    }
}

// Run the conversion
processExcelToSQL();