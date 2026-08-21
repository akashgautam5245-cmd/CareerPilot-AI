# SolveFlow AI – Smart Daily Work & Problem Management System 🚀

> **Subtitle:** Smart Daily Work & Problem Management System  
> **Tagline:** Plan. Work. Solve. Improve.

---

## 1. Project Title & Overview

**SolveFlow AI** is a production-ready full-stack productivity platform designed specifically for students, software engineers, and AI researchers. It empowers users to manage daily work, calculate AI-assisted task priorities, diagnose technical blockers using structured root-cause analysis (RCA), execute optimized daily schedules, ask an AI assistant contextual questions, and track long-term focus analytics.

---

## 2. Problem Statement

Modern developers and students struggle with:
* Underestimating task durations by 20–30% leading to daily delay cascades.
* Getting stuck on recurring technical blockers (e.g. CUDA memory leaks, PostgreSQL connection leaks, dependency mismatches) without structured root-cause tracking.
* Generic to-do apps lacking intelligent context on workload, urgency, and AI priority scoring.
* Disconnect between daily task execution, daily reviews, and long-term knowledge retention.

---

## 3. Features

* **Complete Daily Work Management**: Create, edit, delete, search, filter, and sort tasks with categories, projects, priorities, and deadlines.
* **AI Task Priority Engine**: Computes priority scores (0–100) using multi-factor algorithms (importance, deadline urgency, difficulty, dependencies, workload).
* **AI Daily Planner ("Plan My Day")**: Generates optimized daily schedule timelines with 15-minute focus break blocks.
* **Problem Solver System**: Log technical blockers with severity ratings and status tracking.
* **AI Problem Solver & RCA Visualizer**: One-click AI diagnosis providing Problem Summary, Root Causes, Recommended Solutions, Action Plan, and Future Prevention.
* **Interactive Root Cause Diagram**: Visual flow (Problem → Cause → Evidence → Solution → Result → Prevention).
* **AI Personal Assistant**: Contextual chatbot answering prompts like *"What should I work on first?"*, *"Why am I behind today?"*, or *"Plan the rest of my day"*.
* **Productivity Analytics & Recharts**: Visual charts showing task completion velocity, estimated vs actual duration ratios, problem categories, and peak focus hours.
* **AI Productivity Insights**: Data-driven cards derived from real user database metrics.
* **End-of-Day Daily Review**: Reflection form (accomplishments, blockers, distractions, wins) with AI summary generation.
* **Personal Knowledge Base**: Convertible library of resolved problem solutions searchable by keywords and tags.
* **Interactive Calendar**: Monthly schedule plotting tasks, deadlines, focus sessions, and problem blockers.
* **Dark / Light SaaS Theme Switcher**: Persistent theme customization with smooth glassmorphism UI.

---

## 4. AI Features

1. **AI Priority Score Algorithm**: Weighted scoring engine (0–100) evaluating task importance, deadline proximity, duration, and dependencies.
2. **AI Problem Root-Cause Analyst**: Natural language reasoning predicting exact technical root causes (e.g. PyTorch CUDA wheel mismatch, PostgreSQL connection pool leaks).
3. **AI Day & Tomorrow Schedule Optimizer**: Time-blocking algorithm building realistic schedules around user available hours.
4. **AI Personalized Productivity Assistant**: Knowledge-aware assistant referencing stored task queues and problem history.
5. **AI Behavioral Insights Generator**: Pattern recognition detecting peak focus hours and estimation errors.

---

## 5. Technology Stack

### Frontend
* React.js (v18+)
* TypeScript
* Tailwind CSS (Glassmorphism design system)
* React Router v6
* Recharts (Area, Bar, Pie, Line charts)
* Lucide React Icons

### Backend
* Node.js
* Express.js
* TypeScript
* PostgreSQL & Prisma ORM
* JWT Authentication & Bcrypt password hashing

### AI Service
* Python (3.10+)
* FastAPI
* Pydantic
* Google Gemini API SDK (`google-genai`) with local rule-based fallback engine

---

## 6. System Architecture

```
                                  +-----------------------+
                                  |     React Frontend    |
                                  |   (Tailwind, Recharts)|
                                  +-----------+-----------+
                                              |
                                              | REST API (JWT)
                                              v
                                  +-----------+-----------+
                                  |    Node Express API   |
                                  |     (TypeScript)      |
                                  +-----+-----------+-----+
                                        |           |
                        Prisma ORM Client |           | HTTP REST
                                        v           v
                          +-------------+--+     +--+-------------------+
                          | PostgreSQL DB  |     | Python FastAPI AI    |
                          |  (Database)    |     | (Gemini 2.5 Engine)  |
                          +----------------+     +----------------------+
```

---

## 7. Folder Structure

```
solveflow-ai/
├── client/                      # React TypeScript Frontend
│   ├── src/
│   │   ├── components/layout/   # Sidebar, Header, Layout
│   │   ├── context/             # AuthContext, ThemeContext
│   │   ├── pages/               # All 17 Required Pages
│   │   ├── services/            # Axios API Client
│   │   ├── types/               # TypeScript Definitions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── tailwind.config.js
├── server/                      # Node.js Express Backend
│   ├── prisma/                  # schema.prisma & seed.ts
│   ├── src/
│   │   ├── config/              # Prisma & ENV setup
│   │   ├── controllers/         # Express Route Controllers
│   │   ├── middlewares/         # Auth JWT & Error Handler
│   │   ├── routes/              # Express API Routes
│   │   ├── app.ts
│   │   └── server.ts
│   └── package.json
├── ai-service/                  # Python FastAPI AI Service
│   ├── main.py                  # FastAPI Application Endpoints
│   ├── requirements.txt
│   └── .env.example
├── .env.example
├── .gitignore
├── LICENSE
├── CONTRIBUTING.md
└── README.md
```

---

## 8. Database Schema Overview

The database uses Prisma ORM targeting PostgreSQL with key relational models:
* `User`: Credentials, bio, role, focus hours goal.
* `Task`: Title, description, project, category, priority, status, deadline, estimated & actual duration, AI priority score, AI recommendation.
* `Problem`: Related task, severity, status, root cause fields (whatHappened, whyHappened, whatTried, whatWorked, whatFailed, whatDifferentNextTime), AI analysis output.
* `KnowledgeBaseEntry`: Converted resolved solutions with search tags and usage counters.
* `DailyReview`: Date reflection entries with generated AI executive summaries.
* `ProductivityMetric`: Historical focus minutes, completion percentages, and estimation ratios.
* `AIInsight`: Data-derived insight cards.
* `Notification`: System and deadline alert notifications.

---

## 9. API Documentation

### Authentication
* `POST /api/auth/register` - Create account
* `POST /api/auth/login` - Authenticate user & get JWT token
* `GET /api/auth/me` - Fetch authenticated user profile

### Tasks
* `GET /api/tasks` - List tasks with search, filter, and sort
* `POST /api/tasks` - Create task with AI priority score calculation
* `GET /api/tasks/:id` - Fetch single task details
* `PUT /api/tasks/:id` - Update task status / details
* `DELETE /api/tasks/:id` - Delete task

### Problems & Root Cause Analysis
* `GET /api/problems` - List problem blockers
* `POST /api/problems` - Report new problem
* `GET /api/problems/:id` - Get problem details & RCA flow
* `PUT /api/problems/:id` - Save RCA answers or mark solved
* `POST /api/problems/:id/export-kb` - Convert resolved problem into Knowledge Base entry

### AI Endpoints
* `POST /api/ai/analyze-problem` - Run AI root-cause diagnosis
* `POST /api/ai/prioritize-tasks` - Recalculate AI priority scores
* `POST /api/ai/plan-day` - Generate optimized day schedule
* `POST /api/ai/assistant` - Q&A with AI Personal Assistant
* `GET /api/ai/insights` - Fetch productivity insight cards

---

## 10. Installation Steps

### Prerequisites
* Node.js v18+ or v20+
* Python 3.10+
* PostgreSQL (Optional: SQLite in-memory mode supported automatically for local execution)

---

## 11. Environment Variable Setup

Copy `.env.example` in root, `server/`, and `ai-service/`:
```bash
# Server Environment (.env in /server)
PORT=5000
JWT_SECRET=your_jwt_secret_key
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/solveflow_db?schema=public"
AI_SERVICE_URL="http://localhost:8000"

# AI Service Environment (.env in /ai-service)
AI_API_KEY=your_gemini_api_key_here
AI_MODEL=gemini-2.5-flash
```

---

## 12. How to Run Backend

```bash
cd server
npm install
npm run prisma:generate
npm run dev
```
Backend API will start on **`http://localhost:5000`**

---

## 13. How to Run Frontend

```bash
cd client
npm install
npm run dev
```
Frontend web app will run on **`http://localhost:5173`**

---

## 14. How to Run AI Service

```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Python AI microservice will start on **`http://localhost:8000`**

---

## 15. Database Migration & Seed Instructions

```bash
cd server
npm run prisma:migrate
npm run prisma:seed
```

---

## 16. Demo Account Credentials

Click **One-Click Student Demo Login** on the login page or enter:

| Email | Password |
| :--- | :--- |
| `student@example.com` | `Password123!` |

---

## 17. Screenshots Section

*(Include screenshots of Dashboard, Tasks Board, AI Problem Solver Root Cause Diagram, AI Assistant Chat, and Recharts Analytics)*

---

## 18. Deployment Preparation

* **Frontend**: Deploy `/client` folder directly to **Vercel** (`npm run build`).
* **Backend**: Deploy `/server` folder to **Render** or **Railway**.
* **AI Service**: Deploy `/ai-service` folder to **Render** or **Railway** as a Python Web Service.
* **Database**: Connect PostgreSQL instance on **Neon PostgreSQL** via `DATABASE_URL`.

---

## 19. Future Enhancements

* Integration with GitHub Issues and Jira.
* Voice command support for AI Assistant.
* Mobile app built with React Native.

---

## 20. Author Section

**SolveFlow AI Team**  
*Built for College Final Year AI & Data Science Project, GitHub Portfolio, and Tech Placement Interviews.*
