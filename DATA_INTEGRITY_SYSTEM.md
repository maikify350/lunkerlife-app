# 🔄 DATA INTEGRITY VERIFICATION SYSTEM

## 📋 **Overview**

A global "Resync & Verify" feature that checks data integrity and identifies issues across the database.

---

## 🎯 **Verification Checks**

### **1. Orphaned Images** 🖼️
**Check:** Images in `fish_images` table with no matching fish record

```sql
-- Find orphaned images
SELECT 
  fi.id,
  fi.filename,
  fi.fish_id,
  fi.storage_path
FROM fish_images fi
LEFT JOIN fish_species fs ON fi.fish_id = fs.id
WHERE fs.id IS NULL;
```

**Action:** 
- List orphaned images
- Option to delete or reassign

---

### **2. Orphaned Storage Files** 📁
**Check:** Files in Supabase Storage with no database record

```typescript
// Get all files from storage
const { data: storageFiles } = await supabase.storage
  .from('fish-images')
  .list()

// Get all storage paths from database
const { data: dbPaths } = await supabase
  .from('fish_images')
  .select('storage_path')

// Find files not in database
const orphanedFiles = storageFiles.filter(file => 
  !dbPaths.some(db => db.storage_path.includes(file.name))
)
```

**Action:**
- List orphaned files
- Option to delete from storage

---

### **3. Broken Image Links** 🔗
**Check:** Database records pointing to non-existent storage files

```typescript
// For each image record
const { data: images } = await supabase
  .from('fish_images')
  .select('*')

const brokenLinks = []
for (const img of images) {
  // Try to get file info
  const { data, error } = await supabase.storage
    .from('fish-images')
    .list(img.storage_path.split('/').slice(0, -1).join('/'))
  
  if (error || !data.some(f => img.storage_path.includes(f.name))) {
    brokenLinks.push(img)
  }
}
```

**Action:**
- List broken links
- Option to delete records or fix paths

---

### **4. Duplicate Images** 🔄
**Check:** Same file uploaded multiple times

```sql
-- Find duplicate filenames
SELECT 
  filename,
  COUNT(*) as count,
  array_agg(id) as image_ids
FROM fish_images
GROUP BY filename
HAVING COUNT(*) > 1;

-- Find duplicate file sizes (potential duplicates)
SELECT 
  file_size,
  COUNT(*) as count,
  array_agg(id) as image_ids
FROM fish_images
WHERE file_size IS NOT NULL
GROUP BY file_size
HAVING COUNT(*) > 1;
```

**Action:**
- List potential duplicates
- Show side-by-side comparison
- Option to keep one, delete others

---

### **5. Missing Default Images** ⭐
**Check:** Fish with multiple images but no default set

```sql
-- Fish with images but no default
SELECT 
  fs.id,
  fs.common_name,
  COUNT(fi.id) as image_count
FROM fish_species fs
JOIN fish_images fi ON fs.id = fi.fish_id
WHERE fi.status = 'active'
GROUP BY fs.id, fs.common_name
HAVING COUNT(CASE WHEN fi.is_default = true THEN 1 END) = 0
  AND COUNT(fi.id) > 0;
```

**Action:**
- Auto-set first image as default
- Or prompt user to select

---

### **6. Multiple Default Images** ⚠️
**Check:** Fish with more than one default image

```sql
-- Fish with multiple defaults
SELECT 
  fs.id,
  fs.common_name,
  COUNT(fi.id) as default_count
FROM fish_species fs
JOIN fish_images fi ON fs.id = fi.fish_id
WHERE fi.is_default = true
  AND fi.status = 'active'
GROUP BY fs.id, fs.common_name
HAVING COUNT(fi.id) > 1;
```

**Action:**
- Keep first, unset others
- Or prompt user to select

---

### **7. Invalid Image Status** 📊
**Check:** Images with invalid status values

```sql
-- Invalid status values
SELECT 
  id,
  filename,
  status
FROM fish_images
WHERE status NOT IN ('active', 'hidden')
  OR status IS NULL;
```

**Action:**
- Set to 'active' by default
- Or prompt for correct status

---

### **8. Soft-Deleted Images in Storage** 🗑️
**Check:** Images marked as deleted but still in storage

```sql
-- Soft-deleted images
SELECT 
  id,
  filename,
  storage_path,
  deleted_at
FROM fish_images
WHERE deleted_at IS NOT NULL;
```

**Action:**
- Option to permanently delete from storage
- Or restore (unset deleted_at)

---

### **9. Legacy Image Fields** 📜
**Check:** Fish using old `image` or `image_name_location` fields

```sql
-- Fish with legacy images
SELECT 
  id,
  common_name,
  image,
  image_name_location
FROM fish_species
WHERE image IS NOT NULL 
  OR image_name_location IS NOT NULL;
```

**Action:**
- Migrate to `fish_images` table
- Clear legacy fields after migration

---

### **10. Missing Fish Data** ❓
**Check:** Fish with missing critical information

```sql
-- Fish missing critical data
SELECT 
  id,
  common_name,
  CASE 
    WHEN family IS NULL THEN 'Missing family'
    WHEN species IS NULL THEN 'Missing species'
    WHEN class IS NULL THEN 'Missing class'
    WHEN description IS NULL THEN 'Missing description'
  END as missing_field
FROM fish_species
WHERE family IS NULL 
  OR species IS NULL 
  OR class IS NULL 
  OR description IS NULL;
```

**Action:**
- List fish with missing data
- Prompt for completion

---

## 🎨 **UI Design**

### **Resync Button Location:**
- Top right of Fish Management page
- Icon: 🔄 (refresh/sync icon)
- Label: "Verify Data Integrity"

### **Verification Modal:**
```
┌─────────────────────────────────────────┐
│  🔄 Data Integrity Verification         │
├─────────────────────────────────────────┤
│                                         │
│  Running checks...                      │
│  ✅ Orphaned images: 0 found            │
│  ✅ Orphaned files: 0 found             │
│  ⚠️  Broken links: 3 found              │
│  ✅ Duplicate images: 0 found           │
│  ⚠️  Missing defaults: 5 found          │
│  ❌ Multiple defaults: 2 found          │
│  ✅ Invalid status: 0 found             │
│  ✅ Soft-deleted: 0 found               │
│  ⚠️  Legacy images: 12 found            │
│  ✅ Missing data: 0 found               │
│                                         │
│  [View Details] [Auto-Fix] [Close]      │
└─────────────────────────────────────────┘
```

### **Details View:**
```
┌─────────────────────────────────────────┐
│  ⚠️ Broken Image Links (3 found)        │
├─────────────────────────────────────────┤
│  1. Barramundi                          │
│     Path: fish-images/abc/123.png       │
│     [Delete Record] [Fix Path]          │
│                                         │
│  2. Tuna, Bluefin                       │
│     Path: fish-images/def/456.png       │
│     [Delete Record] [Fix Path]          │
│                                         │
│  3. Marlin, Blue                        │
│     Path: fish-images/ghi/789.png       │
│     [Delete Record] [Fix Path]          │
│                                         │
│  [Fix All] [Back]                       │
└─────────────────────────────────────────┘
```

---

## 💻 **Implementation**

### **1. Create Verification Function**

```typescript
// tools/src/utils/dataIntegrity.ts

export interface VerificationResult {
  check: string
  status: 'pass' | 'warning' | 'error'
  count: number
  items: any[]
  autoFixable: boolean
}

export async function runDataIntegrityChecks(): Promise<VerificationResult[]> {
  const results: VerificationResult[] = []
  
  // Check 1: Orphaned images
  results.push(await checkOrphanedImages())
  
  // Check 2: Orphaned storage files
  results.push(await checkOrphanedStorageFiles())
  
  // Check 3: Broken image links
  results.push(await checkBrokenImageLinks())
  
  // Check 4: Duplicate images
  results.push(await checkDuplicateImages())
  
  // Check 5: Missing default images
  results.push(await checkMissingDefaults())
  
  // Check 6: Multiple default images
  results.push(await checkMultipleDefaults())
  
  // Check 7: Invalid status
  results.push(await checkInvalidStatus())
  
  // Check 8: Soft-deleted in storage
  results.push(await checkSoftDeleted())
  
  // Check 9: Legacy image fields
  results.push(await checkLegacyImages())
  
  // Check 10: Missing fish data
  results.push(await checkMissingData())
  
  return results
}

async function checkOrphanedImages(): Promise<VerificationResult> {
  const { data } = await supabase
    .from('fish_images')
    .select(`
      id,
      filename,
      fish_id,
      storage_path
    `)
    .is('fish_species.id', null)
  
  return {
    check: 'Orphaned Images',
    status: data && data.length > 0 ? 'error' : 'pass',
    count: data?.length || 0,
    items: data || [],
    autoFixable: true
  }
}

// ... implement other check functions
```

### **2. Create UI Component**

```typescript
// tools/src/components/DataIntegrityModal.tsx

import { FC, useState } from 'react'
import { runDataIntegrityChecks, VerificationResult } from '../utils/dataIntegrity'

interface DataIntegrityModalProps {
  isOpen: boolean
  onClose: () => void
}

const DataIntegrityModal: FC<DataIntegrityModalProps> = ({ isOpen, onClose }) => {
  const [results, setResults] = useState<VerificationResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [selectedCheck, setSelectedCheck] = useState<VerificationResult | null>(null)
  
  const runChecks = async () => {
    setIsRunning(true)
    const checkResults = await runDataIntegrityChecks()
    setResults(checkResults)
    setIsRunning(false)
  }
  
  const autoFix = async () => {
    // Auto-fix all fixable issues
    for (const result of results) {
      if (result.autoFixable && result.count > 0) {
        await autoFixIssue(result)
      }
    }
    // Re-run checks
    await runChecks()
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">🔄 Data Integrity Verification</h2>
        
        {!results.length ? (
          <div className="text-center py-8">
            <button
              onClick={runChecks}
              disabled={isRunning}
              className="px-6 py-3 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700"
            >
              {isRunning ? 'Running Checks...' : 'Start Verification'}
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-2 mb-4">
              {results.map((result, i) => (
                <div
                  key={i}
                  className={`p-3 rounded border cursor-pointer ${
                    result.status === 'pass' ? 'border-green-200 bg-green-50' :
                    result.status === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                    'border-red-200 bg-red-50'
                  }`}
                  onClick={() => result.count > 0 && setSelectedCheck(result)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌'}
                      {' '}{result.check}
                    </span>
                    <span className="text-sm text-gray-600">
                      {result.count} {result.count === 1 ? 'issue' : 'issues'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={autoFix}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Auto-Fix All
              </button>
              <button
                onClick={runChecks}
                className="px-4 py-2 bg-ocean-600 text-white rounded hover:bg-ocean-700"
              >
                Re-run Checks
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </>
        )}
        
        {/* Details modal for selected check */}
        {selectedCheck && (
          <div className="mt-4 p-4 border rounded">
            <h3 className="font-bold mb-2">{selectedCheck.check} Details</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedCheck.items.map((item, i) => (
                <div key={i} className="p-2 bg-gray-50 rounded text-sm">
                  {JSON.stringify(item, null, 2)}
                </div>
              ))}
            </div>
            <button
              onClick={() => setSelectedCheck(null)}
              className="mt-2 px-3 py-1 bg-gray-300 rounded text-sm"
            >
              Close Details
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DataIntegrityModal
```

### **3. Add Button to Fish Management**

```typescript
// In FishManagementTwoPanel.tsx

const [isIntegrityModalOpen, setIsIntegrityModalOpen] = useState(false)

// In the header section
<div className="flex gap-2">
  <Button
    onClick={() => setIsIntegrityModalOpen(true)}
    className="bg-purple-600 hover:bg-purple-700"
  >
    🔄 Verify Data
  </Button>
  <Button
    onClick={handleCreateNew}
    disabled={isCreating}
    className="bg-ocean-600 hover:bg-ocean-700"
  >
    ➕ Add New Fish
  </Button>
</div>

// At the end of the component
<DataIntegrityModal
  isOpen={isIntegrityModalOpen}
  onClose={() => setIsIntegrityModalOpen(false)}
/>
```

---

## 🎯 **Benefits**

1. **Data Quality:** Identify and fix data integrity issues
2. **Storage Cleanup:** Remove orphaned files to save space
3. **Performance:** Clean database improves query speed
4. **Maintenance:** Easy to spot and fix issues
5. **Confidence:** Know your data is clean and consistent

---

## 📊 **Reporting**

Generate a report after verification:

```
Data Integrity Report
Generated: 2026-02-11 17:24:14

Total Checks: 10
Passed: 7
Warnings: 2
Errors: 1

Issues Found:
- Broken image links: 3
- Missing default images: 5
- Multiple default images: 2

Auto-Fixed:
- Set default images: 5
- Fixed multiple defaults: 2

Manual Action Required:
- Broken image links: 3 (delete or fix paths)

Next Recommended Run: 1 week
```

---

## 🚀 **Future Enhancements**

1. **Scheduled Checks:** Auto-run weekly
2. **Email Notifications:** Alert on critical issues
3. **Audit Log:** Track all fixes made
4. **Backup Before Fix:** Create backup before auto-fix
5. **Custom Checks:** Allow users to add custom verification rules

---

**This system would provide comprehensive data integrity verification and maintenance capabilities!** 🎉
