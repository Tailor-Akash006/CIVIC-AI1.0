# CIVICMIND – AI-Powered Civic Complaint Management & Intelligence Backend

CIVICMIND is an enterprise-grade civic technology backend built with **NestJS**, **TypeScript**, **PostgreSQL**, **Prisma ORM**, and the **Google Gemini API**. It transforms scattered citizen complaint reports into prioritized, explainable, and trackable municipal actions.

---

## 1. Architecture & Technology Stack

- **Framework**: NestJS 10 (Modular Controllers, Services, DTOs, Guards, Pipes, Filters)
- **Language**: TypeScript 5.7+
- **Database & ORM**: PostgreSQL 15+ with Prisma ORM 5.22
- **AI Processing**: Google Gemini API (`gemini-2.5-flash` via `@google/genai`) with structured JSON schema output and deterministic rule-based fallback
- **Authentication**: JWT, Passport.js, Bcrypt password hashing, Role-Based Access Control (`CITIZEN`, `AUTHORITY`, `ADMIN`)
- **File Uploads**: Multer disk storage with MIME and 10MB size validation
- **Documentation**: Swagger UI (`/api/docs`) & OpenAPI 3.0 specification
- **Testing**: Jest unit and e2e test suite

---

## 2. Directory Structure

```text
backend/
├── src/
│   ├── main.ts                         # Application entrypoint & Swagger setup
│   ├── app.module.ts                   # Root application module
│   ├── common/
│   │   ├── filters/                    # Global HTTP exception filter
│   │   └── decorators/                 # @Roles() and @CurrentUser() decorators
│   ├── prisma/
│   │   ├── prisma.service.ts           # Database connection lifecycle
│   │   └── prisma.module.ts            # Global Prisma module
│   ├── auth/
│   │   ├── auth.controller.ts          # /api/auth/register, /api/auth/login, /api/auth/me
│   │   ├── auth.service.ts             # Password hashing & JWT generation
│   │   ├── jwt.strategy.ts             # Passport JWT extraction & verification
│   │   ├── guards/                     # JwtAuthGuard, OptionalJwtAuthGuard, RolesGuard
│   │   └── dto/                        # RegisterDto, LoginDto
│   ├── ai/
│   │   ├── ai.service.ts               # Gemini AI prompt engine & Haversine distance
│   │   ├── ai.module.ts
│   │   └── interfaces/                 # AIAnalysisResult & DuplicateMatchResult
│   ├── complaints/
│   │   ├── complaints.controller.ts    # REST endpoints for complaint lifecycle
│   │   ├── complaints.service.ts       # Submission, AI triage trigger, duplicates, history
│   │   ├── complaints.module.ts
│   │   └── dto/                        # CreateComplaintDto, UpdateStatusDto, AssignDto
│   ├── dashboard/
│   │   ├── dashboard.controller.ts     # /api/dashboard/stats, priority, categories, trends, hotspots
│   │   ├── dashboard.service.ts        # Real DB aggregation & spatial clustering
│   │   └── dashboard.module.ts
│   ├── authorities/
│   │   ├── authorities.controller.ts   # Municipal departments & officer dispatch
│   │   ├── authorities.service.ts
│   │   └── authorities.module.ts
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   └── uploads/
│       ├── uploads.controller.ts       # POST /api/uploads, GET /api/uploads/:filename
│       ├── uploads.service.ts          # File MIME validation
│       └── uploads.module.ts
├── prisma/
│   ├── schema.prisma                   # PostgreSQL relational models & relations
│   └── seed.ts                         # Synthetic seed script (>40 complaints & demo accounts)
├── test/
│   └── ai.service.spec.ts              # Unit tests for AI & spatial calculation
├── .env.example                        # Environment variable template
├── civicmind-postman-collection.json   # Ready-to-import Postman collection
├── package.json
└── tsconfig.json
```

---

## 3. Database Schema Overview

```prisma
model User {
  id           String      @id @default(uuid())
  name         String
  email        String      @unique
  passwordHash String
  role         Role        @default(CITIZEN) // CITIZEN, ADMIN, AUTHORITY
  phone        String?
  department   String?
  complaintsReported Complaint[]
  complaintsAssigned Complaint[]
}

model Complaint {
  id              String          @id @default(uuid())
  trackingId      String          @unique // e.g. CIV-2026-8941
  title           String
  description     String          @db.Text
  category        String          // roads_potholes, water_sewage, etc.
  aiCategory      String?
  aiSummary       String?         @db.Text
  latitude        Float
  longitude       Float
  address         String?
  ward            String?
  imageUrl        String?
  priority        Priority        @default(MEDIUM) // LOW, MEDIUM, HIGH, CRITICAL
  priorityScore   Int             @default(50)     // 0 - 100
  priorityReason  String?         @db.Text
  status          ComplaintStatus @default(SUBMITTED)
  isAnonymous     Boolean         @default(false)
  reporterName    String?
  reporterEmail   String?
  assignedDept    String?
  duplicateOf     String?         // Self-relation for duplicate clusters
  history         ComplaintHistory[]
}

model ComplaintHistory {
  id             String           @id @default(uuid())
  complaintId    String
  previousStatus ComplaintStatus?
  newStatus      ComplaintStatus
  changedBy      String
  actorRole      String?
  remarks        String?          @db.Text
  createdAt      DateTime         @default(now())
}
```

---

## 4. Setup and Installation

### Prerequisites
- Node.js 18+ or 20+
- PostgreSQL 14+ (Local instance or cloud hosted via Supabase, Neon, or Cloud SQL)
- (Optional) Google Gemini API Key

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update your database connection string in `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/civicmind?schema=public"
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
JWT_SECRET="your_secure_random_jwt_secret"
PORT=3000
FRONTEND_URL="http://localhost:5173,http://localhost:3000"
```

### Step 3: Run Database Migrations & Seed
```bash
# Push schema to PostgreSQL
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed database with demo accounts and >40 synthetic complaints
npm run prisma:seed
```

### Step 4: Start the Backend Server
```bash
# Development mode with hot-reload
npm run start:dev

# Production build & run
npm run build
npm run start:prod
```

Once running:
- **API Base URL**: `http://localhost:3000/api`
- **Interactive Swagger Docs**: `http://localhost:3000/api/docs`

---

## 5. Seeded Demo Accounts

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Citizen** | `citizen@civicmind.demo` | `CivicMind2026!` | Sarah Jenkins (Citizen reporter) |
| **Authority** | `authority@civicmind.demo` | `CivicMind2026!` | Supervisor Marcus Vance (Rapid Asphalt Crew Lead) |
| **Admin** | `admin@civicmind.demo` | `CivicMind2026!` | Commissioner Walter Kowalski (City Dispatch Director) |

---

## 6. API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Create citizen or authority account
- `POST /api/auth/login` - Obtain JWT access token
- `GET /api/auth/me` - Get profile of authenticated user (`Bearer Token`)

### Citizen Complaint Submission & Tracking
- `POST /api/complaints` - Submit complaint with automatic Gemini AI triage & duplicate check
- `GET /api/complaints` - List complaints with filters (`status`, `priority`, `category`, `ward`, `search`, `page`, `limit`)
- `GET /api/complaints/tracking/:trackingId` - Public tracking endpoint (masks private personal data)
- `GET /api/complaints/:id` - Full complaint dossier with history and duplicate candidates
- `GET /api/complaints/:id/history` - Chronological audit trail

### Municipal Authority Operations
- `PATCH /api/complaints/:id/status` - Update status (`IN_PROGRESS`, `RESOLVED`, etc.) with remarks
- `PATCH /api/complaints/:id/assign` - Assign to department or field officer
- `POST /api/complaints/:id/merge/:duplicateId` - Merge duplicate report into primary ticket

### Dashboard Analytics (Real DB Statistics)
- `GET /api/dashboard/stats` - Total, pending, in-progress, resolved, critical counts & resolution %
- `GET /api/dashboard/priority` - Distribution grouped by LOW, MEDIUM, HIGH, CRITICAL
- `GET /api/dashboard/categories` - Percentage distribution by municipal sector
- `GET /api/dashboard/trends` - Daily incoming vs resolved trend data
- `GET /api/dashboard/hotspots` - Spatial clustering of active complaints with AI pattern insights

### Image Uploads
- `POST /api/uploads` - Upload complaint photo (JPG, PNG, max 10MB)
- `GET /api/uploads/:filename` - Static image file serving

---

## 7. Frontend Integration

Your existing React frontend is pre-configured with a clean API service layer in `src/services/api.ts`.

To connect your React frontend to this NestJS backend:

1. In the root directory, create or edit `.env`:
   ```env
   VITE_API_BASE_URL="http://localhost:3000/api"
   ```
2. The frontend automatically detects `VITE_API_BASE_URL` and switches from browser storage to calling the live NestJS backend endpoints!
3. If the backend is temporarily offline during testing, the frontend provides automatic fallback to local demo data so judges experience zero blank screens.

---

## 8. Limitations & Engineering Disclosures

1. **AI Processing & Rate Limits**:
   - The backend uses `gemini-2.5-flash` with a temperature of `0.2` and strict `application/json` output schema.
   - If the `GEMINI_API_KEY` is not provided or quota limits are exceeded (HTTP 429), the backend executes an **instant, transparent rule-based fallback engine** that classifies complaints, calculates safety scores (0–100), and flags `isFallback: true` and `modelUsed: 'civicmind-rule-engine-fallback'`.
2. **Duplicate Detection**:
   - Suspected duplicates are calculated using Haversine geographic distance ($\le 300\text{ meters}$) combined with Jaccard title/description keyword similarity.
   - The backend deliberately **links** suspected duplicates rather than automatically deleting or merging them, giving human dispatchers final merge authority to avoid false positive data loss.
3. **Geographic Hotspot Clustering**:
   - Hotspots group active complaints into grid sectors of approximately $0.01^\circ$ (~1.1 km radius). In full municipal production with PostGIS, spatial Voronoi polygons or ST_ClusterDBSCAN can replace grid aggregation.
