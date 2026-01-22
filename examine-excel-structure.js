// Examine Excel file structure to understand the data layout
const XLSX = require('xlsx');

const EXCEL_FILE_PATH = 'G:\\My Drive\\_Etzy_Alternative\\Projects\\LunkerLife\\Assets\\Fish Species\\Freshwater\\FishData_Freshwater_2026.xlsx'

function examineExcelFile() {
    console.log('🔍 Examining Excel File Structure');
    console.log('==================================\n');

    try {
        // Read the Excel file
        console.log('📂 Loading Excel file...');
        const workbook = XLSX.readFile(EXCEL_FILE_PATH);
        console.log(`✅ Loaded workbook with sheets: ${workbook.SheetNames.join(', ')}\n`);

        // Examine each sheet
        workbook.SheetNames.forEach((sheetName, index) => {
            console.log(`📊 Sheet ${index + 1}: "${sheetName}"`);
            console.log('=' + '='.repeat(sheetName.length + 10));

            const worksheet = workbook.Sheets[sheetName];
            
            // Get the range of the worksheet
            const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
            console.log(`📐 Range: ${worksheet['!ref']} (${range.e.r + 1} rows, ${range.e.c + 1} columns)`);

            // Show first few rows in raw format
            console.log('\n🔤 Raw cell data (first 5 rows):');
            for (let row = 0; row <= Math.min(4, range.e.r); row++) {
                let rowData = [];
                for (let col = 0; col <= range.e.c; col++) {
                    const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                    const cell = worksheet[cellAddress];
                    const cellValue = cell ? cell.v : '';
                    rowData.push(cellValue);
                }
                console.log(`Row ${row + 1}: [${rowData.join(' | ')}]`);
            }

            // Convert to JSON with default settings
            console.log('\n📋 JSON conversion (first 3 records):');
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
            if (jsonData.length > 0) {
                console.log('Headers found:', Object.keys(jsonData[0]));
                jsonData.slice(0, 3).forEach((row, i) => {
                    console.log(`\nRecord ${i + 1}:`);
                    Object.entries(row).forEach(([key, value]) => {
                        if (value !== '') {
                            console.log(`  ${key}: ${value}`);
                        }
                    });
                });
            } else {
                console.log('No data found with standard conversion');
            }

            // Try alternative conversion - use first row as header
            console.log('\n🔄 Alternative conversion (header=1):');
            const altJsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            if (altJsonData.length > 0) {
                console.log('First few rows as arrays:');
                altJsonData.slice(0, 5).forEach((row, i) => {
                    console.log(`Row ${i + 1}:`, row);
                });
            }

            console.log('\n' + '='.repeat(50) + '\n');
        });

    } catch (error) {
        console.error('💥 Error examining Excel file:', error.message);
    }
}

examineExcelFile();