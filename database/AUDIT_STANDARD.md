# Database Standards

## Audit Fields Rule

**All tables MUST include four audit fields:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `created_dt` | TIMESTAMP WITH TIME ZONE | `NOW()` | When the record was created |
| `created_by` | TEXT | `'Admin'` | Who created the record |
| `updated_dt` | TIMESTAMP WITH TIME ZONE | `NOW()` | When the record was last updated |
| `updated_by` | TEXT | `'Admin'` | Who last updated the record |

## Template for New Tables

```sql
CREATE TABLE example_table (
    -- Primary key and data fields...
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- AUDIT FIELDS (required)
    created_dt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT DEFAULT 'Admin',
    updated_dt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by TEXT DEFAULT 'Admin'
);

-- Trigger for auto-updating updated_dt
CREATE OR REPLACE FUNCTION update_example_table_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_dt = NOW();
    NEW.updated_by = COALESCE(NEW.updated_by, 'Admin');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_example_table_updated_at
    BEFORE UPDATE ON example_table
    FOR EACH ROW
    EXECUTE FUNCTION update_example_table_updated_at();
```

## Existing Tables to Update

| Table | Status |
|-------|--------|
| `fish_species` | Migration: `misc/add-audit-fields.sql` |
| `fish_images` | Already has: `created_at`, `updated_at`, `deleted_at` |
| `user_profiles` | Already has: `created_at`, `updated_at` |

## Migration Files

- `misc/add-audit-fields.sql` - Run to add audit fields to `fish_species`
