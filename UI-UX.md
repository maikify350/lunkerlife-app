# LuckerLife UI/UX Design Specifications

## 📋 **Two-Panel Layout Requirements**

The fish management interface must implement a full-page, two-panel layout design for efficient data management and navigation.

---

## 🎛️ **7.1 Left Panel (Navigator)**

### **Panel Purpose**
Primary navigation and filtering interface for fish species selection.

### **Layout Structure**

#### **Top Section: Filter Controls**
- **3 Pill Buttons (Horizontal Layout)**:
  - `All` - Show all fish species
  - `Fresh` - Show only freshwater fish (class = 'Fresh')
  - `Salt` - Show only saltwater fish (class = 'Salt')
- **Behavior**: Only one pill active at a time, updates fish list immediately

#### **Sort Controls**
- **Sort Dropdown**: Populated from `sorting.json` configuration
- **Rule**: Only show sorting options where `show = true`
- **Behavior**: Updates fish list order immediately when changed

#### **Main Section: Fish List**
- **Scrollable List**: Handles large datasets with efficient scrolling
- **List Item Display**:
  - **Primary Text**: `common_name` (prominent, readable font)
  - **Secondary Text**: `species` (scientific name, smaller, muted text)
- **Selection Behavior**: 
  - Clicking any fish loads details in right panel
  - Visual indication of currently selected fish
  - List updates dynamically based on active filter + sort combination

---

## 📝 **7.2 Right Panel (Details Editor)**

### **Panel Purpose**
Complete fish record editing interface with save functionality.

### **Header Section**
- **Fish Title**: Display selected fish name prominently
- **Save Button**: 
  - Pill-style button positioned at top-right
  - **Disabled State**: When no unsaved changes (gray/muted)
  - **Enabled State**: When form is "dirty" (bright/action color)
  - **Save Action**: Calls `PUT /api/fish/[fish_pk]` with updated data
  - **Auto-update**: Sets `updated_dt` to current timestamp and `updated_by='Admin'`

### **Form Fields**
- **Complete Field Mapping**: All database fields represented as appropriate input types
- **Field Types**:
  - Text inputs for names, descriptions
  - Dropdowns for constrained values (class, environmental_status)
  - Number inputs for measurements (weight, length)
  - Textareas for longer content (habitat, techniques, description)
  - Checkboxes for boolean values (invasive)
- **Change Detection**: 
  - Track all field modifications to determine "dirty" state
  - Enable Save button only when changes exist
  - Visual indication of unsaved changes (optional)

---

## 🖼️ **7.3 Image Management System**

### **Default Image Display**
- **Prominent Placement**: Large, clear display of current default image
- **Fallback Handling**: Placeholder when no default image exists
- **Double-Click Behavior**: Opens modal image viewer

### **Modal Image Viewer**
- **Centered Display**: Full-size image centered on screen
- **Light Overlay**: Background dimmed but not too dark
- **Close Control**: X button positioned top-left for easy access
- **Responsive**: Handles various image sizes appropriately

### **Image Upload System**

#### **Upload Button Location**
- **Positioned**: Next to `image_name_location` field
- **Label**: "Upload Image" button

#### **Upload Modal Features**
- **File Picker**: Native file browser integration
- **Preview**: Show selected image before upload
- **Default Checkbox**: "Use as default" option
- **Submit Action**: 
  - Upload to Supabase Storage
  - Insert record in `fish_images` table
  - If "Use as default" checked: Update fish record's image field

### **Image Gallery Interface**

#### **Gallery Access**
- **Button/Link**: "Image Gallery" button for selected fish
- **Purpose**: Manage all images for current fish species

#### **Gallery Layout**
- **Thumbnail Grid**: Show all images as clickable thumbnails
- **Default Indicator**: Visual marker (badge/icon) on default image thumbnail
- **Actions Per Image**:
  - "Set as Default" - Make this image the primary image
  - "Delete" (optional) - Remove image with default handling

#### **Default Image Rules**
- **Enforcement**: Only one default image per fish species
- **Auto-Update**: When setting new default, unset previous default
- **Deletion Handling**: If deleting default image, either auto-select new default or allow no default

---

## 🎨 **Visual Design Guidelines**

### **Color Scheme**
- **Ocean Theme**: Blue-based palette reflecting aquatic environment
- **Accessibility**: Ensure sufficient contrast ratios
- **State Colors**: Clear visual distinction for active/inactive/disabled states

### **Typography**
- **Hierarchy**: Clear distinction between primary and secondary text
- **Readability**: Appropriate font sizes for comfortable reading
- **Scientific Names**: Italic formatting for species names (standard convention)

### **Responsive Behavior**
- **Panel Sizing**: Appropriate width allocation for both panels
- **Mobile Consideration**: Plan for responsive breakpoints
- **Scrolling**: Independent scrolling for left panel list and right panel form

### **User Feedback**
- **Loading States**: Indicate when data is being saved/loaded
- **Success/Error Messages**: Clear feedback for user actions
- **Unsaved Changes**: Visual indication of dirty form state

---

## 🔧 **Technical Implementation Notes**

### **State Management**
- Track selected fish ID for panel coordination
- Manage filter/sort state for list updates
- Handle form dirty state for save button logic

### **API Integration**
- Efficient loading of fish list with filtering
- Individual fish detail loading for right panel
- Image upload and management endpoints
- Real-time updates after save operations

### **Performance Considerations**
- Virtual scrolling for large fish lists
- Image lazy loading and optimization
- Debounced search/filter operations
- Efficient re-rendering on state changes

---

*This specification ensures a professional, efficient interface for fish species data management while maintaining scientific data integrity and user workflow optimization.*