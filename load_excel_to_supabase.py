#!/usr/bin/env python3
"""
Load Excel Fish Data to Supabase
Reads FishData_Freshwater_2026.xlsx and uploads to Supabase
"""

import pandas as pd
import json
from supabase import create_client, Client
import os
from datetime import datetime

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

def examine_excel_structure(filename):
    """Examine the structure of the Excel file"""
    print(f"\n[EXAMINING] {filename}")
    print("=" * 60)
    
    # Read Excel file
    excel_file = pd.ExcelFile(filename)
    
    # List all sheets
    print(f"\nSheets found: {excel_file.sheet_names}")
    
    # Read each sheet and show info
    for sheet_name in excel_file.sheet_names:
        print(f"\n[SHEET] {sheet_name}")
        print("-" * 40)
        
        df = pd.read_excel(filename, sheet_name=sheet_name)
        print(f"Shape: {df.shape}")
        print(f"\nColumns ({len(df.columns)}):")
        for col in df.columns:
            non_null = df[col].notna().sum()
            print(f"  - {col}: {df[col].dtype} ({non_null}/{len(df)} non-null)")
        
        print(f"\nFirst 3 rows preview:")
        print(df.head(3).to_string())
    
    return excel_file

def prepare_fish_data(df):
    """Prepare fish data for Supabase upload"""
    print("\n[PREPARING] Preparing data for upload...")
    
    # Create a copy to avoid modifying original
    fish_data = df.copy()
    
    # Convert column names to snake_case to match database schema
    column_mapping = {
        'Common Name': 'common_name',
        'Scientific Name': 'scientific_name',
        'Family': 'family',
        'Species': 'species',
        'Also Known As': 'also_known_as',
        'Description': 'description',
        'Habitat': 'habitat',
        'Distribution': 'distribution',
        'Average Length (inches)': 'avg_adult_length_inches',
        'Average Weight (lbs)': 'avg_adult_weight_lbs',
        'Max Length (inches)': 'max_length_inches',
        'Max Weight (lbs)': 'max_weight_lbs',
        'Diet': 'diet_feeding_habits',
        'Spawning': 'spawning_habits_lifecycle',
        'Fishing Techniques': 'fishing_techniques',
        'Conservation Status': 'conservation_status',
        'Environmental Status': 'environmental_status',
        'Water Type': 'water_type',
        'Water Body Type': 'water_body_type',
        'Temperature Range': 'temperature_range',
        'Known For': 'known_for',
        'World Record': 'world_record',
        'Invasive': 'invasive',
        'Native Range': 'native_range',
        'Image URL': 'image_url',
        'Image': 'image',
        'Notes': 'notes'
    }
    
    # Rename columns that exist
    existing_cols = {k: v for k, v in column_mapping.items() if k in fish_data.columns}
    fish_data = fish_data.rename(columns=existing_cols)
    
    # Convert data types
    if 'invasive' in fish_data.columns:
        # Convert to boolean
        fish_data['invasive'] = fish_data['invasive'].fillna(False).astype(bool)
    
    # Handle numeric columns
    numeric_cols = ['avg_adult_length_inches', 'avg_adult_weight_lbs', 
                   'max_length_inches', 'max_weight_lbs']
    for col in numeric_cols:
        if col in fish_data.columns:
            fish_data[col] = pd.to_numeric(fish_data[col], errors='coerce')
    
    # Add metadata
    fish_data['created_at'] = datetime.now().isoformat()
    fish_data['updated_at'] = datetime.now().isoformat()
    
    # Remove completely empty rows
    fish_data = fish_data.dropna(how='all')
    
    # Fill NaN values with None for proper JSON serialization
    fish_data = fish_data.where(pd.notnull(fish_data), None)
    
    print(f"[SUCCESS] Prepared {len(fish_data)} fish records")
    
    return fish_data

def upload_to_supabase(fish_data, supabase_url, supabase_key):
    """Upload fish data to Supabase"""
    print("\n[UPLOADING] Connecting to Supabase...")
    
    # Create Supabase client
    supabase: Client = create_client(supabase_url, supabase_key)
    
    # Convert DataFrame to list of dictionaries
    fish_records = fish_data.to_dict('records')
    
    print(f"[UPLOADING] Uploading {len(fish_records)} fish records...")
    
    # Upload in batches to avoid timeout
    batch_size = 50
    total_uploaded = 0
    
    for i in range(0, len(fish_records), batch_size):
        batch = fish_records[i:i + batch_size]
        
        try:
            # Insert batch into fish_species table
            result = supabase.table('fish_species').insert(batch).execute()
            total_uploaded += len(batch)
            print(f"[PROGRESS] Uploaded {total_uploaded}/{len(fish_records)} records...")
        except Exception as e:
            print(f"[ERROR] Failed to upload batch {i//batch_size + 1}: {str(e)}")
            print(f"[DEBUG] First record in failed batch: {json.dumps(batch[0], indent=2)}")
            return False
    
    print(f"[SUCCESS] Successfully uploaded {total_uploaded} fish records to Supabase!")
    return True

def main():
    """Main function to load Excel data to Supabase"""
    
    # File path
    excel_file = r"D:\WIP\LuckerLife\database\seeds\FishData_Freshwater_2026.xlsx"
    
    # Examine Excel structure
    examine_excel_structure(excel_file)
    
    # Read the main data (assuming it's in the first sheet)
    print("\n[LOADING] Loading Excel data...")
    df = pd.read_excel(excel_file)
    print(f"[SUCCESS] Loaded {len(df)} rows")
    
    # Prepare data for upload
    fish_data = prepare_fish_data(df)
    
    # Save prepared data to CSV for backup
    backup_file = 'prepared_fish_data.csv'
    fish_data.to_csv(backup_file, index=False)
    print(f"\n[BACKUP] Saved prepared data to {backup_file}")
    
    # Get Supabase credentials
    supabase_url = os.getenv('SUPABASE_URL', 'https://gskbzaduwmsbaxddixmk.supabase.co')
    supabase_key = os.getenv('SUPABASE_ANON_KEY', 'sb_publishable_ZLynthSYzZz0RthCMq6zRw_7l-F4y9u')
    
    print(f"\n[CONFIG] Supabase URL: {supabase_url}")
    
    # Ask for confirmation
    print("\n[CONFIRM] Ready to upload to Supabase.")
    print("This will add the fish data to your fish_species table.")
    response = input("Continue? (y/n): ")
    
    if response.lower() == 'y':
        upload_to_supabase(fish_data, supabase_url, supabase_key)
    else:
        print("[CANCELLED] Upload cancelled by user.")
        
    print("\n[DONE] Process complete!")

if __name__ == "__main__":
    main()