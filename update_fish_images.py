#!/usr/bin/env python3
"""
Update Fish Images in Supabase
Links the image files already uploaded in Supabase storage to the fish records
"""

import requests
import json
import sys
import io

# Set UTF-8 encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Supabase configuration
SUPABASE_URL = 'https://gskbzaduwmsbaxddixmk.supabase.co'
SUPABASE_KEY = 'sb_publishable_ZLynthSYzZz0RthCMq6zRw_7l-F4y9u'
STORAGE_BUCKET = 'fish-images'  # Update this to your actual bucket name

def get_all_fish():
    """Fetch all fish records from the database"""
    print("[FETCHING] Getting all fish records...")
    
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}'
    }
    
    # Get all fish with their image info
    url = f"{SUPABASE_URL}/rest/v1/fish_species?select=id,common_name,image_name_location,image"
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        fish_data = response.json()
        print(f"[SUCCESS] Found {len(fish_data)} fish records")
        return fish_data
    else:
        print(f"[ERROR] Failed to fetch fish: {response.status_code}")
        print(f"[ERROR] Response: {response.text}")
        return []

def generate_image_url(image_name):
    """Generate the public URL for an image in Supabase storage"""
    if not image_name:
        return None
    
    # Construct the public URL for the image
    # Format: https://[project-id].supabase.co/storage/v1/object/public/[bucket]/[path]
    image_url = f"{SUPABASE_URL}/storage/v1/object/public/{STORAGE_BUCKET}/{image_name}"
    
    return image_url

def update_fish_images(fish_data):
    """Update the image field for all fish records"""
    print("\n[UPDATING] Starting image URL updates...")
    
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    }
    
    updated_count = 0
    failed_count = 0
    
    for fish in fish_data:
        # Skip if already has an image URL
        if fish.get('image'):
            continue
        
        # Skip if no image_name_location
        if not fish.get('image_name_location'):
            continue
        
        # Generate the image URL
        image_url = generate_image_url(fish['image_name_location'])
        
        # Update the record
        update_url = f"{SUPABASE_URL}/rest/v1/fish_species?id=eq.{fish['id']}"
        update_data = {'image': image_url}
        
        response = requests.patch(update_url, 
                                headers=headers, 
                                data=json.dumps(update_data))
        
        if response.status_code in [200, 204]:
            updated_count += 1
            print(f"[UPDATED] {fish['common_name']} - {image_url}")
        else:
            failed_count += 1
            print(f"[FAILED] {fish['common_name']} - Status: {response.status_code}")
    
    print(f"\n[SUMMARY]")
    print(f"  - Updated: {updated_count} fish images")
    print(f"  - Failed: {failed_count}")
    print(f"  - Skipped: {len(fish_data) - updated_count - failed_count}")

def verify_images():
    """Verify that images are accessible"""
    print("\n[VERIFYING] Checking if images are accessible...")
    
    # Get a sample of fish with images
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}'
    }
    
    url = f"{SUPABASE_URL}/rest/v1/fish_species?select=common_name,image&image=not.is.null&limit=3"
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        sample_fish = response.json()
        
        for fish in sample_fish:
            image_url = fish['image']
            # Check if image is accessible
            img_response = requests.head(image_url)
            if img_response.status_code == 200:
                print(f"  ✓ {fish['common_name']}: Image accessible")
            else:
                print(f"  ✗ {fish['common_name']}: Image NOT accessible (Status: {img_response.status_code})")

def generate_update_sql():
    """Generate SQL to update all image URLs"""
    print("\n[GENERATING] Creating SQL update script...")
    
    fish_data = get_all_fish()
    
    sql_lines = []
    sql_lines.append("-- Update Fish Image URLs")
    sql_lines.append("-- Run this in Supabase SQL Editor if the Python script fails")
    sql_lines.append("")
    
    for fish in fish_data:
        if fish.get('image_name_location') and not fish.get('image'):
            image_url = generate_image_url(fish['image_name_location'])
            common_name = fish['common_name'].replace("'", "''")
            
            sql_lines.append(f"UPDATE fish_species")
            sql_lines.append(f"SET image = '{image_url}'")
            sql_lines.append(f"WHERE id = '{fish['id']}';")
            sql_lines.append("")
    
    sql_lines.append("-- Verify updates")
    sql_lines.append("SELECT common_name, image FROM fish_species WHERE image IS NOT NULL LIMIT 10;")
    
    # Save SQL file
    with open('update_fish_images.sql', 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_lines))
    
    print(f"[SUCCESS] SQL file saved as: update_fish_images.sql")

def main():
    print("[FISH IMAGE LINKER]")
    print("="*60)
    print(f"Supabase URL: {SUPABASE_URL}")
    print(f"Storage Bucket: {STORAGE_BUCKET}")
    print()
    
    # Get all fish records
    fish_data = get_all_fish()
    
    if not fish_data:
        print("[ERROR] No fish data found. Exiting.")
        return
    
    # Show summary
    needs_update = sum(1 for f in fish_data if f.get('image_name_location') and not f.get('image'))
    print(f"\n[INFO] Fish needing image links: {needs_update}")
    
    if needs_update == 0:
        print("[INFO] All fish already have image URLs!")
        return
    
    # Update images
    update_fish_images(fish_data)
    
    # Verify some images
    verify_images()
    
    # Generate SQL as backup
    generate_update_sql()
    
    print("\n[DONE] Process complete!")
    print("\nIf images are not showing, check:")
    print("1. The storage bucket name is correct")
    print("2. The bucket is set to PUBLIC")
    print("3. The image files exist in the bucket")
    print("4. The image filenames match exactly (case-sensitive)")

if __name__ == "__main__":
    main()