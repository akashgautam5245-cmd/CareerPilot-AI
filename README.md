# CareerPilot AI 🚀

> **Subtitle:** AI-Powered Career, Skill-Gap & Placement Intelligence Platform  
> **Tagline:** Know Your Gap. Build Your Skills. Get Career Ready.

---

## 1. Overview

**CareerPilot AI** is an intelligent full-stack career platform designed primarily for college students and job seekers. It analyzes candidate resumes, parses target job descriptions, calculates job-match and career-readiness scores, identifies skill gaps, recommends personalized portfolio projects and 90-day learning roadmaps, and provides AI-powered interview preparation.

---

## 2. Core Problem

College students and job seekers frequently apply for internships and jobs without knowing:
- Whether their profile actually matches target job requirements.
- Which specific technical or cloud skills they are missing.
- Which skills to prioritize learning first.
- Whether their resume bullet points are strong and quantified.
- Which portfolio projects will fill missing skill gaps.
- How ready they are for technical and behavioral interviews.

---

## 3. Technology Stack

### Frontend
- **Framework**: React.js (v18+) with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (Dark SaaS Glassmorphism Design System)
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js & Express.js (TypeScript)
- **Database ORM**: PostgreSQL / SQLite via Prisma ORM
- **Authentication**: JWT, bcryptjs password hashing, HTTP-only cookies

### AI Microservice
- **Language**: Python 3.11+
- **Framework**: FastAPI & Pydantic
- **NLP & Scikit-Learn**: TF-IDF Vectorization, Cosine Similarity, Heuristic Parsing
- **LLM Integration**: Google Gemini API (`google-genai` SDK) with local rule-based fallback engines

---

## 4. Architecture Diagram

```
                                  +-----------------------+
                                  |     React Frontend    |
                                  |   (TypeScript + Vite) |
                                  +-----------+-----------+
                                              |
                                              | REST API (JWT)
                                              v
                                  +-----------+-----------+
                                  |    Node Express API   |
                                  |     (TypeScript)      |
                                  +-----+-----------+-----+
                                        |           |
                         Prisma ORM     |           | HTTP REST
                                        v           v
                          +-------------+--+     +--+-------------------+
                          |  Database DB   |     | Python FastAPI AI    |
                          |  (PostgreSQL)  |     | (Gemini / TF-IDF)    |
                          +----------------+     +----------------------+
```

---

## 5. Core User Flow

```text
Register / Login
      ↓
Create Career Profile / Onboarding
      ↓
Upload Resume (PDF / DOCX)
      ↓
AI Resume Analysis (6-Pillar Breakdown)
      ↓
Paste Target Job Description
      ↓
AI Job Match & Skill Gap Analysis
      ↓
Personalized 90-Day Learning Roadmap
      ↓
Recommended Portfolio Projects
      ↓
AI Mock Interview & Evaluation
      ↓
Career Readiness Score & Analytics
```

---

## 6. Required SaaS Pages (All 20 Implemented)

1. **Landing Page** (`/`): Production SaaS landing page with Hero, How It Works, Features, Tech Stack, FAQ, and CTA.
2. **Login** (`/login`): Authentication screen with demo auto-fill credentials.
3. **Register** (`/register`): User account signup.
4. **Forgot Password** (`/forgot-password`): Password recovery request.
5. **Reset Password** (`/reset-password`): Secure password update screen.
6. **User Onboarding** (`/onboarding`): Setup wizard for university, target role, experience level, and skills.
7. **Dashboard** (`/dashboard`): Placement readiness overview, radar chart, metric cards, and priority focus items.
8. **Career Profile** (`/profile`): Comprehensive profile management, target role, salary, industry, and skill tags.
9. **Resume Analyzer** (`/resume`): Drag-and-drop resume upload (PDF/DOCX), 6-pillar score, strengths, weaknesses, and recommendations.
10. **Job Matcher** (`/job-matcher`): Paste target JD to calculate Match Score %, matched vs missing skills, and explainability breakdown.
11. **Skill Gap Engine** (`/skill-gap`): Categorized matrix (Strong, Developing, Weak, Missing) with AI priority ranking.
12. **90-Day Learning Roadmap** (`/roadmap`): Timeline broken into Month 1/2/3, weekly tasks, interactive completion checkboxes, and resource links.
13. **Project Recommendations** (`/projects`): AI portfolio projects tailored to missing skills with tech stack, problem statement, features, and implementation steps.
14. **AI Mock Interview** (`/interview/new`): Interactive mock studio supporting Technical, HR, Project, and Mixed interview modes with voice/text input and WPM tracking.
15. **Interview Results** (`/interview/:id/results`): Detailed score breakdown, filler word count, WPM speaking pace, what done well, what missed, and ideal answer structures.
16. **Career Readiness** (`/readiness`): Dynamic readiness score calculated across 6 empirical pillars with data-driven career insights.
17. **AI Career Assistant** (`/assistant`): RAG-augmented contextual assistant using user profile and resume data as context.
18. **Saved Jobs & Application Tracker** (`/jobs`): Application status Kanban/table tracking Saved, Applied, Interview, Rejected, and Selected.
19. **Career Analytics** (`/analytics`): Recharts visual graphs tracking skill growth, interview progression, radar matrices, and application conversion.
20. **Settings** (`/settings`): Theme customization, notification controls, and profile options.

---

## 7. Database Models (Prisma Schema)

- `User`: User credentials, university, degree, target role, career goal.
- `CareerProfile`: Target industry, target salary, location preferences, skills list.
- `Resume` & `ResumeSkill`: Document raw text, overall/pillar scores, strengths, weaknesses, recommendations.
- `Job` & `JobSkill`: Job posting details, required and preferred technical skills.
- `JobMatch`: Match percentage score, matched/missing skill arrays, why match / why not match reasoning.
- `Skill` & `SkillGap`: Skill taxonomy, user proficiency, required proficiency, priority rank, reason.
- `LearningRoadmap` & `RoadmapTask`: 90-day learning roadmap, weekly tasks, completion status, priority.
- `ProjectRecommendation`: Title, difficulty, estimated duration, tech stack, features, implementation steps, status.
- `Interview`, `InterviewQuestion`, `InterviewAnswer`, `InterviewEvaluation`: Mock interview sessions, voice metrics, score dimensions, feedback.
- `CareerInsight`: Empirical data-backed insight alerts.
- `SavedJob` & `Application`: Job application tracking board statuses and dates.

---

## 8. Installation & Setup

### Prerequisites
- Node.js (v18+ or v20+)
- Python 3.11+
- PostgreSQL (or automatic local SQLite mode)

### 1. Environment Setup
Copy `.env.example` to `.env` in root, `server/`, and `ai-service/`.

### 2. Backend Setup
```bash
cd server
npm install
npm run prisma:push
npm run prisma:seed
npm run dev
```
Backend API runs at: `http://localhost:5000`

### 3. Python AI Microservice Setup
```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
AI Engine runs at: `http://localhost:8000`

### 4. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Frontend Web Application runs at: `http://localhost:5173`

---

## 9. Demo Credentials

To experience the pre-configured candidate profile (`Alex Rivera` - UC Berkeley CS & Data Science student):

| Email | Password |
| :--- | :--- |
| `alex.rivera@careerpilot.ai` | `Password123!` |

---

## 10. License

MIT License. Designed for Placement Intelligence & Career Readiness.
