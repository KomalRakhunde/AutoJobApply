# 🚀 ApplyAI - AI-Powered Job & Recruitment Portal

> Next-Generation Autonomous Recruitment & Job Application Platform powered by Next.js 13, NestJS, Groq, OpenRouter AI, and Prisma.

🌐 **Live Production Deployment**: [https://auto-apply-ashy.vercel.app/](https://auto-apply-ashy.vercel.app/)

---

## 🌟 Executive Overview

**ApplyAI** is a comprehensive, enterprise-grade AI job portal and candidate sourcing platform designed to connect talent with opportunities through intelligent automation. It empowers job seekers with AI-driven ATS resume optimization, automated cover letter generation, and interview preparation, while equipping recruiters with bulk AI resume parsing, candidate scoring, and automated pipeline workflows.

---

## ✨ Core Features & Portals

### 🎓 1. Student / Job Seeker Portal
- 📊 **Real-Time ATS Resume Analyzer**: Evaluates resumes against technical standards and target Job Descriptions, returning granular 0-100 match scores, keyword coverage, and section formatting checks.
- ✍️ **AI Cover Letter & Career Coach**: Generates customized cover letters tailored to specific role requirements and provides AI-driven career guidance.
- 🎯 **Job Search & Pipeline Tracker**: Real-time status tracking for applied jobs, interview schedules, assessments, and offers.
- 🎙️ **AI Mock Interview Generator**: Dynamic role-specific technical interview questions and scenario prep.

### 💼 2. Recruiter & Talent Acquisition Portal
- 📑 **Job Posting Management**: Create, edit, and configure job requirements, cutoff passing thresholds, and auto-interview triggers.
- ⚡ **Bulk Resume AI Parsing**: Upload multiple resume files (PDF/Text) simultaneously; parsed cleanly with `pdf-parse` and evaluated in real-time by AI models.
- 📈 **Candidate Pipeline Dashboard**: View applicant scores, match summaries, strengths, gaps, and drag-and-drop pipeline stage updates.
- 📅 **Automated Interview Scheduling**: Auto-trigger interview invites when candidate ATS scores exceed configurable thresholds.

### 🛡️ 3. Admin & Super-Admin Portals
- 🔑 **Multi-Tenant Role Access Control**: Secure role isolation for `Student`, `Recruiter`, `Admin`, and `Super Admin`.
- 📊 **Platform Analytics & System Monitoring**: Real-time audit logs, active user metrics, system throughput, and feature usage analytics.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | Next.js 13 (App Router), React 18, TypeScript |
| **Styling & UI** | Tailwind CSS, Radix UI Primitives, Lucide Icons, Recharts |
| **State & Data Fetching** | TanStack Query (React Query), Redux Toolkit, React Hook Form |
| **Backend API** | NestJS (Node.js), Express, TypeScript |
| **Database & ORM** | PostgreSQL, Prisma ORM |
| **AI LLM Services** | Groq SDK (`llama-3.3-70b`), OpenRouter API (`meta-llama/llama-3.3-70b-instruct`), Hybrid Local ATS Engine |
| **Document Processing** | `pdf-parse`, Multer File Uploads |

---

## 💻 Local Installation & Setup Guide

### 1. Prerequisites
- Node.js `v18.x` or higher
- npm / yarn / pnpm

### 2. Clone the Repository
```bash
git clone https://github.com/lexonitsolutions/AutoJobApply.git
cd AutoJobApply
```

### 3. Install Dependencies
```bash
# Frontend
cd project
npm install

# Backend
cd .backend-reference
npm install
```

### 4. Configure Environment Variables
Create `.env` files in both `project/` and `project/.backend-reference/`:

**Frontend (`project/.env`)**:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
OPENROUTER_API_KEY=your_openrouter_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

**Backend (`project/.backend-reference/.env`)**:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:password@localhost:5432/jobportal?sslmode=disable"
OPENROUTER_API_KEY=your_openrouter_api_key_here
GROQ_API_KEY=your_groq_api_key_here
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
```

---

## 🚀 Running the Application Locally

### Start Backend Server (NestJS - Port 5000)
```bash
cd project/.backend-reference
npm run start:dev
```

### Start Frontend Server (Next.js - Port 3001)
```bash
cd project
npx next dev -p 3001
```

Access the application:
- **Frontend App**: `http://localhost:3001`
- **Backend API**: `http://localhost:5000`
- **Live Production URL**: [https://auto-apply-ashy.vercel.app/](https://auto-apply-ashy.vercel.app/)

---

## 🔒 Security & Privacy

- 🛡️ **Environment Key Isolation**: All secret API keys (`OPENROUTER_API_KEY`, `GROQ_API_KEY`, `JWT_SECRET`) are strictly excluded from Git tracking via `.gitignore`.
- 🔐 **JWT Token Authentication**: Secure role-based route protection implemented via Next.js Middleware.
- ⚡ **Offline Demo Fallbacks**: Intelligent local fallback engines ensure smooth demo capabilities even when external services or databases are offline.

---

## 📄 License

This project is licensed under the MIT License.
