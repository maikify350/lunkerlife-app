#!/usr/bin/env python3
"""
Next Steps with Pandas - Interactive Analysis Examples
"""

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load the cleaned data
df = pd.read_csv('fish_data_cleaned.csv')

# Example 1: Top 10 families visualization
print("Example 1: Visualizing top 10 fish families")
family_counts = df['family'].value_counts().head(10)
plt.figure(figsize=(10, 6))
family_counts.plot(kind='bar')
plt.title('Top 10 Fish Families in Database')
plt.xlabel('Family')
plt.ylabel('Number of Species')
plt.xticks(rotation=45, ha='right')
plt.tight_layout()
plt.savefig('fish_families_distribution.png')
plt.show()

# Example 2: Fish size analysis
print("\nExample 2: Analyzing fish sizes")
# Create size categories
df['size_category'] = pd.cut(df['avg_adult_length_inches'], 
                             bins=[0, 6, 12, 24, 100], 
                             labels=['Small (<6")', 'Medium (6-12")', 'Large (12-24")', 'Very Large (>24")'])

size_dist = df['size_category'].value_counts()
print("Fish size distribution:")
print(size_dist)

# Example 3: Find specific fish
print("\nExample 3: Finding specific fish species")
# Search for bass species
bass_species = df[df['common_name'].str.contains('Bass', case=False, na=False)]
print(f"Found {len(bass_species)} bass species:")
print(bass_species[['common_name', 'family', 'avg_adult_length_inches']].head())

# Example 4: Invasive species analysis
print("\nExample 4: Invasive species analysis")
invasive_count = df['invasive'].value_counts()
print("Invasive species breakdown:")
print(invasive_count)

invasive_fish = df[df['invasive'] == True]
print(f"\nInvasive species list ({len(invasive_fish)} total):")
print(invasive_fish[['common_name', 'family']].to_string(index=False))

# Example 5: Statistical analysis by family
print("\nExample 5: Average fish size by family")
family_stats = df.groupby('family')['avg_adult_length_inches'].agg(['mean', 'count', 'min', 'max'])
family_stats = family_stats.sort_values('mean', ascending=False)
print(family_stats.head(10))

# Example 6: Create a simple dashboard
print("\nExample 6: Creating a multi-panel visualization")
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# Panel 1: Family distribution
df['family'].value_counts().head(8).plot(kind='pie', ax=axes[0, 0], autopct='%1.1f%%')
axes[0, 0].set_title('Top 8 Fish Families')
axes[0, 0].set_ylabel('')

# Panel 2: Size distribution
df['size_category'].value_counts().plot(kind='bar', ax=axes[0, 1])
axes[0, 1].set_title('Fish Size Distribution')
axes[0, 1].set_xlabel('Size Category')
axes[0, 1].set_ylabel('Count')

# Panel 3: Invasive species
invasive_count.plot(kind='bar', ax=axes[1, 0])
axes[1, 0].set_title('Invasive Species Status')
axes[1, 0].set_xlabel('Invasive')
axes[1, 0].set_ylabel('Count')

# Panel 4: Top 10 largest fish
largest_fish = df.nlargest(10, 'avg_adult_length_inches')[['common_name', 'avg_adult_length_inches']]
largest_fish.set_index('common_name').plot(kind='barh', ax=axes[1, 1])
axes[1, 1].set_title('Top 10 Largest Fish Species')
axes[1, 1].set_xlabel('Average Length (inches)')

plt.tight_layout()
plt.savefig('fish_database_dashboard.png')
plt.show()

# Example 7: Export filtered data
print("\nExample 7: Exporting filtered datasets")
# Export game fish (bass, trout, etc.)
game_fish_keywords = ['Bass', 'Trout', 'Pike', 'Walleye', 'Crappie', 'Perch']
game_fish = df[df['common_name'].str.contains('|'.join(game_fish_keywords), case=False, na=False)]
game_fish.to_csv('game_fish_subset.csv', index=False)
print(f"Exported {len(game_fish)} game fish species to 'game_fish_subset.csv'")

# Example 8: Advanced filtering
print("\nExample 8: Advanced filtering examples")
# Find large freshwater predators
large_predators = df[(df['avg_adult_length_inches'] > 24) & 
                    (df['diet_feeding_habits'].str.contains('fish|predator', case=False, na=False))]
print(f"Large predatory fish ({len(large_predators)} species):")
print(large_predators[['common_name', 'avg_adult_length_inches', 'family']].to_string(index=False))

print("\n[SUCCESS] Examples completed! Check the generated PNG files for visualizations.")
print("\nYou can now:")
print("1. Modify these examples for your specific analysis needs")
print("2. Create custom queries using df[df['column'] == 'value']")
print("3. Generate reports with df.to_excel() or df.to_html()")
print("4. Perform correlation analysis with df.corr()")
print("5. Create pivot tables with df.pivot_table()")