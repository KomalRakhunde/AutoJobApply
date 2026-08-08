# ApplyAI - Full-Stack AI Automation & Career Platform

ApplyAI is an enterprise full-stack platform providing AI-powered job application automation, resume parsing, interview preparation, career coaching, and recruiter matching.

---

## 📁 Repository Structure

```
APPLY-AI/
├── backend/               # NestJS REST API Backend (Services, Microservices, Prisma)
├── docs/                  # Project Documentation & API Specs (API Contracts, Schemas)
├── frontend/              # Next.js 13+ App Router Web Application
├── shared/                # Shared utilities, constants, & contract types
├── uploads/               # Storage directory for document uploads
├── .env.example           # Environment variables configuration template
├── .gitignore             # Git ignore rules for monorepo
├── project-structure.txt  # Clean tree text representation of project files
└── README.md              # Project documentation and manager submission guide
```

---

## 🛠️ Stack & Architecture Overview

### 1. **Frontend (`/frontend`)**
* **Framework**: Next.js 13+ (App Router, React 18, TypeScript)
* **Styling**: Tailwind CSS, Radix UI, Shadcn/UI
* **State Management**: Redux Toolkit, React Query
* **Integrations**: Groq SDK (AI Acceleration), LiveKit (Real-time Video), Supabase Auth

### 2. **Backend (`/backend`)**
* **Framework**: NestJS (TypeScript)
* **ORM & Database**: Prisma ORM with PostgreSQL
* **Modules**: Auth, AI Services, Job Crawler/Automation, Resumes, Applications, Payments

### 3. **Documentation (`/docs`)**
* Contains [API_CONTRACT.md](docs/API_CONTRACT.md) detailing frontend-to-backend communication contracts.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.x or higher
* **npm** / **yarn** / **pnpm**
* **PostgreSQL** Database instance

### Installation & Running Locally

1. **Clone the repository and set up environment variables**:
   ```bash
   cp .env.example .env
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Frontend will run at: `http://localhost:3000`*

3. **Backend Setup**:
   ```bash
   cd backend
   npm install
   npx prisma generate
   npm run start:dev
   ```
   *Backend API will run at: `http://localhost:5000`*

---

## 📋 Manager Submission Summary
* **Clean Monorepo Architecture**: Strict separation of concern between frontend (`/frontend`), backend (`/backend`), shared resources (`/shared`), and documentation (`/docs`).
* **Optimized File Size**: Removed duplicate build artifacts and nested redundant directories.
* **Production Ready**: Fully configured TypeScript environments, Prisma schemas, and environment templates.
