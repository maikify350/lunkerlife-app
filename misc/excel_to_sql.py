import pandas as pd
import os
from datetime import datetime

def excel_to_sql(excel_path, output_path):
    """Convert Excel file to SQL INSERT statements"""
    
    # Read Excel file
    try:
        df = pd.read_excel(excel_path)
        print(f"Loaded {len(df)} rows from Excel")
        print(f"Columns: {list(df.columns)}")
    except Exception as e:
        print(f"Error reading Excel: {e}")
        return
    
    # Clean column names (remove spaces, special chars)
    column_mapping = {}
    for col in df.columns:
        clean_col = col.lower().replace(' ', '_').replace('/', '_').replace('(', '').replace(')', '').replace('-', '_')
        column_mapping[col] = clean_col
    
    df = df.rename(columns=column_mapping)
    
    # Add missing fields
    df['class'] = 'Fresh'  # Since this is freshwater data
    df['created_dt'] = datetime.now().isoformat()
    df['created_by'] = 'Admin'
    df['updated_dt'] = datetime.now().isoformat()
    df['updated_by'] = 'Admin'
    
    # Generate SQL
    sql_statements = []
    sql_statements.append("-- Fish species data from Excel import")
    sql_statements.append("-- Generated on " + datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    sql_statements.append("")
    sql_statements.append("-- Clear existing data (optional - remove if you want to append)")
    sql_statements.append("-- TRUNCATE TABLE fish_species;")
    sql_statements.append("")
    
    for index, row in df.iterrows():
        values = []
        columns = []
        
        for col in df.columns:
            value = row[col]
            
            # Skip empty columns
            if pd.isna(value) or value == '':
                continue
                
            columns.append(col)
            
            if isinstance(value, str):
                # Escape single quotes
                escaped_value = value.replace("'", "''")
                values.append(f"'{escaped_value}'")
            elif isinstance(value, bool):
                values.append('TRUE' if value else 'FALSE')
            elif isinstance(value, (int, float)):
                values.append(str(value))
            else:
                values.append(f"'{str(value)}'")
        
        if columns:  # Only create INSERT if we have data
            columns_str = ', '.join(columns)
            values_str = ', '.join(values)
            
            sql_statements.append(f"INSERT INTO fish_species ({columns_str})")
            sql_statements.append(f"VALUES ({values_str});")
            sql_statements.append("")
    
    # Add verification query
    sql_statements.append("-- Verify import")
    sql_statements.append("SELECT COUNT(*) as total_imported FROM fish_species;")
    
    # Write to file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))
    
    print(f"SQL file created: {output_path}")
    print(f"Generated {len(df)} INSERT statements")

if __name__ == "__main__":
    excel_file = r"D:\WIP\LuckerLife\database\seeds\FishData_Freshwater_2026.xlsx"
    output_file = r"D:\WIP\LuckerLife\misc\fish_data_import.sql"
    
    # Check if Excel file exists
    if not os.path.exists(excel_file):
        print(f"Excel file not found: {excel_file}")
        print("Please make sure the Excel file is in: D:\\WIP\\LuckerLife\\database\\seeds\\")
    else:
        excel_to_sql(excel_file, output_file)