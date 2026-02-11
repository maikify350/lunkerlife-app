# 🔍 IMAGE UPLOAD TROUBLESHOOTING GUIDE

## ✅ **Upload Functionality Status**

The image upload code is **already implemented** in your app! Here's what we have:

### **What's Implemented:**
- ✅ Drag-and-drop upload UI
- ✅ Click to upload button
- ✅ File upload to Supabase Storage
- ✅ Database record creation
- ✅ Error handling and notifications
- ✅ Multiple file upload support

### **Code Location:**
- **UI Component:** `tools/src/components/FishGallery.tsx` (lines 270-292)
- **Upload Function:** `tools/src/pages/FishManagementTwoPanel.tsx` (lines 182-245)
- **Connected:** Line 1015 - `onUploadImages={uploadImagesMutation}`

---

## 🐛 **Common Upload Errors & Solutions**

### **Error 1: "Upload Failed - Permission Denied"**

**Cause:** Supabase Storage bucket doesn't allow uploads

**Solution:**
1. Go to: https://gskbzaduwmsbaxddixmk.supabase.co
2. Click: **Storage** in left sidebar
3. Find: `fish-images` bucket
4. Click: **Policies** tab
5. Add policy:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'fish-images');

-- Allow public to read
CREATE POLICY "Allow public reads"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'fish-images');
```

### **Error 2: "Bucket 'fish-images' not found"**

**Cause:** Storage bucket doesn't exist

**Solution:**
1. Go to: **Storage** → **Create Bucket**
2. Name: `fish-images`
3. Public: ✅ Yes
4. File size limit: 10MB
5. Allowed MIME types: `image/*`

### **Error 3: "Failed to insert image record"**

**Cause:** `fish_images` table doesn't exist or has wrong schema

**Solution:**
Run this SQL in Supabase SQL Editor:

```sql
-- Create fish_images table if it doesn't exist
CREATE TABLE IF NOT EXISTS fish_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fish_id UUID NOT NULL REFERENCES fish_species(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  file_size INTEGER,
  is_default BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_fish_images_fish_id ON fish_images(fish_id);
CREATE INDEX IF NOT EXISTS idx_fish_images_status ON fish_images(status);

-- Enable RLS
ALTER TABLE fish_images ENABLE ROW LEVEL SECURITY;

-- Allow public to read active images
CREATE POLICY "Allow public to read active images"
ON fish_images
FOR SELECT
TO public
USING (status = 'active');

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated to insert"
ON fish_images
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update their images
CREATE POLICY "Allow authenticated to update"
ON fish_images
FOR UPDATE
TO authenticated
USING (true);
```

### **Error 4: "Authentication Required"**

**Cause:** User not logged in

**Solution:**
The app currently doesn't have authentication. You need to either:

**Option A: Disable RLS for testing**
```sql
ALTER TABLE fish_images DISABLE ROW LEVEL SECURITY;
```

**Option B: Use service role key (NOT RECOMMENDED for production)**
Update your Supabase client to use service role key

**Option C: Implement authentication** (Recommended)
Add Supabase Auth to your app

---

## 🧪 **Test Upload Functionality**

### **Step 1: Check Bucket Exists**
```sql
SELECT * FROM storage.buckets WHERE name = 'fish-images';
```

Should return 1 row with bucket info.

### **Step 2: Check Table Exists**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'fish_images';
```

Should return `fish_images`.

### **Step 3: Check RLS Policies**
```sql
SELECT * FROM pg_policies WHERE tablename = 'fish_images';
```

Should show your policies.

### **Step 4: Test Upload in App**
1. Open app: https://lunkerlife-app.vercel.app
2. Click on a fish
3. Click the image count badge (circle with number)
4. Try uploading an image
5. Check browser console (F12) for errors

---

## 🔧 **Quick Fix: Disable RLS for Testing**

If you just want to test uploads quickly:

```sql
-- Disable RLS on fish_images table
ALTER TABLE fish_images DISABLE ROW LEVEL SECURITY;

-- Make storage bucket public for uploads
UPDATE storage.buckets 
SET public = true 
WHERE name = 'fish-images';
```

⚠️ **Warning:** This allows anyone to upload. Only use for testing!

---

## 📊 **Check Current Setup**

Run these queries to see your current configuration:

```sql
-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'fish_images'
) as table_exists;

-- Check if bucket exists
SELECT EXISTS (
  SELECT FROM storage.buckets 
  WHERE name = 'fish-images'
) as bucket_exists;

-- Check RLS status
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'fish_images';

-- Check storage policies
SELECT * FROM storage.policies WHERE bucket_id = 'fish-images';
```

---

## 🎯 **Recommended Setup for Your App**

Since you're building an internal tool, I recommend:

### **1. Create the bucket (if missing):**
- Name: `fish-images`
- Public: Yes
- Max file size: 10MB

### **2. Create the table (if missing):**
Run the SQL from Error 3 above

### **3. Disable RLS for now:**
```sql
ALTER TABLE fish_images DISABLE ROW LEVEL SECURITY;
```

### **4. Test upload:**
Try uploading an image in the app

### **5. Check browser console:**
If it fails, check F12 → Console for error messages

---

## 📝 **Next Steps**

1. **Check if bucket exists** in Supabase Dashboard
2. **Check if table exists** with SQL query
3. **Try upload** in the app
4. **Share error message** if it fails

The code is ready - we just need to verify the Supabase configuration!

---

**Let me know what error you see in the browser console and I'll help fix it!** 🚀
