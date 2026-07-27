# AI Resume Analyzer & Interview Coach 🚀

A modern, production-ready full-stack web application that empowers job seekers and students to analyze resumes against ATS metrics, identify skill gaps, conduct AI-driven mock interviews, generate optimized resume content, track job applications, build resumes with live preview, and access an administrative management suite.

---

## 🌟 Key Features

### 1. 📄 ATS Resume Analyzer & Bullet Enhancer
- **Multi-Format Support**: Upload PDF or DOCX files up to **10MB**.
- **10+ ATS Metric Breakdown**: Overall ATS Score (0–100), Keyword Match, Formatting, Grammar, Section Ordering, Technical & Soft Skills.
- **Actionable AI Feedback**: Missing keywords list, weak section warnings, and one-click PDF analysis report download.
- **One-Click AI Bullet Rewriter**: Upgrade generic bullet points with strong action verbs and quantifiable metrics.

### 2. 🎙️ AI Mock Interview Studio
- **Dynamic Question Generation**: Custom questions based on Role, Difficulty (Beginner to Expert), and Type (Technical, Behavioral, HR, System Design).
- **Multi-Metric AI Evaluation**: Immediate scoring for **Confidence**, **Technical Accuracy**, **Grammar**, and **Communication**.
- **Voice & Text Modes**: Practice typing or speaking answers out loud.

### 3. 🎯 Skill Gap & Learning Roadmap
- **Role Benchmarking**: Compare your skills against target roles (Software Engineer, AI Engineer, Data Scientist, Full Stack, Cyber Security, etc.).
- **Interactive Roadmap Visualizer**: Prioritized learning phases with estimated completion duration and recommended resources.

### 4. 📝 Drag-and-Drop Interactive Resume Builder
- **Professional Templates**: Modern SaaS and Classic Minimal themes.
- **Live Preview Pane**: Real-time updates as you edit personal info, experience, and skills.
- **One-Click Export**: Instant PDF download formatted for ATS parsers.

### 5. 💼 Job Application Tracker (Kanban Board)
- **Status Columns**: Wishlist, Applied, Interviewing, Offer Received, Rejected, Accepted.
- **Application Analytics**: Funnel conversion stats and interview reminders.

### 6. 🤖 AI Career Assistant & Chatbot
- Conversational coach for resume tips, interview questions, coding advice, and STAR behavioral guidance.

### 7. 🛡️ Admin Management Suite
- **Platform Analytics**: Total users, total resumes parsed, daily visitors, monthly growth charts.
- **User Controls**: Account search, status toggles (Suspend / Activate), and permanent deletion.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Glassmorphic Design System
- **Icons & Animations**: Lucide React + Framer Motion
- **Data Visualization**: Recharts (Radar charts, Area trend lines, Bar graphs)
- **PDF Export**: jsPDF

### Backend
- **Runtime**: Node.js + Express.js + TypeScript
- **Database & ORM**: PostgreSQL + Prisma ORM
- **Authentication**: JWT Access & Refresh Tokens, Google OAuth handler, Password Hashing with bcryptjs
- **AI Integration**: Google Gemini 2.5 Flash API with modular OpenAI strategy pattern fallback
- **File Parsing & Storage**: `pdf-parse`, `mammoth` (DOCX), Multer, Cloudinary SDK with local fallback
- **Security & Quality**: Helmet, CORS, Express Rate Limit, Zod validation, OpenAPI / Swagger documentation, Vitest API testing suite

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ or v20+)
- npm or yarn
- PostgreSQL (Optional; built-in in-memory fallback handles local execution without database setup)

### 1. Clone & Setup Backend
```bash
cd server
npm install
npm run prisma:generate
# (Optional) Seed test accounts
npm run prisma:seed
npm run dev
```
Backend API will start on **`http://localhost:5000`**  
OpenAPI / Swagger docs available at **`http://localhost:5000/api/v1/docs`**

### 2. Setup Frontend
```bash
cd client
npm install
npm run dev
```
Frontend web application will run on **`http://localhost:5173`**

---

## 🔑 Demo Account Credentials

Click the **One-Click Quick Demo Login** buttons on the login page or use:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `student@example.com` | `Password123!` |
| **Admin** | `admin@example.com` | `AdminPass123!` |

---

## 🐳 Docker Deployment

To launch the full stack (PostgreSQL + Express Backend + Vite Frontend) in Docker:
```bash
docker-compose up --build -d
```

---

## 🌐 Deployment Overview

- **Frontend**: Deploy `/client` folder directly to **Vercel** (`npm run build`).
- **Backend**: Deploy `/server` folder to **Render** or **Railway**.
- **Database**: Connect free PostgreSQL instance on **Neon PostgreSQL** via `DATABASE_URL`.
