#!/usr/bin/env python3
"""
Fish Data Analysis Script
Analyzes fish species data using pandas for the LuckerLife project
"""

import pandas as pd
import json
import numpy as np
from datetime import datetime
import warnings
import sys
import io

# Set UTF-8 encoding for stdout
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
warnings.filterwarnings('ignore')

def load_fish_data(filename='fish-data-with-images.json'):
    """Load fish data from JSON file into pandas DataFrame"""
    print(f"\n[LOADING] Loading fish data from {filename}...")
    
    with open(filename, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Convert to DataFrame
    df = pd.DataFrame(data)
    print(f"[SUCCESS] Loaded {len(df)} fish records")
    
    return df

def explore_data_structure(df):
    """Explore the structure and content of the fish data"""
    print("\n[ANALYSIS] Data Structure Analysis")
    print("=" * 50)
    
    # Basic info
    print(f"\nDataset shape: {df.shape}")
    print(f"\nColumns ({len(df.columns)}):")
    for col in df.columns:
        print(f"  - {col}: {df[col].dtype}")
    
    # Check for missing values
    print("\n[INFO] Missing Values:")
    missing = df.isnull().sum()
    missing_pct = (missing / len(df) * 100).round(2)
    missing_df = pd.DataFrame({'Count': missing, 'Percentage': missing_pct})
    print(missing_df[missing_df['Count'] > 0])
    
    return df

def analyze_species_taxonomy(df):
    """Analyze taxonomic distribution of fish species"""
    print("\n[TAXONOMY] Taxonomic Analysis")
    print("=" * 50)
    
    # Analyze by family if available
    if 'family' in df.columns:
        print("\nTop 10 Fish Families:")
        family_counts = df['family'].value_counts().head(10)
        for family, count in family_counts.items():
            print(f"  {family}: {count} species ({count/len(df)*100:.1f}%)")
    
    # Analyze by genus if available
    if 'genus' in df.columns:
        print("\nTop 10 Fish Genera:")
        genus_counts = df['genus'].value_counts().head(10)
        for genus, count in genus_counts.items():
            print(f"  {genus}: {count} species")
    
    # Scientific vs common names
    if 'scientific_name' in df.columns and 'common_name' in df.columns:
        print(f"\nNaming Statistics:")
        print(f"  - Species with scientific names: {df['scientific_name'].notna().sum()}")
        print(f"  - Species with common names: {df['common_name'].notna().sum()}")
        print(f"  - Species with both names: {(df['scientific_name'].notna() & df['common_name'].notna()).sum()}")

def analyze_habitat_distribution(df):
    """Analyze habitat and distribution patterns"""
    print("\n[HABITAT] Habitat & Distribution Analysis")
    print("=" * 50)
    
    # Analyze habitat types
    if 'habitat' in df.columns:
        print("\nHabitat Distribution:")
        habitat_counts = df['habitat'].value_counts()
        for habitat, count in habitat_counts.items():
            print(f"  {habitat}: {count} species ({count/len(df)*100:.1f}%)")
    
    # Analyze water type (freshwater/saltwater)
    if 'water_type' in df.columns:
        print("\nWater Type Distribution:")
        water_counts = df['water_type'].value_counts()
        for water_type, count in water_counts.items():
            print(f"  {water_type}: {count} species ({count/len(df)*100:.1f}%)")
    
    # Geographic distribution
    if 'distribution' in df.columns:
        print("\nGeographic Coverage:")
        # Count unique regions mentioned
        all_regions = []
        for dist in df['distribution'].dropna():
            if isinstance(dist, str):
                regions = [r.strip() for r in dist.split(',')]
                all_regions.extend(regions)
        
        unique_regions = pd.Series(all_regions).value_counts()
        print(f"  Total unique regions: {len(unique_regions)}")
        print(f"\n  Top 10 regions by species count:")
        for region, count in unique_regions.head(10).items():
            print(f"    {region}: {count} species")

def analyze_physical_characteristics(df):
    """Analyze physical characteristics of fish"""
    print("\n[PHYSICAL] Physical Characteristics Analysis")
    print("=" * 50)
    
    # Size analysis
    size_columns = ['max_length', 'average_length', 'max_weight', 'average_weight']
    for col in size_columns:
        if col in df.columns and pd.api.types.is_numeric_dtype(df[col]):
            valid_data = df[col].dropna()
            if len(valid_data) > 0:
                print(f"\n{col.replace('_', ' ').title()}:")
                print(f"  - Mean: {valid_data.mean():.2f}")
                print(f"  - Median: {valid_data.median():.2f}")
                print(f"  - Min: {valid_data.min():.2f}")
                print(f"  - Max: {valid_data.max():.2f}")
                print(f"  - Std Dev: {valid_data.std():.2f}")

def analyze_conservation_status(df):
    """Analyze conservation status if available"""
    if 'conservation_status' in df.columns:
        print("\n[CONSERVATION] Conservation Status Analysis")
        print("=" * 50)
        
        status_counts = df['conservation_status'].value_counts()
        print("\nConservation Status Distribution:")
        for status, count in status_counts.items():
            print(f"  {status}: {count} species ({count/len(df)*100:.1f}%)")
        
        # Highlight endangered species
        endangered_statuses = ['Endangered', 'Critically Endangered', 'Vulnerable', 'Near Threatened']
        at_risk = df[df['conservation_status'].isin(endangered_statuses)]
        if len(at_risk) > 0:
            print(f"\n[WARNING] Species at risk: {len(at_risk)} ({len(at_risk)/len(df)*100:.1f}%)")

def analyze_images(df):
    """Analyze image data if present"""
    print("\n[IMAGES] Image Data Analysis")
    print("=" * 50)
    
    # Check for image columns
    image_columns = [col for col in df.columns if 'image' in col.lower() or 'photo' in col.lower()]
    
    if image_columns:
        print(f"Image-related columns found: {image_columns}")
        
        for col in image_columns:
            non_null = df[col].notna().sum()
            print(f"\n{col}:")
            print(f"  - Records with images: {non_null} ({non_null/len(df)*100:.1f}%)")
            print(f"  - Records without images: {len(df) - non_null} ({(len(df) - non_null)/len(df)*100:.1f}%)")
    
    # If there's an images array column
    if 'images' in df.columns:
        image_counts = df['images'].apply(lambda x: len(x) if isinstance(x, list) else 0)
        print(f"\nImage count statistics:")
        print(f"  - Total images: {image_counts.sum()}")
        print(f"  - Average images per species: {image_counts.mean():.2f}")
        print(f"  - Max images for a species: {image_counts.max()}")
        print(f"  - Species with no images: {(image_counts == 0).sum()}")

def generate_summary_report(df):
    """Generate a comprehensive summary report"""
    print("\n[REPORT] SUMMARY REPORT")
    print("=" * 70)
    
    print(f"\n[SUMMARY] LuckerLife Fish Database Analysis")
    print(f"   Analysis Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"   Total Species: {len(df)}")
    
    # Key statistics
    print("\n[STATS] Key Statistics:")
    
    # Unique values in key columns
    key_cols = ['family', 'genus', 'species', 'habitat', 'water_type']
    for col in key_cols:
        if col in df.columns:
            unique_count = df[col].nunique()
            print(f"   - Unique {col}: {unique_count}")
    
    # Data completeness
    completeness = (df.notna().sum() / len(df) * 100).mean()
    print(f"\n   - Overall data completeness: {completeness:.1f}%")
    
    # Save summary to file
    summary_file = 'fish_data_analysis_summary.txt'
    print(f"\n[SAVE] Saving detailed analysis to {summary_file}")
    
    with open(summary_file, 'w', encoding='utf-8') as f:
        f.write("LuckerLife Fish Database Analysis Summary\n")
        f.write("="*50 + "\n")
        f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n\n")
        f.write(df.describe(include='all').to_string())

def create_csv_export(df):
    """Export cleaned data to CSV for further analysis"""
    csv_file = 'fish_data_cleaned.csv'
    print(f"\n[EXPORT] Exporting cleaned data to {csv_file}")
    df.to_csv(csv_file, index=False, encoding='utf-8')
    print(f"   [SUCCESS] Exported {len(df)} records")

def main():
    """Main analysis workflow"""
    print("[FISH] LuckerLife Fish Data Analysis with Pandas")
    print("="*60)
    
    # Load data
    df = load_fish_data()
    
    # Explore structure
    df = explore_data_structure(df)
    
    # Run analyses
    analyze_species_taxonomy(df)
    analyze_habitat_distribution(df)
    analyze_physical_characteristics(df)
    analyze_conservation_status(df)
    analyze_images(df)
    
    # Generate reports
    generate_summary_report(df)
    create_csv_export(df)
    
    print("\n[DONE] Analysis complete!")
    print("\n[NEXT] Next steps with pandas:")
    print("   1. Load fish_data_cleaned.csv for further analysis")
    print("   2. Create visualizations with df.plot() or matplotlib")
    print("   3. Perform statistical analysis with df.corr()")
    print("   4. Group data by categories with df.groupby()")
    print("   5. Filter specific species with df[df['column'] == 'value']")
    
    return df

if __name__ == "__main__":
    # Run the analysis
    fish_df = main()
    
    # Store the DataFrame in a variable for interactive use
    print("\n[TIP] The DataFrame is stored in 'fish_df' variable")
    print("   You can now use it interactively in Python!")