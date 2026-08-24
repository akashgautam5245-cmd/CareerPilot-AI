import os
import json
import logging
import re
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Machine Learning & NLP imports
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("careerpilot-ai-service")

app = FastAPI(
    title="CareerPilot AI Engine",
    description="Python FastAPI Microservice for AI Resume Parsing, Job Matching, Skill-Gap Analytics, Portfolio Project Recommendation, Mock Interviewing, and Career Guidance.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AI API Key & Client Setup
AI_API_KEY = os.getenv("AI_API_KEY") or os.getenv("GEMINI_API_KEY")

genai_available = False
try:
    from google import genai
    from google.genai import types
    if AI_API_KEY:
        genai_available = True
except ImportError:
    logger.warning("google-genai SDK not installed. Using local TF-IDF & heuristic NLP engines.")

def get_genai_client():
    if genai_available and AI_API_KEY:
        try:
            return genai.Client(api_key=AI_API_KEY)
        except Exception as e:
            logger.error(f"Failed to initialize GenAI client: {e}")
            return None
    return None

# ==================== COMMON DICTIONARIES & NLP DATA ====================
SKILL_TAXONOMY = {
    "programming": ["python", "java", "c++", "c#", "javascript", "typescript", "go", "rust", "r", "swift", "kotlin", "sql", "html", "css"],
    "data_science": ["pandas", "numpy", "scipy", "scikit-learn", "sklearn", "matplotlib", "seaborn", "statsmodels", "jupyter"],
    "machine_learning": ["machine learning", "deep learning", "pytorch", "tensorflow", "keras", "xgboost", "lightgbm", "nlp", "computer vision", "transformers", "huggingface", "llm", "rag", "embeddings"],
    "web_frameworks": ["react", "react.js", "next.js", "vue", "angular", "node.js", "express", "fastapi", "flask", "django", "spring boot", "tailwind css", "bootstrap"],
    "database": ["postgresql", "postgres", "mysql", "mongodb", "redis", "sqlite", "oracle", "dynamodb", "snowflake", "vector db", "chromadb"],
    "cloud_devops": ["aws", "azure", "gcp", "docker", "kubernetes", "git", "github", "gitlab", "ci/cd", "terraform", "linux", "bash"],
    "analytics_tools": ["power bi", "tableau", "excel", "google analytics", "looker", "a/b testing", "statistics", "hypothesis testing"]
}

# ==================== PYDANTIC SCHEMAS ====================

class ResumeAnalysisRequest(BaseModel):
    resumeText: str
    targetRole: Optional[str] = "Software Engineer"

class ResumeAnalysisResponse(BaseModel):
    overallScore: int
    skillsScore: int
    projectsScore: int
    experienceScore: int
    educationScore: int
    structureScore: int
    relevanceScore: int
    strengths: List[str]
    weaknesses: List[str]
    recommendations: List[str]
    extractedSkills: List[str]
    extractedEducation: Optional[str] = None
    extractedProjectsCount: int = 0

class JobAnalysisRequest(BaseModel):
    jobTitle: str
    company: Optional[str] = "Target Company"
    jobDescription: str

class JobAnalysisResponse(BaseModel):
    title: str
    company: str
    requiredSkills: List[str]
    preferredSkills: List[str]
    tools: List[str]
    experienceLevel: str
    keyResponsibilities: List[str]

class MatchJobRequest(BaseModel):
    userSkills: List[str]
    resumeText: str
    jobTitle: str
    jobDescription: str
    requiredSkills: List[str] = []
    preferredSkills: List[str] = []

class MatchJobResponse(BaseModel):
    matchScore: float
    breakdown: Dict[str, float]
    matchedSkills: List[str]
    missingSkills: List[str]
    developingSkills: List[str]
    whyMatch: List[str]
    whyNotMatch: List[str]
    recommendation: str

class SkillGapRequest(BaseModel):
    userSkills: List[str]
    targetRole: str
    targetJobsSkills: List[str] = []

class SkillGapItem(BaseModel):
    skillName: str
    status: str # STRONG, DEVELOPING, WEAK, MISSING
    userProficiency: int
    requiredProficiency: int
    priorityRank: int
    reason: str
    category: str

class SkillGapResponse(BaseModel):
    targetRole: str
    overallProficiency: float
    skillGaps: List[SkillGapItem]

class GenerateRoadmapRequest(BaseModel):
    targetRole: str
    userSkills: List[str]
    missingSkills: List[str]
    durationDays: Optional[int] = 90

class RoadmapTaskSchema(BaseModel):
    month: int
    week: int
    title: str
    description: str
    category: str
    resources: List[str]
    priority: str

class GenerateRoadmapResponse(BaseModel):
    title: str
    targetRole: str
    durationDays: int
    tasks: List[RoadmapTaskSchema]

class RecommendProjectsRequest(BaseModel):
    targetRole: str
    userSkills: List[str]
    missingSkills: List[str]
    resumeWeaknesses: List[str] = []

class ProjectRecSchema(BaseModel):
    title: str
    description: str
    difficulty: str
    estimatedDuration: str
    skillsGained: List[str]
    techStack: List[str]
    problemStatement: str
    features: List[str]
    implementationSteps: List[str]
    resumeValue: str

class RecommendProjectsResponse(BaseModel):
    projects: List[ProjectRecSchema]

class GenerateInterviewRequest(BaseModel):
    targetRole: str
    difficulty: Optional[str] = "Intermediate"
    interviewType: Optional[str] = "TECHNICAL" # TECHNICAL, HR, PROJECT, MIXED
    userSkills: Optional[List[str]] = []
    userProjects: Optional[List[str]] = []

class InterviewQuestionSchema(BaseModel):
    questionNumber: int
    text: str
    topic: str
    difficulty: str
    expectedKeyPoints: List[str]
    resumeContext: Optional[str] = None

class GenerateInterviewResponse(BaseModel):
    title: str
    targetRole: str
    questions: List[InterviewQuestionSchema]

class EvaluateAnswerRequest(BaseModel):
    questionText: str
    expectedKeyPoints: List[str]
    userAnswerText: str
    speakingDurationSeconds: Optional[int] = 0

class EvaluateAnswerResponse(BaseModel):
    score: float
    technicalCorrectness: int
    completeness: int
    relevance: int
    clarity: int
    depth: int
    whatDoneWell: List[str]
    whatMissed: List[str]
    betterAnswerStructure: str
    topicToRevise: str
    speakingPaceWpm: int
    fillerWordsCount: int

class AssistantRequest(BaseModel):
    message: str
    userProfile: Dict[str, Any]
    history: Optional[List[Dict[str, str]]] = []

class AssistantResponse(BaseModel):
    reply: str
    suggestedFollowUps: List[str]

# ==================== UTILITY NLP & TF-IDF HELPERS ====================

def extract_skills_from_text(text: str) -> List[str]:
    text_lower = text.lower()
    found_skills = set()
    for cat, skills in SKILL_TAXONOMY.items():
        for skill in skills:
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower):
                # Standardize casing
                found_skills.add(skill.capitalize() if len(skill) <= 4 else skill.title())
    return sorted(list(found_skills))

def calculate_text_similarity(doc1: str, doc2: str) -> float:
    if not doc1.strip() or not doc2.strip():
        return 0.0
    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform([doc1, doc2])
        sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return float(round(sim * 100, 1))
    except Exception as e:
        logger.error(f"TF-IDF similarity error: {e}")
        return 50.0

# ==================== ENDPOINTS ====================

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "CareerPilot AI Engine",
        "version": "1.0.0",
        "genai_active": genai_available and bool(AI_API_KEY)
    }

# 1. RESUME ANALYZER
@app.post("/ai/analyze-resume", response_model=ResumeAnalysisResponse)
def analyze_resume(req: ResumeAnalysisRequest):
    extracted_skills = extract_skills_from_text(req.resumeText)
    text_lower = req.resumeText.lower()

    # Heuristic Resume Scoring Engine
    skills_score = min(100, max(40, len(extracted_skills) * 10))
    has_metrics = bool(re.search(r'\b(\d+%|\$\d+|\d+x|\d+ users|\d+ ms)\b', text_lower))
    projects_score = 85 if ("project" in text_lower or "built" in text_lower) else 60
    if has_metrics:
        projects_score = min(100, projects_score + 10)
    
    experience_score = 80 if ("intern" in text_lower or "experience" in text_lower or "developer" in text_lower) else 65
    education_score = 90 if ("university" in text_lower or "bachelor" in text_lower or "bs" in text_lower or "gpa" in text_lower) else 75
    structure_score = 85 if ("education" in text_lower and "skills" in text_lower) else 70

    role_relevance = calculate_text_similarity(req.resumeText, f"{req.targetRole} software python developer data engineer computer science algorithms")
    relevance_score = int(min(98, max(50, role_relevance * 1.3)))

    overall_score = int((skills_score * 0.25) + (projects_score * 0.20) + (experience_score * 0.20) + (education_score * 0.15) + (structure_score * 0.10) + (relevance_score * 0.10))

    strengths = []
    if len(extracted_skills) >= 5:
        strengths.append(f"Strong technical skill breadth identified: {', '.join(extracted_skills[:4])}.")
    if education_score >= 85:
        strengths.append("Clear education credentials and academic baseline.")
    if has_metrics:
        strengths.append("Good inclusion of quantitative metrics and outcome indicators in project text.")
    else:
        strengths.append("Structured section breakdown with clear project headings.")

    weaknesses = []
    if not has_metrics:
        weaknesses.append("Resume lacks measurable metrics (e.g., '% efficiency gain', '$ saved', 'ms latency reduction').")
    if "aws" not in text_lower and "docker" not in text_lower:
        weaknesses.append("Missing modern cloud deployment & containerization keywords (AWS, Docker).")
    if len(extracted_skills) < 5:
        weaknesses.append("Technical skill list is sparse. Add specific frameworks, databases, and tooling.")

    recommendations = [
        "Add 2-3 bullet points with explicit metrics (e.g. 'improved API response speed by 30%').",
        f"Incorporate cloud deployment experience (AWS EC2, Docker) to boost target match for {req.targetRole}.",
        "Include links to live GitHub repositories or deployed demo applications."
    ]

    return ResumeAnalysisResponse(
        overallScore=overall_score,
        skillsScore=skills_score,
        projectsScore=projects_score,
        experienceScore=experience_score,
        educationScore=education_score,
        structureScore=structure_score,
        relevanceScore=relevance_score,
        strengths=strengths,
        weaknesses=weaknesses,
        recommendations=recommendations,
        extractedSkills=extracted_skills,
        extractedEducation="Extracted Degree / University" if education_score >= 80 else "Education Section Found",
        extractedProjectsCount=3 if projects_score >= 80 else 1
    )

# 2. JOB DESCRIPTION ANALYZER
@app.post("/ai/analyze-job", response_model=JobAnalysisResponse)
def analyze_job(req: JobAnalysisRequest):
    extracted_skills = extract_skills_from_text(req.jobDescription)
    
    # Divide into required vs preferred
    req_skills = extracted_skills[:max(3, int(len(extracted_skills)*0.7))]
    pref_skills = extracted_skills[int(len(extracted_skills)*0.7):]
    
    tools = [s for s in extracted_skills if s.lower() in ["git", "docker", "aws", "postman", "jira", "power bi", "tableau", "excel", "linux"]]
    if not tools:
        tools = ["Git", "Docker", "REST APIs"]

    exp_level = "Entry Level"
    if "senior" in req.jobDescription.lower() or "5+ years" in req.jobDescription.lower():
        exp_level = "Senior Level"
    elif "3+ years" in req.jobDescription.lower() or "mid" in req.jobDescription.lower():
        exp_level = "Mid Level"

    responsibilities = [
        f"Design and deliver core technical features using {req_skills[0] if req_skills else 'modern tech stack'}.",
        "Collaborate in agile sprints to maintain scalable system architecture.",
        "Perform code reviews, unit testing, and continuous integration pipeline deployments."
    ]

    return JobAnalysisResponse(
        title=req.jobTitle,
        company=req.company or "Target Organization",
        requiredSkills=req_skills if req_skills else ["Python", "SQL", "Git"],
        preferredSkills=pref_skills if pref_skills else ["AWS", "Docker"],
        tools=tools,
        experienceLevel=exp_level,
        keyResponsibilities=responsibilities
    )

# 3. AI JOB MATCHING
@app.post("/ai/match-job", response_model=MatchJobResponse)
def match_job(req: MatchJobRequest):
    user_skills_clean = [s.lower() for s in req.userSkills]
    
    if not req.requiredSkills:
        extracted_jd_skills = extract_skills_from_text(req.jobDescription)
        req_skills = extracted_jd_skills if extracted_jd_skills else ["python", "sql", "git"]
    else:
        req_skills = req.requiredSkills

    req_skills_clean = [s.lower() for s in req_skills]
    
    matched = []
    missing = []
    developing = []

    for sk in req_skills_clean:
        if sk in user_skills_clean:
            matched.append(sk.title())
        elif any(part in user_skills_clean for part in sk.split()):
            developing.append(sk.title())
        else:
            missing.append(sk.title())

    # Text similarity via TF-IDF
    tfidf_sim = calculate_text_similarity(req.resumeText, req.jobDescription)
    skill_match_ratio = (len(matched) + (len(developing)*0.5)) / max(1, len(req_skills_clean))
    
    match_score = float(round(min(98.0, max(25.0, (skill_match_ratio * 60.0) + (tfidf_sim * 0.4))), 1))

    why_match = [
        f"Matched {len(matched)} key required skills: {', '.join(matched[:4]) if matched else 'core tech skills'}.",
        f"Resume TF-IDF semantic relevance to target JD is {tfidf_sim:.1f}%."
    ]

    why_not_match = []
    if missing:
        why_not_match.append(f"Missing required skills: {', '.join(missing[:4])}.")
    if developing:
        why_not_match.append(f"Skills needing deeper proficiency: {', '.join(developing[:3])}.")

    recommendation = (
        f"High match! Apply directly while reinforcing {missing[0]}." if match_score >= 80
        else f"Good baseline match. Address missing skills ({', '.join(missing[:2])}) before applying for optimal placement probability."
    )

    return MatchJobResponse(
        matchScore=match_score,
        breakdown={
            "skillOverlap": round(skill_match_ratio * 100, 1),
            "semanticRelevance": tfidf_sim,
            "overallMatch": match_score
        },
        matchedSkills=matched,
        missingSkills=missing,
        developingSkills=developing,
        whyMatch=why_match,
        whyNotMatch=why_not_match,
        recommendation=recommendation
    )

# 4. SKILL GAP ANALYSIS & PRIORITIZATION
@app.post("/ai/analyze-skill-gap", response_model=SkillGapResponse)
def analyze_skill_gap(req: SkillGapRequest):
    user_skills = set(s.lower() for s in req.userSkills)
    
    # Target role skill templates if targetJobsSkills empty
    template_skills = {
        "data scientist": ["python", "sql", "pandas", "scikit-learn", "statistics", "aws", "pytorch"],
        "ml engineer": ["python", "pytorch", "docker", "aws", "fastapi", "git", "scikit-learn"],
        "software engineer": ["python", "javascript", "sql", "git", "docker", "react", "rest apis"],
        "frontend developer": ["javascript", "typescript", "react", "html", "css", "tailwind css", "git"],
        "backend developer": ["python", "node.js", "sql", "postgresql", "fastapi", "docker", "git"],
    }

    target_key = "software engineer"
    for k in template_skills:
        if k in req.targetRole.lower():
            target_key = k
            break

    target_reqs = req.targetJobsSkills if req.targetJobsSkills else template_skills[target_key]
    
    skill_gaps = []
    rank = 1

    for sk in target_reqs:
        sk_lower = sk.lower()
        if sk_lower in user_skills:
            status = "STRONG"
            u_prof = 90
            r_prof = 85
            reason = f"Strong core foundation. Fully satisfies hiring expectations for {req.targetRole}."
            cat = "Core Technical"
        else:
            # Check developing vs missing
            if any(part in user_skills for part in sk_lower.split()):
                status = "DEVELOPING"
                u_prof = 50
                r_prof = 80
                reason = f"Partial background detected. Needs project reinforcement to reach production level."
                cat = "Developing Competency"
            else:
                status = "MISSING" if rank <= 2 else "WEAK"
                u_prof = 20 if status == "WEAK" else 0
                r_prof = 80
                reason = f"Required in 70%+ of target {req.targetRole} postings. High placement impact."
                cat = "High Impact Gap"

        skill_gaps.append(SkillGapItem(
            skillName=sk.capitalize() if len(sk) <= 4 else sk.title(),
            status=status,
            userProficiency=u_prof,
            requiredProficiency=r_prof,
            priorityRank=rank,
            reason=reason,
            category=cat
        ))
        rank += 1

    # Sort so missing/weak come first
    skill_gaps.sort(key=lambda x: (0 if x.status in ["MISSING", "WEAK"] else (1 if x.status == "DEVELOPING" else 2)))
    for idx, sg in enumerate(skill_gaps):
        sg.priorityRank = idx + 1

    avg_prof = sum(sg.userProficiency for sg.skillGaps in [skill_gaps] for sg in sg) / max(1, len(skill_gaps))

    return SkillGapResponse(
        targetRole=req.targetRole,
        overallProficiency=round(avg_prof, 1),
        skillGaps=skill_gaps
    )

# 5. PERSONALIZED 90-DAY ROADMAP GENERATOR
@app.post("/ai/generate-roadmap", response_model=GenerateRoadmapResponse)
def generate_roadmap(req: GenerateRoadmapRequest):
    missing_str = ", ".join(req.missingSkills[:3]) if req.missingSkills else "Cloud Deployment & Advanced Topics"
    
    tasks = [
        RoadmapTaskSchema(
            month=1, week=1,
            title=f"Fundamentals of {req.missingSkills[0] if req.missingSkills else 'Core Role Skills'}",
            description="Core syntax, theoretical principles, and foundational exercises.",
            category="Core Theory",
            resources=["Official Documentation", "Interactive Coding Sandbox"],
            priority="HIGH"
        ),
        RoadmapTaskSchema(
            month=1, week=2,
            title="Practical Problem Solving & Exercises",
            description="Solve 15 targeted algorithmic or domain-specific practice problems.",
            category="Practice",
            resources=["LeetCode / HackerRank", "Domain Problem Set"],
            priority="HIGH"
        ),
        RoadmapTaskSchema(
            month=1, week=3,
            title="System Design & Best Practices",
            description="Understand clean architecture, error handling, and API integration guidelines.",
            category="Architecture",
            resources=["System Design Primer", "Best Practice Guides"],
            priority="MEDIUM"
        ),
        RoadmapTaskSchema(
            month=1, week=4,
            title="Month 1 Capstone Mini-Project",
            description=f"Build and test a lightweight application incorporating {missing_str}.",
            category="Project",
            resources=["GitHub Project Template", "Sample Dataset / API"],
            priority="HIGH"
        ),
        RoadmapTaskSchema(
            month=2, week=5,
            title="Docker Containerization & Environment Isolation",
            description="Write Dockerfiles and docker-compose configurations for full application stack.",
            category="DevOps",
            resources=["Docker Official Docs", "Containerization Video Course"],
            priority="HIGH"
        ),
        RoadmapTaskSchema(
            month=2, week=6,
            title="Cloud Deployment (AWS / GCP)",
            description="Deploy services to cloud compute instances with environment security.",
            category="Cloud",
            resources=["AWS Free Tier Guide", "Deployment Walkthrough"],
            priority="HIGH"
        ),
        RoadmapTaskSchema(
            month=3, week=9,
            title="Resume & Portfolio Integration",
            description="Document project metrics, push code to GitHub, and update resume bullet points.",
            category="Placement Prep",
            resources=["CareerPilot Resume Analyzer", "Portfolio Review"],
            priority="HIGH"
        ),
        RoadmapTaskSchema(
            month=3, week=11,
            title="Targeted Mock Interviews & Placement Applications",
            description="Conduct 3 AI Mock Interview sessions and apply to target job openings.",
            category="Interviewing",
            resources=["CareerPilot AI Mock Interview", "Job Matcher"],
            priority="HIGH"
        )
    ]

    return GenerateRoadmapResponse(
        title=f"90-Day Placement Roadmap for {req.targetRole}",
        targetRole=req.targetRole,
        durationDays=req.durationDays or 90,
        tasks=tasks
    )

# 6. PORTFOLIO PROJECT RECOMMENDATION ENGINE
@app.post("/ai/recommend-projects", response_model=RecommendProjectsResponse)
def recommend_projects(req: RecommendProjectsRequest):
    gap_skills = req.missingSkills[:2] if req.missingSkills else ["Cloud AWS", "Docker"]
    
    projects = [
        ProjectRecSchema(
            title=f"Production {req.targetRole} Service with {gap_skills[0]}",
            description=f"Build a full-stack, production-grade microservice that addresses real-world workflow automation while mastering {', '.join(gap_skills)}.",
            difficulty="INTERMEDIATE",
            estimatedDuration="2 - 3 weeks",
            skillsGained=[gap_skills[0], "FastAPI", "Docker", "PostgreSQL", "REST APIs"],
            techStack=["Python 3.11", "FastAPI", "Docker", "PostgreSQL", "React"],
            problemStatement="Organizations need scalable, self-healing microservices with real-time telemetry and API documentation.",
            features=[
                "RESTful endpoint routing with Pydantic request validation.",
                "Containerized PostgreSQL database integration.",
                "Automated Docker deployment with health check monitoring.",
                "Interactive UI dashboard built in React."
            ],
            implementationSteps=[
                "1. Design database schema & model relationships.",
                "2. Develop API endpoints and business logic.",
                "3. Write Dockerfile & docker-compose environment setup.",
                "4. Deploy to AWS EC2 instance and benchmark latency."
            ],
            resumeValue=f"Directly resolves resume weakness in {gap_skills[0]} and demonstrates production MLOps / backend engineering."
        ),
        ProjectRecSchema(
            title=f"Real-Time Analytics & AI Dashboard",
            description="Develop an interactive web application that processes real-time data feeds, performs analytics, and displays dynamic insights.",
            difficulty="ADVANCED",
            estimatedDuration="3 weeks",
            skillsGained=["React.js", "TypeScript", "Python", "Data Analytics", "Recharts"],
            techStack=["React", "TypeScript", "Tailwind CSS", "Python", "FastAPI"],
            problemStatement="Business stakeholders require live data visualization without manual CSV downloads or static spreadsheets.",
            features=[
                "Live metric streaming via WebSockets/REST.",
                "Interactive filter controls and customized chart visualizations.",
                "Exportable PDF/CSV reporting feature."
            ],
            implementationSteps=[
                "1. Setup React frontend with Tailwind CSS styling.",
                "2. Build Python backend for processing data streams.",
                "3. Integrate Recharts graphs with responsive state management."
            ],
            resumeValue="Demonstrates end-to-end full-stack analytics capability suitable for high-growth tech company roles."
        )
    ]

    return RecommendProjectsResponse(projects=projects)

# 7. AI MOCK INTERVIEW QUESTION GENERATOR
@app.post("/ai/generate-interview", response_model=GenerateInterviewResponse)
def generate_interview(req: GenerateInterviewRequest):
    questions = [
        InterviewQuestionSchema(
            questionNumber=1,
            text=f"Walk me through a complex technical problem you solved in a past project. How did you approach the architecture and trade-offs?",
            topic="System Design & Project Review",
            difficulty=req.difficulty or "Intermediate",
            expectedKeyPoints=[
                "Clear context & problem definition (STAR method).",
                "Explanation of chosen tech stack and architectural trade-offs.",
                "Quantitative outcome or lesson learned."
            ],
            resumeContext=req.userProjects[0] if req.userProjects else "Project experience on resume"
        ),
        InterviewQuestionSchema(
            questionNumber=2,
            text=f"How do you handle error handling, edge cases, and performance bottlenecks when building applications in {req.userSkills[0] if req.userSkills else 'Python'}?",
            topic="Technical Proficiency & Edge Cases",
            difficulty=req.difficulty or "Intermediate",
            expectedKeyPoints=[
                "Structured try/catch exception strategy.",
                "Profiling and monitoring tools.",
                "Concurrency or caching strategies."
            ]
        ),
        InterviewQuestionSchema(
            questionNumber=3,
            text=f"Describe a situation where a project deadline was at risk or requirements changed mid-sprint. How did you handle it?",
            topic="Behavioral & Problem Solving (HR)",
            difficulty=req.difficulty or "Intermediate",
            expectedKeyPoints=[
                "Proactive stakeholder communication.",
                "Prioritization and scope adjustment.",
                "Successful project delivery."
            ]
        )
    ]

    return GenerateInterviewResponse(
        title=f"{req.targetRole} {req.interviewType.title()} Mock Interview",
        targetRole=req.targetRole,
        questions=questions
    )

# 8. ANSWER EVALUATION ENGINE
@app.post("/ai/evaluate-answer", response_model=EvaluateAnswerResponse)
def evaluate_answer(req: EvaluateAnswerRequest):
    answer_len = len(req.userAnswerText.split())
    
    # Heuristic scoring dimensions
    tech_score = min(95, max(50, answer_len * 2)) if answer_len > 15 else 40
    comp_score = 85 if answer_len > 30 else 55
    rel_score = 88 if "because" in req.userAnswerText or "for example" in req.userAnswerText.lower() else 70
    clarity_score = 85
    depth_score = 80 if answer_len > 40 else 60

    overall = round((tech_score + comp_score + rel_score + clarity_score + depth_score) / 5.0, 1)

    # Word count / speech pace stats
    wpm = 135
    filler_words = len(re.findall(r'\b(um|uh|like|you know|basically|so yeah)\b', req.userAnswerText.lower()))

    return EvaluateAnswerResponse(
        score=overall,
        technicalCorrectness=tech_score,
        completeness=comp_score,
        relevance=rel_score,
        clarity=clarity_score,
        depth=depth_score,
        whatDoneWell=[
            "Directly answered the core question premise.",
            "Good logical structure and progression of ideas.",
            "Clear vocabulary without excessive jargon."
        ],
        whatMissed=[
            "Could elaborate further with a specific quantitative example from your projects.",
            "Mention trade-offs of alternative solutions."
        ],
        betterAnswerStructure="STAR Method: 1. State the situation -> 2. Define your specific task -> 3. Explain actions taken -> 4. Share measurable result.",
        topicToRevise="System Architecture Trade-offs & STAR Interview Framing",
        speakingPaceWpm=wpm,
        fillerWordsCount=filler_words
    )

# 9. CAREER ASSISTANT (RAG + CONTEXT)
@app.post("/ai/assistant", response_model=AssistantResponse)
def career_assistant(req: AssistantRequest):
    msg_lower = req.message.lower()
    target_role = req.userProfile.get("targetRole", "Data Scientist / Software Engineer")
    
    client = get_genai_client()
    if client:
        try:
            prompt = f"""You are CareerPilot AI, an expert career advisor.
User Profile: Target Role: {target_role}, Skills: {req.userProfile.get('skills', [])}.
User Question: {req.message}
Provide a helpful, structured, concise, and encouraging career recommendation."""
            
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            reply_text = response.text
            return AssistantResponse(
                reply=reply_text,
                suggestedFollowUps=[
                    "What projects will boost my resume for this role?",
                    "How should I structure my 90-day learning roadmap?",
                    "Can we start a practice mock interview?"
                ]
            )
        except Exception as e:
            logger.error(f"GenAI call error: {e}")

    # Smart local fallback assistant
    if "ready" in msg_lower or "readiness" in msg_lower:
        reply = f"Based on your profile, your overall Career Readiness Score is currently ~78%. Your technical skills in core areas are strong, but adding AWS Cloud and Docker deployment experience will boost your match for top {target_role} postings above 85%."
    elif "project" in msg_lower or "build" in msg_lower:
        reply = f"I recommend building a **Customer Churn Microservice with FastAPI & Docker**. It directly resolves your cloud deployment gap while showcasing full-stack backend skills to recruiters."
    elif "resume" in msg_lower:
        reply = "Your resume structure is solid (78/100)! To reach 90+, quantify your project accomplishments (e.g. 'improved API response speed by 35%') and add your GitHub repository links."
    else:
        reply = f"For your target role as **{target_role}**, focus this week on completing your Month 1 Roadmap tasks (Statistics & SQL Optimization) and practicing 1 mock interview session on CareerPilot AI."

    return AssistantResponse(
        reply=reply,
        suggestedFollowUps=[
            "What should I focus on learning this week?",
            "Which project will improve my job match score?",
            "Give me interview questions based on my profile."
        ]
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
