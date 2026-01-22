#!/usr/bin/env python3
"""
Check Supabase Storage Bucket Structure
Diagnoses image display issues
"""

import requests
import json

# Supabase configuration
SUPABASE_URL = 'https://gskbzaduwmsbaxddixmk.supabase.co'
SUPABASE_KEY = 'sb_publishable_ZLynthSYzZz0RthCMq6zRw_7l-F4y9u'

def check_bucket_contents():
    """List files in the fish-images bucket"""
    print("[CHECKING] Storage bucket contents...")
    
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}'
    }
    
    # Try to list bucket contents
    url = f"{SUPABASE_URL}/storage/v1/object/list/fish-images"
    response = requests.get(url, headers=headers)
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        files = response.json()
        print(f"Found {len(files)} files in bucket")
        for f in files[:5]:  # Show first 5
            print(f"  - {f.get('name', 'unnamed')}")
        return files
    else:
        print(f"Error: {response.text}")
        return []

def test_image_urls():
    """Test if images are accessible"""
    print("\n[TESTING] Image accessibility...")
    
    test_images = [
        "Alewife.png",
        "Bass-Largemouth.png",
        "Bass-Hybrid-Striped.png"
    ]
    
    for img in test_images:
        # Test direct URL
        url = f"{SUPABASE_URL}/storage/v1/object/public/fish-images/{img}"
        response = requests.head(url)
        print(f"{img}: Status {response.status_code}")
        
        # If not found, try with fish-images subfolder
        if response.status_code != 200:
            url2 = f"{SUPABASE_URL}/storage/v1/object/public/fish-images/fish-images/{img}"
            response2 = requests.head(url2)
            if response2.status_code == 200:
                print(f"  → Found at: fish-images/fish-images/{img}")

def get_sample_fish():
    """Get sample fish to check their image paths"""
    print("\n[FETCHING] Sample fish records...")
    
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}'
    }
    
    url = f"{SUPABASE_URL}/rest/v1/fish_species?select=common_name,image_name_location,image&limit=5"
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        fish = response.json()
        print("Sample fish image data:")
        for f in fish:
            print(f"\n{f['common_name']}:")
            print(f"  image_name_location: {f['image_name_location']}")
            print(f"  image: {f['image']}")

if __name__ == "__main__":
    check_bucket_contents()
    test_image_urls()
    get_sample_fish()