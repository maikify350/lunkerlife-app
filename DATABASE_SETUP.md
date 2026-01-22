# 🗄️ Database Setup Guide - Matching Your Spreadsheet

## CORRECTED Setup Instructions

**IMPORTANT**: The database now matches your exact 19-field Google Sheets structure!

### Setup Steps (5 minutes)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Navigate to your project: `gskbzaduwmsbaxddixmk`

2. **Run SIMPLIFIED Clean Schema**
   - Go to SQL Editor in the dashboard
   - Copy and paste the content from `database/migrations/003_simplified_clean_schema.sql`
   - Click "Run" to create the clean 19-field table structure (no unnecessary tables)

3. **Add Sample Data (Optional)**
   - Use the Import Data page in the app to upload your Google Sheets data
   - OR manually add fish through the Fish Species page
   - OR run `database/seeds/003_spreadsheet_sample_data.sql` for test data

4. **Verify Setup**
   - Refresh your React app at `http://localhost:3001/species`
   - Should see sample fish with the correct field structure

### Option 2: MCP Integration (Advanced)

If you have MCP properly configured:
1. Use the configuration in `database/supabase-config/mcp-config.json`
2. Execute schema operations through MCP server
3. Refer to findings.md for MCP best practices

## Expected Results

After setup, you should have:
- ✅ **1 main fish table** with your exact 19 spreadsheet fields
- ✅ **4 sample fish species**: Alewife, Largemouth Bass, Rainbow Trout, Northern Pike
- ✅ **Matching data structure**: Common Name, Also Known As, Invasive?, Family, Species, etc.
- ✅ **Real spreadsheet data**: Including the Alewife entry from your Google Sheets
- ✅ **Ready for import**: Structure matches your existing data perfectly

## Test Database Connection

```bash
node test-database.js
```

Expected output:
```
🧪 Testing database schema implementation...

1️⃣ Testing taxonomic_ranks table...
✅ Taxonomic ranks table exists!
   Found 8 taxonomy records
   Sample: kingdom - Animalia

2️⃣ Testing fish_species table...
✅ Fish species table exists!
   Found 2 species records
   Sample: Oncorhynchus mykiss

3️⃣ Testing fishing_techniques table...
✅ Fishing techniques table exists!
   Found 8 technique records
   - Fly Fishing (advanced)
   - Spin Fishing (beginner)
   etc...

🎉 Database schema test completed!
```

## Troubleshooting

### Common Issues:

1. **401 Unauthorized**: Check API key is correct
2. **Table not found**: Ensure schema migration ran successfully  
3. **Permission denied**: Check RLS policies in Supabase dashboard
4. **Connection timeout**: Verify Supabase project is active

### Fix Steps:

1. **Check Supabase Project Status**
   - Ensure project is not paused
   - Verify billing/usage limits

2. **Verify API Key**
   - Check key in .env file matches dashboard
   - Ensure it's the publishable key, not service key

3. **Check Database Tables**
   - In Supabase dashboard, go to Table Editor
   - Should see: taxonomic_ranks, fish_species, fish_images, etc.

## Next Steps

Once database is set up:
1. ✅ Run React development server: `npm run dev`
2. 🔄 Build fish species management interface
3. 🔄 Implement image upload system
4. 🔄 Create search and filtering

## Database Schema Overview

```
taxonomic_ranks
├── fish_species
│   ├── fish_images
│   ├── fish_distribution
│   └── species_techniques
├── fishing_techniques
└── user_profiles
```

### Key Features:
- **Scientific Accuracy**: Darwin Core taxonomic standards
- **Multi-language**: Common names in multiple languages
- **Flexible Data**: JSONB for complex characteristics
- **Image Management**: Full metadata and verification workflow
- **Geographic Tracking**: Distribution mapping capabilities
- **Performance**: Optimized indexes for search and filtering