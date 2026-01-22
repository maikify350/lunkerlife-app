# 🐟 LuckerLife Fish Database Management Tool

An internal web application for managing fish reference data and images that will be used to seed a fishing mobile app.

## 📋 Project Overview

**Mission**: Build a deterministic, self-healing internal tool for maintaining fish species data, images, and related information that will be exported for mobile app consumption.

**Architecture**: B.L.A.S.T. (Blueprint, Link, Architect, Stylize, Trigger) methodology with A.N.T. 3-layer structure

**Technology Stack**: React + TypeScript + Supabase + MCP

---

## 🏗️ Project Structure (B.L.A.S.T. Architecture)

### 📁 Root Configuration Files
- **`gemini.md`** - 🏛️ **Project Constitution** (data schemas, behavioral rules, architectural invariants)
- **`task_plan.md`** - 📅 Implementation phases with daily tasks and checklists  
- **`findings.md`** - 🔍 Research discoveries, constraints, and technical insights
- **`progress.md`** - 📊 Development log and status updates
- **`AntiGravityPromt.md`** - 📋 B.L.A.S.T. protocol directives and methodology
- **`.env`** - 🔐 Supabase configuration and API keys (not in repo)

### 📂 Folder Organization

#### `docs/` - 📚 **Documentation and Reference**
*Layer 2: Documentation and reference materials*
- `api-documentation.md` - REST API endpoints for mobile app integration
- `user-manual.md` - Content management user guide
- `deployment-guide.md` - Production deployment procedures
- `maintenance-procedures.md` - Ongoing system maintenance

#### `architecture/` - 🏗️ **Layer 1: SOPs & Procedures**
*Technical Standard Operating Procedures written in Markdown*
- `fish-data-management.md` - Fish species CRUD operations and workflows
- `image-upload-workflow.md` - Image management procedures and verification
- `taxonomy-management.md` - Scientific classification handling and validation
- `data-export-import.md` - Mobile app data seeding procedures and formats

#### `tools/` - ⚙️ **Layer 3: React Components & Application**
*Deterministic React scripts and UI components*
```
tools/
├── src/
│   ├── components/
│   │   ├── ui/           # Shadcn/ui base components
│   │   ├── fish/         # Fish-specific components
│   │   ├── images/       # Image management components
│   │   └── taxonomy/     # Taxonomy tree components
│   ├── pages/
│   │   ├── Dashboard.tsx    # Main overview and metrics
│   │   ├── FishManagement.tsx # Species CRUD interface
│   │   ├── ImageGallery.tsx   # Image upload and management
│   │   └── DataExport.tsx     # Export functionality
│   ├── hooks/           # Custom React hooks
│   ├── services/        # Supabase client & API calls
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Helper functions and utilities
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

#### `database/` - 🗄️ **Database Management & Schema**
*Supabase PostgreSQL schema definitions and management*
- `schema.sql` - Complete database schema with all tables
- `migrations/` - Database migration scripts and version history
- `seeds/` - Initial data for development and testing
- `supabase-config/` - Supabase project configuration files

#### `.tmp/` - 📁 **Temporary Workbench**
*Intermediate files and development testing (ephemeral)*
- Image processing intermediates
- Export/import staging files
- Development testing data
- Log files and debugging output

#### `misc/` - 📎 **Reference Materials**
*Catch-all folder for supporting materials*
- Project screenshots and wireframes
- Research documents and references  
- Design mockups and prototypes
- Meeting notes and decisions

---

## 🛠️ Technology Stack

### Frontend Architecture
- **React 18** - Component-based UI framework with hooks
- **TypeScript** - Type safety for scientific data integrity
- **Tailwind CSS** - Utility-first styling framework
- **Shadcn/ui** - Consistent, accessible component library
- **React Hook Form** - Form management with validation
- **React Query** - Server state management and caching
- **React Router** - Client-side routing and navigation

### Backend & Database
- **Supabase PostgreSQL** - Primary database with ACID compliance
- **Supabase Auth** - User authentication and authorization
- **Supabase Storage** - Image and file storage with CDN optimization
- **Supabase Real-time** - Live data synchronization
- **Supabase MCP** - Database schema management via Model Context Protocol

### Development & Deployment
- **Vite** - Fast development build tool with HMR
- **ESLint + Prettier** - Code quality and consistent formatting
- **Vercel** - Frontend hosting with automatic GitHub deployments
- **GitHub** - Version control and CI/CD pipeline

---

## 🎯 Current Project Status

### ✅ **Phase 0: Initialization Complete** 
- [x] Project discovery and scope definition
- [x] Comprehensive research on fishing app data patterns
- [x] Supabase MCP capabilities analysis
- [x] Database schema design based on scientific standards
- [x] Complete B.L.A.S.T. implementation plan
- [x] All project memory files created

### 🔄 **Phase 1: Link (In Progress)**
- [ ] Test Supabase connection and API key verification
- [ ] Configure Supabase MCP server for database operations
- [ ] Set up image storage buckets and access policies
- [ ] Verify authentication system functionality

### ⏳ **Upcoming Phases**
- **Phase 2: Architect** - Database schema implementation + React app foundation
- **Phase 3: Features** - Core application features and UI components
- **Phase 4: Polish** - UI/UX refinement and production deployment

---

## 🚀 Quick Start Guide

### Prerequisites
```bash
# Required software versions
node --version  # v18+
npm --version   # v9+
git --version   # Latest
```

### Environment Setup
1. **Clone and navigate to project**
   ```bash
   cd D:\WIP\LuckerLife
   ```

2. **Environment configuration**
   ```bash
   # Create .env file with Supabase credentials
   VITE_SUPABASE_URL=https://gskbzaduwmsbaxddixmk.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_ZLynthSYzZz0RthCMq6zRw_7l-F4y9u
   ```

3. **Development workflow** (when implementation begins)
   ```bash
   npm install          # Install dependencies
   npm run dev          # Start development server
   npm run build        # Build for production
   npm run test         # Run test suite
   ```

---

## 📊 Key Features Overview

### 🐟 **Fish Species Management**
- Complete CRUD operations for fish species
- Scientific taxonomy following Darwin Core standards
- Multi-language common name support
- Physical characteristics and habitat data
- Conservation status tracking

### 🖼️ **Image Gallery System**
- Drag-and-drop image upload with metadata
- Multiple image categorization (profile, dorsal, ventral, etc.)
- Image verification and approval workflow
- Thumbnail generation and CDN optimization
- Primary image selection for species

### 🌳 **Taxonomy Browser**
- Hierarchical tree navigation (Kingdom → Species)
- Expandable/collapsible scientific classification
- Quick filtering and search within taxonomy
- Species count by taxonomic rank

### 🔍 **Advanced Search & Filtering**
- Text search across scientific and common names
- Filter by habitat characteristics and water type
- Geographic region and distribution filtering
- Conservation status and fishing value filters

### 🗺️ **Geographic Distribution**
- Native vs. introduced species tracking
- Country and region association
- Abundance level management
- Coordinate-based location data

### 📊 **Data Export & API**
- JSON export optimized for mobile app consumption
- CSV export for spreadsheet compatibility
- RESTful API endpoints for mobile integration
- Darwin Core Archive support for scientific data

---

## 🔐 Security & Data Integrity

### Authentication & Authorization
- Supabase Auth integration with role-based access
- Row Level Security (RLS) on all database tables
- Protected routes and API endpoints
- User profile management with permission levels

### Data Validation
- Scientific name format validation
- Image metadata verification
- Multi-stage approval workflows
- Audit trails for all data modifications

---

## 📚 Documentation Links

### 🛠️ **Technical Documentation**
- [Project Constitution](gemini.md) - Complete schemas and architectural rules
- [Implementation Plan](task_plan.md) - Detailed 4-week development timeline
- [Research Findings](findings.md) - Comprehensive technical research

### 📋 **Development Procedures**
- [Fish Data Management](architecture/fish-data-management.md) - Species CRUD workflows
- [Image Upload Workflow](architecture/image-upload-workflow.md) - Image handling procedures
- [Taxonomy Management](architecture/taxonomy-management.md) - Classification workflows
- [Data Export Procedures](architecture/data-export-import.md) - Mobile app seeding

### 🚀 **Deployment & Operations**
- [API Documentation](docs/api-documentation.md) - REST endpoints for mobile integration
- [User Manual](docs/user-manual.md) - Content management guide
- [Deployment Guide](docs/deployment-guide.md) - Production setup procedures

---

## 🤝 Contributing & Development

### Development Workflow
1. **Follow B.L.A.S.T. methodology**: All changes must align with architectural invariants
2. **Update documentation**: Modify relevant `.md` files for any architectural changes
3. **Test thoroughly**: Validate all data operations and UI interactions
4. **Scientific accuracy**: Ensure all fish data follows taxonomic standards

### Code Quality Standards
- **TypeScript strict mode**: All code must be properly typed
- **Component structure**: Follow established patterns in `tools/src/components/`
- **Data validation**: Implement validation at all input points
- **Error handling**: Provide clear feedback for all failure scenarios

---

## 📞 Support & Maintenance

### Issue Reporting
- Technical issues: Document in project issue tracker
- Data accuracy concerns: Contact scientific data review team
- User experience feedback: Submit via user feedback system

### Maintenance Schedule
- **Daily**: Automated backups and health checks
- **Weekly**: Performance monitoring and optimization
- **Monthly**: Security updates and dependency management
- **Quarterly**: Full system review and capacity planning

---

## 📈 Project Roadmap

### **Phase 5: Enhancement** (Post-Launch)
- Advanced mapping with GIS integration
- AI-powered species identification
- Bulk data import from scientific databases
- Community contribution features

### **Phase 6: Scaling** (Future)
- Multi-language interface support
- Integration with external fish databases (FishBase, GBIF)
- Mobile app for field data collection
- Advanced analytics and reporting

---

**Project Started**: January 22, 2026  
**Current Phase**: Link (Connectivity & Setup)  
**Expected Completion**: February 19, 2026  
**Architecture**: B.L.A.S.T. + A.N.T. methodology  
**Status**: 🟡 Active Development  

---

*This README serves as the central guide to the LuckerLife project. For detailed technical specifications, refer to the project constitution in `gemini.md`.*