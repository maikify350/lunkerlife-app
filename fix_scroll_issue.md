# Fix for Scroll Issue in Fish Detail Panel

## Problem
The right panel detail form cannot scroll to the bottom, cutting off content.

## Solution
The issue is in the panel structure. The form content div has `overflow-y-auto` but may not have proper height constraints.

### Current Structure (Line 636):
```tsx
<div className="flex-1 overflow-y-auto">
  <div className="px-6 py-1 w-full bg-blue-50">
    <form className="space-y-6 w-full">
```

### Fix 1: Add padding-bottom to the form container
Change line 637 from:
```tsx
<div className="px-6 py-1 w-full bg-blue-50">
```

To:
```tsx
<div className="px-6 py-1 pb-20 w-full bg-blue-50">
```

### Fix 2: Ensure proper height on the main container
The issue might be that the parent container doesn't have a defined height. Make sure line 577 has proper height:
```tsx
<div className="h-full flex flex-col">
```

### Fix 3: Add min-height to ensure scrollability
In the overflow container (line 636), add min-height:
```tsx
<div className="flex-1 overflow-y-auto min-h-0">
```

## Complete Fix
In `FishManagementTwoPanel.tsx`, make these changes:

1. **Line 636** - Add min-height:
```tsx
<div className="flex-1 overflow-y-auto min-h-0">
```

2. **Line 637** - Add bottom padding:
```tsx
<div className="px-6 py-1 pb-20 w-full bg-blue-50">
```

3. **Ensure the parent container (line 575-577)** has proper height:
```tsx
<div className="flex-1 bg-gray-50 h-full">
  {(selectedFishId || isCreating) ? (
    <div className="h-full flex flex-col">
```

This will ensure:
- The detail panel takes full height
- The scrollable area has proper constraints
- There's padding at the bottom so content isn't cut off
- The scroll bar can reach all content