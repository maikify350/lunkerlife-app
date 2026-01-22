import csv
import os
from datetime import datetime

def csv_to_sql(csv_path, output_path):
    """Convert CSV file to SQL INSERT statements"""
    print("Reading CSV file...")
    
    # Read CSV file
    try:
        with open(csv_path, 'r', encoding='utf-8') as f:
            # Detect delimiter
            sample = f.read(1024)
            f.seek(0)
            sniffer = csv.Sniffer()
            delimiter = sniffer.sniff(sample).delimiter
            
            reader = csv.DictReader(f, delimiter=delimiter)
            rows = list(reader)
            
        print(f"Loaded {len(rows)} rows from CSV")
        print(f"Columns: {list(rows[0].keys()) if rows else 'No rows'}")
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return
    
    # Generate SQL statements
    sql_statements = []
    sql_statements.append("-- Fish species data from CSV import")
    sql_statements.append(f"-- Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    sql_statements.append("")
    
    for i, row in enumerate(rows, 1):
        # Extract and clean values
        common_name = row.get('common_name', row.get('Common Name', ''))
        also_known_as = row.get('also_known_as', row.get('Also Known As', ''))
        invasive = row.get('invasive', row.get('Invasive', 'false')).lower() in ('true', 'yes', '1', 'y')
        description = row.get('description', row.get('Description', ''))
        family = row.get('family', row.get('Family', ''))
        species = row.get('species', row.get('Species', ''))
        environmental_status = row.get('environmental_status', row.get('Environmental Status', ''))
        habitat = row.get('habitat', row.get('Habitat', ''))
        fishing_techniques = row.get('fishing_techniques', row.get('Fishing Techniques', ''))
        spawning_habits_lifecycle = row.get('spawning_habits_lifecycle', row.get('Spawning Habits/Lifecycle', ''))
        diet_feeding_habits = row.get('diet_feeding_habits', row.get('Diet/Feeding Habits', ''))
        range_distribution = row.get('range_distribution', row.get('Range', ''))
        water_body_type = row.get('water_body_type', row.get('Water Body Type', ''))
        avg_adult_weight_lbs = row.get('avg_adult_weight_lbs', row.get('Avg Adult Weight (lbs)', ''))
        known_for = row.get('known_for', row.get('Known For', ''))
        avg_adult_length_inches = row.get('avg_adult_length_inches', row.get('Avg Adult Length (in)', ''))
        world_record = row.get('world_record', row.get('World Record', ''))
        image_name_location = row.get('image_name_location', row.get('Image Name/Location', ''))
        
        # Add missing fields
        class_val = 'Fresh'  # Since this is freshwater data
        created_dt = datetime.now().isoformat()
        created_by = 'Admin'
        updated_dt = datetime.now().isoformat()
        updated_by = 'Admin'
        
        # Build INSERT statement
        columns = [
            'common_name', 'also_known_as', 'invasive', 'description',
            'family', 'species', 'environmental_status', 'habitat',
            'fishing_techniques', 'spawning_habits_lifecycle', 'diet_feeding_habits',
            'range_distribution', 'water_body_type', 'avg_adult_weight_lbs',
            'known_for', 'avg_adult_length_inches', 'world_record',
            'image_name_location', 'class', 'created_dt', 'created_by',
            'updated_dt', 'updated_by'
        ]
        
        values = [
            escape_sql(common_name),
            escape_sql(also_known_as),
            'TRUE' if invasive else 'FALSE',
            escape_sql(description),
            escape_sql(family),
            escape_sql(species),
            escape_sql(environmental_status),
            escape_sql(habitat),
            escape_sql(fishing_techniques),
            escape_sql(spawning_habits_lifecycle),
            escape_sql(diet_feeding_habits),
            escape_sql(range_distribution),
            escape_sql(water_body_type),
            escape_sql(avg_adult_weight_lbs) or 'NULL',
            escape_sql(known_for),
            escape_sql(avg_adult_length_inches) or 'NULL',
            escape_sql(world_record),
            escape_sql(image_name_location),
            "'Fresh'",
            f"'{created_dt}'",
            "'Admin'",
            f"'{updated_dt}'",
            "'Admin'"
        ]
        
        columns_str = ', '.join(columns)
        values_str = ', '.join(values)
        
        sql_statements.append(f"INSERT INTO fish_species ({columns_str})")
        sql_statements.append(f"VALUES ({values_str});")
        sql_statements.append("")
        
        if i % 10 == 0:
            print(f"Processed {i} rows...")
    
    # Write to file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))
    
    print(f"SQL file created: {output_path}")
    print(f"Generated {len(rows)} INSERT statements")

def escape_sql(value):
    """Escape SQL string values"""
    if value is None or value == '':
        return 'NULL'
    elif isinstance(value, str):
        # Escape single quotes
        escaped = value.replace("'", "''").replace('\\', '\\\\')
        return f"'{escaped}'"
    else:
        return str(value)

if __name__ == "__main__":
    csv_file = r"D:\WIP\LuckerLife\misc\FishData_Freshwater_2026_1.csv"
    output_file = r"D:\WIP\LuckerLife\misc\fish_data_import.sql"
    
    # Check if CSV file exists
    if not os.path.exists(csv_file):
        print(f"CSV file not found: {csv_file}")
        print("Please update path in the script or move CSV file to D:\\WIP\\LuckerLife\\misc\\")
    else:
        csv_to_sql(csv_file, output_file)
