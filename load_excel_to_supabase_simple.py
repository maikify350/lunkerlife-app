#!/usr/bin/env python3
"""
Load Excel Fish Data to Supabase (Simple Version)
Uses pandas and requests to upload data
"""

import pandas as pd
import json
import requests
from datetime import datetime
import os
import sys
import io

# Set UTF-8 encoding for stdout
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def examine_excel_structure(filename):
    """Examine the structure of the Excel file"""
    print(f"\n[EXAMINING] {filename}")
    print("=" * 60)
    
    # Read Excel file
    excel_file = pd.ExcelFile(filename)
    
    # List all sheets
    print(f"\nSheets found: {excel_file.sheet_names}")
    
    # Read each sheet and show info
    all_data = {}
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
        
        all_data[sheet_name] = df
    
    return all_data

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
        'Notes': 'notes',
        'Range/Distribution': 'range_distribution',
        'Spawning Habits & Lifecycle': 'spawning_habits_lifecycle',
        'Diet/Feeding Habits': 'diet_feeding_habits'
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

def upload_to_supabase_api(fish_data, supabase_url, supabase_key):
    """Upload fish data to Supabase using REST API"""
    print("\n[UPLOADING] Connecting to Supabase...")
    
    # Prepare headers
    headers = {
        'apikey': supabase_key,
        'Authorization': f'Bearer {supabase_key}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }
    
    # API endpoint for fish_species table
    api_url = f"{supabase_url}/rest/v1/fish_species"
    
    # Convert DataFrame to list of dictionaries
    fish_records = fish_data.to_dict('records')
    
    # Clean up records (remove None values, ensure JSON serializable)
    cleaned_records = []
    for record in fish_records:
        cleaned_record = {k: v for k, v in record.items() if v is not None}
        cleaned_records.append(cleaned_record)
    
    print(f"[UPLOADING] Uploading {len(cleaned_records)} fish records...")
    
    # Upload in batches to avoid timeout
    batch_size = 20
    total_uploaded = 0
    failed_records = []
    
    for i in range(0, len(cleaned_records), batch_size):
        batch = cleaned_records[i:i + batch_size]
        
        try:
            # Make POST request
            response = requests.post(api_url, 
                                   headers=headers, 
                                   data=json.dumps(batch))
            
            if response.status_code in [200, 201]:
                total_uploaded += len(batch)
                print(f"[PROGRESS] Uploaded {total_uploaded}/{len(cleaned_records)} records...")
            else:
                print(f"[ERROR] Failed batch {i//batch_size + 1}: {response.status_code}")
                print(f"[ERROR] Response: {response.text}")
                failed_records.extend(batch)
                
        except Exception as e:
            print(f"[ERROR] Exception in batch {i//batch_size + 1}: {str(e)}")
            failed_records.extend(batch)
    
    print(f"\n[SUMMARY] Successfully uploaded {total_uploaded} records")
    if failed_records:
        print(f"[WARNING] Failed to upload {len(failed_records)} records")
        
        # Save failed records for debugging
        pd.DataFrame(failed_records).to_csv('failed_uploads.csv', index=False)
        print("[INFO] Failed records saved to failed_uploads.csv")
    
    return total_uploaded > 0

def main():
    """Main function to load Excel data to Supabase"""
    
    # File path
    excel_file = r"D:\WIP\LuckerLife\database\seeds\FishData_Freshwater_2026.xlsx"
    
    # Examine Excel structure
    all_sheets = examine_excel_structure(excel_file)
    
    # Ask which sheet to use
    if len(all_sheets) > 1:
        print("\n[SELECT] Multiple sheets found. Using the first sheet by default.")
    
    # Get the first sheet name and data
    sheet_name = list(all_sheets.keys())[0]
    df = all_sheets[sheet_name]
    
    print(f"\n[LOADING] Processing sheet: {sheet_name}")
    print(f"[INFO] Found {len(df)} rows")
    
    # Prepare data for upload
    fish_data = prepare_fish_data(df)
    
    # Save prepared data to CSV for backup
    backup_file = 'prepared_fish_data_from_excel.csv'
    fish_data.to_csv(backup_file, index=False)
    print(f"\n[BACKUP] Saved prepared data to {backup_file}")
    
    # Get Supabase credentials from .env or use defaults
    supabase_url = os.getenv('SUPABASE_URL', 'https://gskbzaduwmsbaxddixmk.supabase.co')
    supabase_key = os.getenv('SUPABASE_ANON_KEY', 'sb_publishable_ZLynthSYzZz0RthCMq6zRw_7l-F4y9u')
    
    print(f"\n[CONFIG] Supabase URL: {supabase_url}")
    
    # Show sample of data to be uploaded
    print("\n[PREVIEW] Sample of data to be uploaded:")
    print(fish_data[['common_name', 'family', 'species']].head(5).to_string())
    
    # Ask for confirmation
    print("\n[CONFIRM] Ready to upload to Supabase.")
    print("This will add the fish data to your fish_species table.")
    response = input("Continue? (y/n): ")
    
    if response.lower() == 'y':
        success = upload_to_supabase_api(fish_data, supabase_url, supabase_key)
        if success:
            print("\n[SUCCESS] Upload completed!")
        else:
            print("\n[WARNING] Upload completed with some errors.")
    else:
        print("[CANCELLED] Upload cancelled by user.")
        
    print("\n[DONE] Process complete!")

if __name__ == "__main__":
    main()