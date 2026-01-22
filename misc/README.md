# Miscellaneous Scripts and Utilities

This folder contains SQL scripts, utilities, and other miscellaneous files for the LuckerLife Fish Database project.

## Folder Purpose
- Keep the project root clean and organized
- Store all executable SQL scripts for database operations
- House utility scripts and one-off tools

## Contents

### SQL Scripts
- `update-supabase-image-urls.sql` - Updates fish image URLs to point to Supabase Storage
- `set-all-fresh.sql` - Sets all existing fish to Fresh water classification
- `verify-database-state.sql` - Comprehensive database status check
- `*-fix-*.sql` - Various database fixes and migrations

### Guidelines
1. **All SQL scripts go in this folder** - Never create .sql files in project root
2. **Use descriptive names** - Script purpose should be clear from filename  
3. **Include comments** - Each script should explain what it does
4. **Test scripts** - Include verification queries where appropriate

### Usage
Scripts in this folder are meant to be:
1. Copied into Supabase SQL Editor
2. Executed manually after review
3. Used for database maintenance and updates

**Note**: Always review SQL scripts before executing in production database.