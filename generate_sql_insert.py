#!/usr/bin/env python3
"""
Generate SQL INSERT statements from Excel fish data
Creates a complete SQL file that can be run in Supabase SQL Editor
"""

import pandas as pd
import sys
import io

# Set UTF-8 encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def escape_sql_string(value):
    """Escape single quotes and special characters for SQL"""
    if pd.isna(value):
        return 'NULL'
    
    # Convert to string and escape single quotes
    str_value = str(value).replace("'", "''")
    
    # Remove any special Unicode characters that might cause issues
    str_value = str_value.replace('\u2028', '\n')  # Line separator
    str_value = str_value.replace('\u2029', '\n')  # Paragraph separator
    
    return f"'{str_value}'"

def convert_numeric(value, default=None):
    """Convert to numeric, handling ranges and special cases"""
    if pd.isna(value):
        return 'NULL' if default is None else str(default)
    
    try:
        if isinstance(value, str):
            # Handle ranges like "5-10" by taking the average
            if '-' in value:
                parts = value.split('-')
                avg = (float(parts[0]) + float(parts[1])) / 2
                return str(avg)
            else:
                return str(float(value.replace(',', '')))
        else:
            return str(float(value))
    except:
        return 'NULL' if default is None else str(default)

def convert_boolean(value):
    """Convert to boolean"""
    if pd.isna(value):
        return 'false'
    
    return 'true' if str(value).lower() in ['yes', 'true', '1'] else 'false'

def generate_sql_from_csv():
    """Generate SQL INSERT statements from prepared CSV"""
    
    # Load the prepared data
    df = pd.read_csv('prepared_fish_data_from_excel.csv')
    
    # Start building SQL
    sql_lines = []
    
    # Header
    sql_lines.append("-- LuckerLife Fish Data Import Script")
    sql_lines.append("-- Generated from Excel data")
    sql_lines.append("-- Run this script in the Supabase SQL Editor")
    sql_lines.append("")
    sql_lines.append("-- Temporarily disable RLS for fish_species table")
    sql_lines.append("ALTER TABLE fish_species DISABLE ROW LEVEL SECURITY;")
    sql_lines.append("")
    sql_lines.append("-- Clear any existing data (optional - comment out if you want to append)")
    sql_lines.append("-- TRUNCATE TABLE fish_species CASCADE;")
    sql_lines.append("")
    sql_lines.append("-- Insert fish data")
    
    # Process each record
    valid_records = 0
    for idx, row in df.iterrows():
        # Skip if no common name
        if pd.isna(row.get('common_name')):
            continue
        
        valid_records += 1
        
        # Build INSERT statement
        if valid_records == 1:
            sql_lines.append("INSERT INTO fish_species (")
            sql_lines.append("    image_name_location,")
            sql_lines.append("    common_name,")
            sql_lines.append("    also_known_as,")
            sql_lines.append("    invasive,")
            sql_lines.append("    description,")
            sql_lines.append("    family,")
            sql_lines.append("    species,")
            sql_lines.append("    environmental_status,")
            sql_lines.append("    habitat,")
            sql_lines.append("    fishing_techniques,")
            sql_lines.append("    spawning_habits_lifecycle,")
            sql_lines.append("    diet_feeding_habits,")
            sql_lines.append("    range_distribution,")
            sql_lines.append("    water_body_type,")
            sql_lines.append("    avg_adult_weight_lbs,")
            sql_lines.append("    known_for,")
            sql_lines.append("    avg_adult_length_inches,")
            sql_lines.append("    world_record")
            sql_lines.append(") VALUES")
        
        # Add comma for all records except the first
        if valid_records > 1:
            sql_lines.append(",")
        
        # Add the values
        sql_lines.append("(")
        sql_lines.append(f"    {escape_sql_string(row.get('Image Name & Location'))},")
        sql_lines.append(f"    {escape_sql_string(row.get('common_name'))},")
        sql_lines.append(f"    {escape_sql_string(row.get('also_known_as'))},")
        sql_lines.append(f"    {convert_boolean(row.get('Invasive?'))},")
        sql_lines.append(f"    {escape_sql_string(row.get('description'))},")
        sql_lines.append(f"    {escape_sql_string(row.get('family'))},")
        sql_lines.append(f"    {escape_sql_string(row.get('species'))},")
        sql_lines.append(f"    {escape_sql_string(row.get('environmental_status'))},")
        sql_lines.append(f"    {escape_sql_string(row.get('habitat'))},")
        sql_lines.append(f"    {escape_sql_string(row.get('fishing_techniques'))},")
        sql_lines.append(f"    {escape_sql_string(row.get('spawning_habits_lifecycle'))},")
        sql_lines.append(f"    {escape_sql_string(row.get('diet_feeding_habits'))},")
        sql_lines.append(f"    {escape_sql_string(row.get('range_distribution'))},")
        sql_lines.append(f"    {escape_sql_string(row.get('water_body_type'))},")
        sql_lines.append(f"    {convert_numeric(row.get('avg_adult_weight_lbs'))},")
        sql_lines.append(f"    {escape_sql_string(row.get('known_for'))},")
        sql_lines.append(f"    {convert_numeric(row.get('avg_adult_length_inches'))},")
        sql_lines.append(f"    {escape_sql_string(row.get('world_record'))}")
        sql_lines.append(")")
    
    # Close the statement
    sql_lines.append(";")
    sql_lines.append("")
    
    # Add RLS re-enable and policy
    sql_lines.append("-- Re-enable RLS for fish_species table")
    sql_lines.append("ALTER TABLE fish_species ENABLE ROW LEVEL SECURITY;")
    sql_lines.append("")
    sql_lines.append("-- Create a basic RLS policy to allow public reads")
    sql_lines.append("DROP POLICY IF EXISTS \"Allow public read access\" ON fish_species;")
    sql_lines.append("CREATE POLICY \"Allow public read access\" ON fish_species")
    sql_lines.append("    FOR SELECT USING (true);")
    sql_lines.append("")
    sql_lines.append("-- Count inserted records")
    sql_lines.append("SELECT COUNT(*) as total_fish FROM fish_species;")
    
    # Join all lines
    sql_content = '\n'.join(sql_lines)
    
    # Save to file
    output_file = 'insert_all_fish_data.sql'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(sql_content)
    
    print(f"[SUCCESS] Generated SQL file: {output_file}")
    print(f"[INFO] Total records to insert: {valid_records}")
    print(f"[INFO] File size: {len(sql_content):,} bytes")
    print("\n[NEXT STEPS]:")
    print("1. Open Supabase SQL Editor (https://app.supabase.com/project/gskbzaduwmsbaxddixmk/sql/new)")
    print(f"2. Copy and paste the contents of {output_file}")
    print("3. Click 'Run' to execute the SQL")
    print("\nThis will:")
    print("- Temporarily disable Row Level Security")
    print("- Insert all fish data")
    print("- Re-enable RLS with public read access")
    print("- Show the count of inserted records")

if __name__ == "__main__":
    generate_sql_from_csv()