#!/usr/bin/env python3
"""
Interactive Fish Data Analysis with Pandas
Run this in Python interactive mode or Jupyter notebook
"""

import pandas as pd
import numpy as np

# Load the data
print("Loading fish data...")
df = pd.read_csv('fish_data_cleaned.csv')
print(f"Loaded {len(df)} fish species")
print("\nQuick commands to try:")
print("-" * 50)

# Display example commands
commands = """
# View first 5 records
df.head()

# View all column names
df.columns.tolist()

# Search for specific fish
df[df['common_name'].str.contains('Salmon', case=False, na=False)]

# Get fish by family
df[df['family'] == 'Salmonidae']

# Find the largest fish
df.nlargest(10, 'avg_adult_length_inches')[['common_name', 'avg_adult_length_inches']]

# Find the smallest fish
df.nsmallest(10, 'avg_adult_length_inches')[['common_name', 'avg_adult_length_inches']]

# Group by family and get statistics
df.groupby('family').agg({
    'common_name': 'count',
    'avg_adult_length_inches': ['mean', 'max'],
    'avg_adult_weight_lbs': 'mean'
}).round(2)

# Find fish in specific habitats
df[df['habitat'].str.contains('river', case=False, na=False)]['common_name'].head(10)

# Invasive species analysis
df[df['invasive'] == True][['common_name', 'family', 'range_distribution']]

# Fish with world records
df[df['world_record'].notna()][['common_name', 'world_record']]

# Create a subset for further analysis
game_fish = df[df['common_name'].str.contains('Bass|Trout|Pike', case=False, na=False)]
print(f"Found {len(game_fish)} game fish species")

# Export to Excel with multiple sheets
with pd.ExcelWriter('fish_analysis.xlsx') as writer:
    df.to_excel(writer, sheet_name='All Fish', index=False)
    df[df['invasive'] == True].to_excel(writer, sheet_name='Invasive Species', index=False)
    df.groupby('family').size().to_excel(writer, sheet_name='Family Counts')

# Create a summary report
summary = {
    'Total Species': len(df),
    'Unique Families': df['family'].nunique(),
    'Invasive Species': df['invasive'].sum(),
    'Average Fish Length (inches)': df['avg_adult_length_inches'].mean(),
    'Largest Fish': df.loc[df['avg_adult_length_inches'].idxmax(), 'common_name'],
    'Most Common Family': df['family'].value_counts().index[0]
}
pd.Series(summary)
"""

print(commands)
print("\nTip: Copy and paste these commands into your Python interpreter!")
print("Or run: python -i interactive_fish_analysis.py")
print("This will load the data and drop you into an interactive session.")