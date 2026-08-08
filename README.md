# ApplyAI — Enterprise AI Automation & Career Platform

[![Live Application](https://img.shields.io/badge/Live%20Demo-auto--apply--ashy.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://auto-apply-ashy.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-13.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.9-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

**Live Production URL**: [https://auto-apply-ashy.vercel.app/](https://auto-apply-ashy.vercel.app/)

ApplyAI is a full-stack platform providing AI-powered job application automation, real-time resume ATS scoring, cover letter generation, AI mock video interviews, career roadmaps, and candidate management.

---

## 📁 Monorepo Architecture

```
APPLY-AI/
├── backend/               # NestJS API Backend (Services, Modules, Prisma ORM)
├── docs/                  # API Specifications & Contracts (API_CONTRACT.md)
├── frontend/              # Next.js 13+ App Router Web Application
├── shared/                # Shared types, constants, and utilities
├── uploads/               # Storage directory for user resume & document uploads
├── .env.example           # Environment variable template (Safe for GitHub)
├── .gitignore             # Root monorepo Git ignore file
├── project-structure.txt  # Clean tree text representation of project files
├── vercel.json            # Monorepo deployment configuration for Vercel
└── README.md              # Project documentation & GitHub overview
```

---

## ✨ Key Features & Capabilities

* 📄 **AI Resume & ATS Score Analysis**: Upload PDF resumes to compute real-time ATS compatibility scores (0–100%), matched keywords, strengths, weaknesses, and improvement suggestions.
* ⚡ **Auto-Apply Engine**: Automated background application submission with log tracking.
* 🤖 **AI Cover Letter Generator**: Generate tailored cover letters in Creative, Executive, or Technical styles.
* 📹 **AI Video Resume & Interview Studio**: Real-time AI mock interview questions and video practice.
* 📊 **Recruiter & Admin Consoles**: Candidate evaluation, requisition management, and pipeline tracking.
* 🗺️ **Career Roadmap Generator**: Personalized career milestone planning based on skill gaps.
* 💼 **Salary Negotiation & Networking AI**: Outreach messaging and compensation guidance.

---

## 🛠️ Stack Overview

### **Frontend (`/frontend`)**
* **Framework**: Next.js 13+ (App Router, React 18, TypeScript)
* **Styling**: Tailwind CSS, Radix UI Primitives, Shadcn/UI
* **State & Query**: Redux Toolkit, TanStack React Query
* **AI & Real-Time**: Groq SDK, Supabase Auth, LiveKit WebSockets

### **Backend (`/backend`)**
* **Framework**: NestJS (TypeScript)
* **ORM & Database**: Prisma ORM with PostgreSQL
* **Modules**: Auth, AI Services, Resumes, Jobs, Applications, Recruiters, Admin

---

## 🚀 Local Development Setup

### Prerequisites
* **Node.js**: v18.x or higher
* **npm** / **yarn** / **pnpm**
* **PostgreSQL** Database instance (optional — backend supports Demo Fallback mode)

### 1. Clone & Configure Environment Variables
```bash
# Copy template to active local env (Never commit .env to GitHub)
cp .env.example .env
```

### 2. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs locally at: `http://localhost:3000`*

### 3. Run Backend
```bash
cd backend
npm install
npx prisma generate
npm run start:dev
```
*Backend API runs locally at: `http://localhost:5000`*

---

## 🔒 Security & GitHub Best Practices

* ✅ **Protected Secrets**: `.env` and `.env.local` files containing secret API keys (Groq, OpenRouter, Database passwords) are strictly excluded via [.gitignore](.gitignore) and will **NEVER be pushed to GitHub**.
* ✅ **Environment Template**: [.env.example](.env.example) is provided with placeholder variables for quick onboarding.
* ✅ **Clean Repository Layout**: All redundant build caches (`.next`, `.vercel`, `dist`, `node_modules`) are excluded.

---

## 🌐 Production Deployment

* **Live Web App**: [https://auto-apply-ashy.vercel.app/](https://auto-apply-ashy.vercel.app/)
* **Vercel Settings**:
  * **Root Directory**: `frontend` (or governed by root [vercel.json](vercel.json))
  * **Framework**: `Next.js`
