# ApplyAI — Enterprise AI Automation & Career Sourcing Platform

[![Live Application](https://img.shields.io/badge/Live%20Demo-auto--apply--ashy.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://auto-apply-ashy.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-13.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.9-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Firecrawl AI](https://img.shields.io/badge/Firecrawl-v4.32-FF4500?style=for-the-badge&logo=firecrawl&logoColor=white)](https://www.firecrawl.dev/)

**Live Production URL**: [https://auto-apply-ashy.vercel.app/](https://auto-apply-ashy.vercel.app/)

ApplyAI is an enterprise-grade full-stack platform powering AI job application automation, real-time ATS resume scoring, autonomous public web candidate & job sourcing, LiveKit video/voice interviews, cover letter generation, and recruiter candidate management.

---

## ⚡ Current System & Production Status

* ✅ **Live Web Sourcing Engine**: Integrated with **Firecrawl AI SDK** (`FIRECRAWL_API_KEY`) for live candidate profile discovery and web job extraction.
* ✅ **Zero-Mock Enterprise Mandate**: Stripped away all hardcoded fallback arrays and mock data logic. All job feeds, candidate profile extractions, and scoring routines perform live API and database operations.
* ✅ **LiveKit AI Video Interview Studio**: Automated Round-1 AI voice and video screening sessions with real-time audio transcripts and STAR-format feedback.
* ✅ **Multi-Source Job Adapters**: Modular pluggable `JobSourceAdapter` architecture fetching real positions from HackerNews/YC Jobs, RemoteOK, and Simplify.
* ✅ **Automated Candidate Outreach**: Automated selection email dispatches via **Resend API** with fallback SMTP routing.
* ✅ **ATS Resume Analysis Engine**: PDF parser extracting contact details, normalizing skills against tech taxonomy, and computing candidate compatibility scores (0–100%).

---

## 📁 Monorepo Architecture

```
APPLY-AI/
├── backend/               # NestJS Enterprise API (Services, Modules, Prisma ORM, Firecrawl Engine)
│   ├── src/
│   │   ├── admin/         # Platform administration & LLM failover engine
│   │   ├── ai/            # Groq & OpenRouter AI integrations (ATS score, Cover Letter, STAR prep)
│   │   ├── automation/    # Firecrawl scraper service & modular JobSourceAdapters
│   │   ├── interview/     # LiveKit session generation & interview evaluation
│   │   ├── jobs/          # Public job pool, normalization, and student job matcher
│   │   ├── recruiters/    # Sourcing pipeline, resume parser, and candidate stages
│   │   └── prisma/        # PostgreSQL schema & database client
├── docs/                  # API Specifications & Contracts (API_CONTRACT.md)
├── frontend/              # Next.js 13+ App Router Web Application
│   ├── app/               # App Router pages (Jobs, Sourcing, Profile, Interview, Admin)
│   ├── components/        # Reusable UI components & providers
│   ├── features/          # Feature modules (Recruiter dialogs, Candidate Compare, ATS viewer)
│   └── services/          # API client services & state managers
├── shared/                # Shared types, DTO schemas, and utilities
├── uploads/               # Local/cloud storage for resume & document parsing
├── .env.example           # Environment variable template (Safe for GitHub)
├── vercel.json            # Monorepo deployment configuration for Vercel
└── README.md              # Enterprise documentation & current status
```

---

## ✨ Core Features & Capabilities

### 🏢 Recruiter & Talent Acquisition Suite
* 🌐 **Autonomous Firecrawl Sourcing**: Discovers and extracts candidate web profiles and public tech jobs live without mock data arrays.
* 📋 **Job Requisition Management**: Custom passing thresholds, auto-interview flags, headcount targets, and customized evaluation rounds.
* 📊 **Bulk Resume Parsing & ATS Scoring**: Batch PDF upload parsing with automatic skill extraction, experience calculation, and candidate ranking.
* ✉️ **Automated Outreach & Scheduling**: Auto-sends email invitations containing LiveKit AI interview links upon candidate qualification.
* ⚔️ **Candidate Comparison Studio**: Side-by-side technical skill, ATS score, and experience gap comparison tool.

### 👤 Candidate & Job Seeker Suite
* ⚡ **Auto-Apply Engine**: Automated background application submission with real-time execution logs.
* 📄 **AI ATS Resume Analyzer**: Instant resume compatibility scoring against specific Job Descriptions with actionable keyword gap analysis.
* ✍️ **AI Cover Letter Generator**: Generates tailored cover letters customized for Creative, Technical, or Executive leadership roles.
* 📹 **AI Video Practice Studio**: Real-time voice and video mock interview practice with STAR feedback.
* 🗺️ **Career Roadmap & Skill Gap Engine**: Personalized technical skill progression milestones based on target roles.

---

## 🛠️ Technology Stack

### **Frontend (`/frontend`)**
* **Framework**: Next.js 13+ (App Router, React 18, TypeScript)
* **Styling**: Vanilla CSS / Tailwind CSS, Radix UI Primitives, Lucide Icons, Glassmorphism UI
* **State & Data Fetching**: Redux Toolkit, TanStack React Query, Axios / Native Fetch
* **Audio & Video Studio**: `@livekit/components-react`, LiveKit WebRTC SDK

### **Backend (`/backend`)**
* **Framework**: NestJS 11+ (TypeScript, Dependency Injection, DTO Validation)
* **Database & ORM**: PostgreSQL, Prisma ORM 7+
* **Scraping & Sourcing Engine**: `@mendable/firecrawl-js` (Firecrawl SDK)
* **AI & LLM Services**: Groq API (`llama-3.3-70b-versatile`), OpenRouter API
* **Email & Outreach**: Resend SDK, Nodemailer SMTP

---

## 🚀 Local Development Setup

### Prerequisites
* **Node.js**: v18.x or higher
* **npm** / **pnpm**
* **PostgreSQL** Database (or SQLite / Supabase PostgreSQL)

### 1. Clone & Configure Environment Variables
```bash
# Copy template to active local env
cp .env.example .env
```
Ensure your `.env` contains valid keys for production features:
```env
FIRECRAWL_API_KEY="your_firecrawl_api_key"
GROQ_API_KEY="your_groq_api_key"
DATABASE_URL="postgresql://user:password@localhost:5432/applyai"
```

### 2. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend app runs at: `http://localhost:3000`*

### 3. Run Backend API
```bash
cd backend
npm install
npx prisma generate
npm run start:dev
```
*Backend API runs at: `http://localhost:5000`*

---

## 🔒 Security & Codebase Standards

* ✅ **Zero-Mock Enterprise Mandate**: Strict production architecture. Mock data fallbacks and dummy arrays are completely stripped out in favor of authentic API/DB responses.
* ✅ **Strict Error Handling & Resilience**: All async operations and external API requests are enclosed in try/catch blocks with clean logging traces.
* ✅ **Server-Side API Key Protection**: Secrets (`FIRECRAWL_API_KEY`, `GROQ_API_KEY`, `DATABASE_URL`) strictly reside on the server and are never leaked to client bundles.

---

## 🌐 Production Deployment

* **Live Application**: [https://auto-apply-ashy.vercel.app/](https://auto-apply-ashy.vercel.app/)
* **Vercel Monorepo Settings**:
  * **Framework Preset**: `Next.js`
  * **Root Directory**: `frontend`
