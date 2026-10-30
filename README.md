# CIVICMIND – AI-Powered Civic Intelligence Platform

**Every complaint matters. Every action counts.**

CIVICMIND is an AI-powered civic complaint management platform designed to transform citizen complaints into organized, prioritized, and trackable civic actions.

The platform aims to help citizens report public infrastructure and service-related problems while enabling authorities to understand, prioritize, assign, and resolve complaints efficiently.

---

## 1. Problem Statement

Citizens frequently face civic issues such as:

- Road potholes and damaged roads.
- Waterlogging and drainage problems.
- Improper garbage disposal.
- Broken streetlights.
- Public infrastructure damage.
- Other local public service issues.

Traditional complaint management systems often lack effective prioritization, duplicate detection, geographical insights, and transparent tracking.

CIVICMIND aims to bridge this gap using artificial intelligence and data-driven decision-making.

## 2. Our Solution

CIVICMIND provides a centralized platform where citizens can submit complaints and authorities can manage them through an intelligent dashboard.

The proposed system follows four major stages:

1. **CAPTURE:** Citizens submit complaints with descriptions, categories, images, and locations.
2. **UNDERSTAND:** AI analyzes complaints, identifies categories, detects potential duplicates, and recommends priorities.
3. **REVEAL:** Dashboards and geographical visualizations highlight recurring problems and high-priority areas.
4. **ACT:** Authorities review, assign, update, and track complaints until resolution.

## 3. Key Features

### Citizen Features
- Simple complaint submission.
- Issue category selection.
- Location-based reporting.
- Complaint status tracking.
- Transparent resolution updates.

### Authority Features
- Centralized complaint management.
- Priority-based complaint organization.
- Complaint assignment and status updates.
- Dashboard for monitoring civic issues.
- Identification of recurring problems.

### AI-Powered Intelligence
- Automatic complaint categorization.
- Complaint summarization.
- Potential duplicate complaint detection.
- Explainable priority recommendations.
- Civic issue hotspot identification.
- Action recommendations for authorities.

*AI capabilities are part of the planned platform functionality; only features actually integrated into the running prototype should be described as implemented in the final demonstration.*

## 4. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js, TypeScript |
| Backend | Node.js, NestJS |
| Database | Supabase PostgreSQL (planned integration) |
| AI Integration | Google Gemini API (planned integration) |
| Maps | React Leaflet, OpenStreetMap |
| Charts | Recharts |
| API Testing | Postman |
| Development | Visual Studio Code |

## 5. System Architecture

```text
             CITIZEN
                |
                v
       REACT FRONTEND
                |
                v
         NESTJS BACKEND
                |
       +--------+--------+
       |        |        |
       v        v        v
  COMPLAINT    AI     ANALYTICS
  MANAGEMENT  MODULE   MODULE
       |        |        |
       +--------+--------+
                |
                v
       SUPABASE DATABASE
         (PLANNED)
```

The React frontend communicates with the NestJS backend through REST APIs. The backend handles complaint operations and is intended to integrate AI analysis, analytics, and persistent database storage.

## 6. Backend API Endpoints

The initial NestJS backend provides the following endpoints:

| Method | Endpoint | Description |
|---|---|---|
| POST | `/complaints` | Submit a new complaint |
| GET | `/complaints` | Retrieve all complaints |
| GET | `/complaints/:id` | Retrieve a complaint by ID |

### Example: Submit a Complaint

**POST** `/complaints`

Request body:

```json
{
  "title": "Waterlogging near college",
  "description": "Rainwater has collected on the main road, making it difficult for vehicles to pass.",
  "category": "Waterlogging",
  "location": "Mijar, Karnataka"
}
```

Example response:

```json
{
  "id": 1,
  "title": "Waterlogging near college",
  "description": "Rainwater has collected on the main road, making it difficult for vehicles to pass.",
  "category": "Waterlogging",
  "location": "Mijar, Karnataka",
  "status": "Pending",
  "priority": "Medium",
  "createdAt": "2026-10-30T10:00:00.000Z"
}
```

## 7. Project Setup and Installation

### Prerequisites

Install the following:

- Node.js
- npm
- Visual Studio Code
- Postman (optional, for API testing)

### Step 1: Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

```bash
cd YOUR_PROJECT_FOLDER
```

### Step 2: Setup Backend

Navigate to the backend directory:

```bash
cd civicmind-backend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run start:dev
```

Backend runs at:

`http://localhost:3000`

### Step 3: Setup Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd civicmind-frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at the local URL displayed in your terminal, usually:

`http://localhost:5173`

## 8. Project Structure

### Backend

```text
civicmind-backend/
│
├── src/
│   ├── complaints/
│   │   ├── complaints.controller.ts
│   │   ├── complaints.service.ts
│   │   └── complaints.module.ts
│   │
│   ├── ai/
│   ├── analytics/
│   ├── app.module.ts
│   └── main.ts
│
├── package.json
└── tsconfig.json
```

### Frontend

```text
civicmind-frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
└── index.html
```

*The frontend structure is illustrative; adjust it to match the actual generated project.*

## 9. Expected Impact

CIVICMIND aims to:

- Improve communication between citizens and authorities.
- Reduce delays in identifying important civic issues.
- Help authorities identify recurring complaints.
- Improve transparency in complaint resolution.
- Support data-driven civic planning.
- Encourage citizen participation in community development.

## 10. Current Limitations

- The initial backend stores complaints in temporary in-memory storage.
- Complaints are lost when the backend restarts.
- Supabase database persistence is planned.
- Gemini AI analysis is planned and must be integrated before claiming live AI functionality.
- Map-based hotspot analysis and authority workflows require further implementation.
- The prototype uses development configurations and is not production-ready.

## 11. Future Enhancements

- Complete Gemini AI integration.
- Persistent complaint storage using Supabase.
- Image-based civic issue recognition.
- Advanced duplicate detection.
- Live geographical hotspot analysis.
- Authority assignment and resolution tracking.
- Citizen notifications.
- Multilingual complaint submission.
- Mobile application support.

## 12. Hackathon Project

**Project Name:** CIVICMIND  
**Theme:** AI for Civic Impact  
**Problem Statement:** From Complaints to Action  
**Category:** Artificial Intelligence / Civic Technology

---

**CIVICMIND – Every complaint matters. Every action counts.**

*Turning citizen voices into actionable civic intelligence.*
