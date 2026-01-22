#!/usr/bin/env python3
"""
Direct Upload Fish Data to Supabase
Uploads the prepared fish data directly without confirmation
"""

import pandas as pd
import json
import requests
from datetime import datetime
import sys
import io

# Set UTF-8 encoding for stdout
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def upload_to_supabase_api(csv_file, supabase_url, supabase_key):
    """Upload fish data to Supabase using REST API"""
    print("\n[LOADING] Loading prepared fish data...")
    fish_data = pd.read_csv(csv_file)
    print(f"[INFO] Found {len(fish_data)} fish records to upload")
    
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
        # Remove empty string values and convert to None
        cleaned_record = {}
        for k, v in record.items():
            if pd.isna(v) or v == '':
                continue  # Skip null values
            
            # Skip columns that aren't in the database schema
            if k in ['class', 'created_dt', 'created_by', 'updated_dt', 'updated_by', 'Image']:
                continue
                
            # Map Excel column names to database column names
            if k == 'Image Name & Location':
                cleaned_record['image_name_location'] = v
            elif k == 'Invasive?':
                # Convert invasive field to boolean
                cleaned_record['invasive'] = str(v).lower() in ['yes', 'true', '1']
            elif k == 'Spawning Habits/Lifecycle':
                cleaned_record['spawning_habits_lifecycle'] = v
            elif k == 'Diet/Feeding Habits':
                cleaned_record['diet_feeding_habits'] = v
            elif k == 'Range':
                cleaned_record['range_distribution'] = v
            elif k == 'Avg Adult Weight (lbs)':
                # Try to extract numeric value
                try:
                    if isinstance(v, str):
                        # Handle ranges like "5-10" by taking the average
                        if '-' in v:
                            parts = v.split('-')
                            cleaned_record['avg_adult_weight_lbs'] = (float(parts[0]) + float(parts[1])) / 2
                        else:
                            cleaned_record['avg_adult_weight_lbs'] = float(v.replace(',', ''))
                    else:
                        cleaned_record['avg_adult_weight_lbs'] = float(v)
                except:
                    pass  # Skip if can't convert
            elif k == 'Avg Adult Length (in)':
                # Try to extract numeric value
                try:
                    if isinstance(v, str):
                        # Handle ranges like "10-14" by taking the average
                        if '-' in v:
                            parts = v.split('-')
                            cleaned_record['avg_adult_length_inches'] = (float(parts[0]) + float(parts[1])) / 2
                        else:
                            cleaned_record['avg_adult_length_inches'] = float(v.replace(',', ''))
                    else:
                        cleaned_record['avg_adult_length_inches'] = float(v)
                except:
                    pass  # Skip if can't convert
            elif k not in ['created_at', 'updated_at']:  # Skip these as they're auto-generated
                # Use the key as-is for other fields
                cleaned_record[k] = v
        
        # Ensure we have at least a common_name
        if 'common_name' in cleaned_record:
            cleaned_records.append(cleaned_record)
    
    print(f"[INFO] Prepared {len(cleaned_records)} valid records for upload")
    
    # First, let's check if the table exists and what columns it has
    print("\n[CHECKING] Verifying table structure...")
    check_url = f"{supabase_url}/rest/v1/fish_species?limit=1"
    check_response = requests.get(check_url, headers=headers)
    
    if check_response.status_code == 200:
        print("[SUCCESS] Table exists and is accessible")
    else:
        print(f"[WARNING] Table check returned status {check_response.status_code}")
        print(f"[WARNING] Response: {check_response.text}")
    
    # Upload in batches to avoid timeout
    batch_size = 10  # Smaller batch size for safety
    total_uploaded = 0
    failed_records = []
    
    print(f"\n[UPLOADING] Starting upload in batches of {batch_size}...")
    
    for i in range(0, len(cleaned_records), batch_size):
        batch = cleaned_records[i:i + batch_size]
        batch_num = i//batch_size + 1
        
        try:
            # Make POST request
            response = requests.post(api_url, 
                                   headers=headers, 
                                   data=json.dumps(batch))
            
            if response.status_code in [200, 201]:
                total_uploaded += len(batch)
                print(f"[PROGRESS] Batch {batch_num}: Successfully uploaded {len(batch)} records (Total: {total_uploaded}/{len(cleaned_records)})")
            else:
                print(f"[ERROR] Batch {batch_num} failed: Status {response.status_code}")
                print(f"[ERROR] Response: {response.text[:500]}...")  # First 500 chars
                failed_records.extend(batch)
                
                # If it's a schema error, show the first record structure
                if response.status_code == 400 and i == 0:
                    print("\n[DEBUG] First record structure:")
                    print(json.dumps(batch[0], indent=2))
                    print("\n[INFO] You may need to create or update the fish_species table schema")
                
        except Exception as e:
            print(f"[ERROR] Exception in batch {batch_num}: {str(e)}")
            failed_records.extend(batch)
    
    print(f"\n[SUMMARY] Upload complete!")
    print(f"  - Successfully uploaded: {total_uploaded} records")
    print(f"  - Failed: {len(failed_records)} records")
    
    if failed_records:
        # Save failed records for debugging
        pd.DataFrame(failed_records).to_csv('failed_uploads.csv', index=False)
        print("[INFO] Failed records saved to failed_uploads.csv")
    
    return total_uploaded > 0

def main():
    """Main function to upload data to Supabase"""
    
    # File to upload
    csv_file = 'prepared_fish_data_from_excel.csv'
    
    # Supabase credentials
    supabase_url = 'https://gskbzaduwmsbaxddixmk.supabase.co'
    supabase_key = 'sb_publishable_ZLynthSYzZz0RthCMq6zRw_7l-F4y9u'
    
    print("[FISH DATA UPLOAD TO SUPABASE]")
    print("="*60)
    print(f"Source file: {csv_file}")
    print(f"Target: {supabase_url}/rest/v1/fish_species")
    
    # Show a preview of the data
    df = pd.read_csv(csv_file)
    print(f"\n[PREVIEW] First 3 records:")
    preview_cols = ['common_name', 'family', 'species', 'invasive']
    available_cols = [col for col in preview_cols if col in df.columns]
    print(df[available_cols].head(3).to_string())
    
    # Start upload
    success = upload_to_supabase_api(csv_file, supabase_url, supabase_key)
    
    if success:
        print("\n[SUCCESS] ✓ Fish data has been uploaded to Supabase!")
    else:
        print("\n[FAILED] ✗ Upload failed. Check the errors above.")
    
    print("\n[DONE] Process complete!")

if __name__ == "__main__":
    main()