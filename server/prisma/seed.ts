import { PrismaClient, Role, SkillStatus, PriorityLevel, ProjectDifficulty, ProjectStatus, InterviewType, ApplicationStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting CareerPilot AI Database Seeding...');

  // Clean existing tables
  await prisma.notification.deleteMany();
  await prisma.application.deleteMany();
  await prisma.savedJob.deleteMany();
  await prisma.careerInsight.deleteMany();
  await prisma.interviewEvaluation.deleteMany();
  await prisma.interviewAnswer.deleteMany();
  await prisma.interviewQuestion.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.projectRecommendation.deleteMany();
  await prisma.roadmapTask.deleteMany();
  await prisma.learningRoadmap.deleteMany();
  await prisma.skillGap.deleteMany();
  await prisma.jobMatch.deleteMany();
  await prisma.jobSkill.deleteMany();
  await prisma.job.deleteMany();
  await prisma.resumeSkill.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.careerProfile.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Demo User
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const demoUser = await prisma.user.create({
    data: {
      name: 'Alex Rivera',
      email: 'alex.rivera@careerpilot.ai',
      passwordHash,
      role: Role.USER,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      bio: 'Final year Computer Science & Data Science student at Tech University. Passionate about AI, Machine Learning, and Full-Stack Engineering.',
      location: 'San Francisco, CA',
      education: 'B.S. in Computer Science & Data Science',
      degree: 'Bachelor of Science',
      college: 'University of California, Berkeley',
      gradYear: 2026,
      targetRole: 'Data Scientist / ML Engineer',
      preferredIndustry: 'Artificial Intelligence & Technology',
      experienceLevel: 'Entry Level / Intern',
      preferredJobType: 'Full-time',
      careerGoal: 'Secure a Data Scientist or Machine Learning Engineer role at a leading tech company within 6 months.',
      targetDeadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    },
  });

  console.log(`👤 Created Demo User: ${demoUser.email} (Password: Password123!)`);

  // 2. Create Career Profile
  await prisma.careerProfile.create({
    data: {
      userId: demoUser.id,
      targetRole: 'Data Scientist / ML Engineer',
      targetIndustry: 'Technology & AI',
      targetCompany: 'Meta / Google / OpenAI',
      targetSalary: '$110,000 - $140,000',
      currentLevel: 'Senior College Student',
      bio: demoUser.bio,
      skills: JSON.stringify(['Python', 'SQL', 'Pandas', 'Scikit-learn', 'PyTorch', 'FastAPI', 'React', 'Git', 'REST APIs']),
      preferredLocations: JSON.stringify(['San Francisco, CA', 'New York, NY', 'Remote']),
      summary: 'Data Science candidate with solid Python foundation, ML modeling experience, and full-stack development skills looking for impactful ML engineering roles.',
    },
  });

  // 3. Populate Skills Master List
  const skillsList = [
    { name: 'Python', category: 'Programming', popularity: 95, averageDemand: 98 },
    { name: 'SQL', category: 'Database', popularity: 90, averageDemand: 95 },
    { name: 'Pandas', category: 'Data Analysis', popularity: 88, averageDemand: 90 },
    { name: 'Scikit-learn', category: 'Machine Learning', popularity: 85, averageDemand: 88 },
    { name: 'PyTorch', category: 'Deep Learning', popularity: 82, averageDemand: 85 },
    { name: 'Statistics & Probability', category: 'Mathematics', popularity: 80, averageDemand: 92 },
    { name: 'AWS Cloud Services', category: 'Cloud & DevOps', popularity: 85, averageDemand: 90 },
    { name: 'Docker & Containerization', category: 'DevOps', popularity: 80, averageDemand: 85 },
    { name: 'FastAPI', category: 'Backend Frameworks', popularity: 75, averageDemand: 80 },
    { name: 'Power BI / Tableau', category: 'Data Visualization', popularity: 78, averageDemand: 82 },
    { name: 'Git & GitHub Workflow', category: 'Tools', popularity: 92, averageDemand: 95 },
    { name: 'React.js', category: 'Frontend', popularity: 90, averageDemand: 90 },
    { name: 'PostgreSQL', category: 'Database', popularity: 85, averageDemand: 88 },
  ];

  for (const s of skillsList) {
    await prisma.skill.create({ data: s });
  }

  // 4. Create Parsed Resume
  const demoResume = await prisma.resume.create({
    data: {
      userId: demoUser.id,
      fileName: 'Alex_Rivera_Resume_2026.pdf',
      fileUrl: '/uploads/resumes/Alex_Rivera_Resume.pdf',
      fileType: 'pdf',
      rawText: `Alex Rivera | alex.rivera@berkeley.edu | linkedin.com/in/alexrivera-dev | github.com/alexrivera
EDUCATION: University of California, Berkeley — B.S. in Computer Science & Data Science (GPA: 3.8/4.0), Grad: May 2026.
SKILLS: Python, SQL, Pandas, NumPy, Scikit-learn, PyTorch, FastAPI, React, Node.js, Git, PostgreSQL, REST APIs.
PROJECTS:
1. Smart Job Recommendation Engine: Built ML recommendation pipeline in Python & Scikit-learn using TF-IDF text embeddings. Achieved 84% user match accuracy.
2. E-Commerce Predictive Analytics Dashboard: Analyzed 50,000+ transaction records using Pandas, SQL & React charts to forecast customer churn.
EXPERIENCE: Data Science Intern at InnovateTech (Summer 2025): Developed automated ETL data pipelines in SQL & Python, reducing data prep latency by 35%.`,
      overallScore: 78,
      skillsScore: 84,
      projectsScore: 75,
      experienceScore: 68,
      educationScore: 92,
      structureScore: 80,
      relevanceScore: 82,
      strengths: JSON.stringify([
        'Strong foundational knowledge in Python, SQL, and core Data Science libraries (Pandas, Scikit-learn).',
        'Demonstrated practical project work involving machine learning recommendation algorithms.',
        'High academic background from top university with strong GPA (3.8/4.0).',
        'Clear layout and structured bullet points highlighting technical skill set.'
      ]),
      weaknesses: JSON.stringify([
        'Lacks cloud deployment experience (AWS / GCP / Azure).',
        'Limited statistical analysis and hypothesis testing metrics in projects.',
        'Project bullet points missing quantified business metrics (e.g. revenue impact, efficiency gains).'
      ]),
      recommendations: JSON.stringify([
        'Add cloud deployment (Docker + AWS EC2/S3) to your churn prediction project.',
        'Incorporate A/B testing and inferential statistics into your machine learning bullet points.',
        'Quantify achievements in internship experience with specific efficiency percentage improvements.'
      ]),
      extractedData: JSON.stringify({
        name: 'Alex Rivera',
        email: 'alex.rivera@berkeley.edu',
        education: 'University of California, Berkeley',
        skills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Scikit-learn', 'PyTorch', 'FastAPI', 'React', 'Node.js', 'Git', 'PostgreSQL'],
        projects: ['Smart Job Recommendation Engine', 'E-Commerce Predictive Analytics Dashboard'],
        experience: ['Data Science Intern at InnovateTech']
      }),
    },
  });

  // Populate Resume Skills
  const parsedResumeSkills = [
    { skillName: 'Python', level: 'EXPERT', category: 'Programming', yearsExperience: 3.0 },
    { skillName: 'SQL', level: 'ADVANCED', category: 'Database', yearsExperience: 2.5 },
    { skillName: 'Pandas', level: 'ADVANCED', category: 'Data Science', yearsExperience: 2.0 },
    { skillName: 'Scikit-learn', level: 'INTERMEDIATE', category: 'Machine Learning', yearsExperience: 1.5 },
    { skillName: 'PyTorch', level: 'INTERMEDIATE', category: 'Deep Learning', yearsExperience: 1.0 },
    { skillName: 'FastAPI', level: 'INTERMEDIATE', category: 'Backend', yearsExperience: 1.0 },
    { skillName: 'Git', level: 'ADVANCED', category: 'Tools', yearsExperience: 3.0 },
  ];

  for (const rs of parsedResumeSkills) {
    await prisma.resumeSkill.create({
      data: {
        resumeId: demoResume.id,
        ...rs,
      },
    });
  }

  // 5. Create Target Jobs
  const jobMeta = await prisma.job.create({
    data: {
      title: 'Data Scientist Intern / New Grad',
      company: 'Meta',
      location: 'Menlo Park, CA (Hybrid)',
      type: 'Full-time',
      remote: false,
      description: 'Join Meta Data Science team to analyze user behavioral data, build machine learning models, and drive product decisions across Instagram and WhatsApp.',
      requirements: JSON.stringify(['B.S. or M.S. in Data Science, CS, or quantitative field.', 'Strong proficiency in Python & SQL.', 'Experience with Pandas, Scikit-learn, and statistical hypothesis testing.', 'Familiarity with Cloud platforms (AWS) and Docker.']),
      requiredSkills: JSON.stringify(['Python', 'SQL', 'Pandas', 'Scikit-learn', 'Statistics & Probability', 'AWS Cloud Services']),
      preferredSkills: JSON.stringify(['PyTorch', 'Docker & Containerization', 'Presto / Spark']),
      minSalary: 115000,
      maxSalary: 135000,
      category: 'Data Science',
      experienceLevel: 'Entry Level',
    },
  });

  const jobGoogle = await prisma.job.create({
    data: {
      title: 'Machine Learning Engineer - Early Career',
      company: 'Google',
      location: 'Mountain View, CA',
      type: 'Full-time',
      remote: false,
      description: 'Design, implement, and deploy scalable ML architectures and neural network pipelines powering Google Cloud and AI products.',
      requirements: JSON.stringify(['Degree in Computer Science or AI.', 'Advanced Python & C++ skills.', 'Hands-on experience with PyTorch or TensorFlow.', 'MLOps, model serving, Docker, and AWS/GCP cloud platforms.']),
      requiredSkills: JSON.stringify(['Python', 'PyTorch', 'Docker & Containerization', 'AWS Cloud Services', 'Git & GitHub Workflow']),
      preferredSkills: JSON.stringify(['C++', 'Kubernetes', 'MLOps']),
      minSalary: 130000,
      maxSalary: 160000,
      category: 'Machine Learning',
      experienceLevel: 'Entry Level',
    },
  });

  const jobStripe = await prisma.job.create({
    data: {
      title: 'Full Stack Engineer - Financial Systems',
      company: 'Stripe',
      location: 'San Francisco, CA (Remote)',
      type: 'Full-time',
      remote: true,
      description: 'Build mission-critical payment infrastructure, RESTful microservices, and interactive web tools for millions of global businesses.',
      requirements: JSON.stringify(['Proficiency in TypeScript, React, and Node.js.', 'Relational database design (PostgreSQL / SQL).', 'RESTful API architecture and modern Git workflows.']),
      requiredSkills: JSON.stringify(['React.js', 'TypeScript', 'Node.js', 'SQL', 'PostgreSQL', 'Git & GitHub Workflow']),
      preferredSkills: JSON.stringify(['Docker', 'GraphQL']),
      minSalary: 125000,
      maxSalary: 155000,
      category: 'Software Engineering',
      experienceLevel: 'Entry Level',
    },
  });

  const jobMicrosoft = await prisma.job.create({
    data: {
      title: 'Data Analyst - Business Intelligence',
      company: 'Microsoft',
      location: 'Redmond, WA',
      type: 'Full-time',
      remote: true,
      description: 'Transform complex business datasets into insightful visualizations, executive dashboards, and statistical forecasting models.',
      requirements: JSON.stringify(['Expert SQL querying and data modeling.', 'Experience with Power BI or Tableau visualization tools.', 'Python data analysis (Pandas/NumPy) and statistical methods.']),
      requiredSkills: JSON.stringify(['SQL', 'Power BI / Tableau', 'Python', 'Pandas', 'Statistics & Probability']),
      preferredSkills: JSON.stringify(['Excel', 'Azure Data Lake']),
      minSalary: 95000,
      maxSalary: 120000,
      category: 'Data Analytics',
      experienceLevel: 'Entry Level',
    },
  });

  // 6. Create Job Matches
  await prisma.jobMatch.create({
    data: {
      userId: demoUser.id,
      jobId: jobMeta.id,
      matchScore: 82.5,
      breakdown: JSON.stringify({
        skillsMatch: 85,
        experienceMatch: 75,
        educationMatch: 95,
        overallRelevance: 82.5
      }),
      whyMatch: JSON.stringify([
        'Matches 4 out of 5 core required technical skills (Python, SQL, Pandas, Scikit-learn).',
        'Strong academic computer science background aligning with Meta New Grad standard.',
        'Relevant project experience in machine learning recommendation models.'
      ]),
      whyNotMatch: JSON.stringify([
        'Missing required Cloud proficiency (AWS Cloud Services).',
        'Statistical analysis & probability background needs strengthening.'
      ]),
      recommendation: 'High match probability! Complete AWS cloud fundamentals module and complete a statistics project to boost score above 90%.',
      matchedSkills: JSON.stringify(['Python', 'SQL', 'Pandas', 'Scikit-learn', 'Git & GitHub Workflow']),
      missingSkills: JSON.stringify(['AWS Cloud Services']),
      developingSkills: JSON.stringify(['Statistics & Probability', 'Docker & Containerization']),
    },
  });

  await prisma.jobMatch.create({
    data: {
      userId: demoUser.id,
      jobId: jobGoogle.id,
      matchScore: 68.0,
      breakdown: JSON.stringify({
        skillsMatch: 65,
        experienceMatch: 60,
        educationMatch: 90,
        overallRelevance: 68.0
      }),
      whyMatch: JSON.stringify([
        'Solid foundation in Python, PyTorch, and Git version control.',
        'High academic baseline for early career engineering.'
      ]),
      whyNotMatch: JSON.stringify([
        'Missing production MLOps and Docker containerization experience.',
        'Requires cloud deployment (AWS/GCP) not present on resume.'
      ]),
      recommendation: 'Target role requires MLOps & cloud deployment experience. Focus on Month 3 of your roadmap before submitting application.',
      matchedSkills: JSON.stringify(['Python', 'PyTorch', 'Git & GitHub Workflow']),
      missingSkills: JSON.stringify(['AWS Cloud Services', 'Docker & Containerization']),
      developingSkills: JSON.stringify(['MLOps']),
    },
  });

  // 7. Skill Gap Matrix
  const skillGaps = [
    {
      skillName: 'Statistics & Probability',
      status: SkillStatus.WEAK,
      userProficiency: 45,
      requiredProficiency: 85,
      priorityRank: 1,
      reason: 'Required by 8/10 target Data Science roles. Critical foundation for ML model validation, hypothesis testing, and interview prep.',
      category: 'Mathematics & Data',
    },
    {
      skillName: 'AWS Cloud Services',
      status: SkillStatus.MISSING,
      userProficiency: 15,
      requiredProficiency: 80,
      priorityRank: 2,
      reason: 'Key requirement for Meta & Google target postings. Essential for deploying models to production cloud infrastructure.',
      category: 'Cloud Infrastructure',
    },
    {
      skillName: 'Docker & Containerization',
      status: SkillStatus.DEVELOPING,
      userProficiency: 50,
      requiredProficiency: 75,
      priorityRank: 3,
      reason: 'Required for containerizing ML microservices and seamless deployment pipelines.',
      category: 'DevOps & MLOps',
    },
    {
      skillName: 'Power BI / Tableau',
      status: SkillStatus.DEVELOPING,
      userProficiency: 55,
      requiredProficiency: 70,
      priorityRank: 4,
      reason: 'Valuable secondary skill for communicating ML model outputs visually to stakeholders.',
      category: 'Analytics',
    },
    {
      skillName: 'Python',
      status: SkillStatus.STRONG,
      userProficiency: 90,
      requiredProficiency: 85,
      priorityRank: 5,
      reason: 'Core strength. Fully aligns with senior entry-level job expectations.',
      category: 'Programming',
    },
    {
      skillName: 'SQL',
      status: SkillStatus.STRONG,
      userProficiency: 85,
      requiredProficiency: 80,
      priorityRank: 6,
      reason: 'Strong querying and data manipulation foundation.',
      category: 'Database',
    },
  ];

  for (const sg of skillGaps) {
    await prisma.skillGap.create({
      data: {
        userId: demoUser.id,
        ...sg,
      },
    });
  }

  // 8. 90-Day Learning Roadmap
  const roadmap = await prisma.learningRoadmap.create({
    data: {
      userId: demoUser.id,
      title: '90-Day Data Science & ML Placement Mastery',
      durationDays: 90,
      targetRole: 'Data Scientist / ML Engineer',
      currentMonth: 1,
      progress: 42.5,
      status: 'ACTIVE',
    },
  });

  const roadmapTasks = [
    {
      roadmapId: roadmap.id,
      month: 1,
      week: 1,
      title: 'Master Inferential Statistics & Hypothesis Testing',
      description: 'Study z-scores, p-values, t-tests, ANOVA, and A/B testing principles using SciPy and Python.',
      category: 'Mathematics & Stats',
      resources: JSON.stringify(['Khan Academy Statistics', 'SciPy Stats Documentation', 'A/B Testing Crash Course']),
      isCompleted: true,
      priority: PriorityLevel.HIGH,
    },
    {
      roadmapId: roadmap.id,
      month: 1,
      week: 2,
      title: 'Advanced SQL Window Functions & Query Optimization',
      description: 'Practice PARTITION BY, LEAD/LAG, DENSE_RANK, CTEs, and query indexing on real e-commerce data.',
      category: 'Database & SQL',
      resources: JSON.stringify(['LeetCode SQL Study Plan', 'PostgreSQL Query Optimization Guide']),
      isCompleted: true,
      priority: PriorityLevel.HIGH,
    },
    {
      roadmapId: roadmap.id,
      month: 1,
      week: 3,
      title: 'Scikit-learn Feature Engineering & Model Evaluation',
      description: 'Implement Cross-Validation, GridSearch hyperparameter tuning, ROC-AUC curves, and Confusion Matrices.',
      category: 'Machine Learning',
      resources: JSON.stringify(['Scikit-learn Official Docs', 'Kaggle Feature Engineering Course']),
      isCompleted: true,
      priority: PriorityLevel.HIGH,
    },
    {
      roadmapId: roadmap.id,
      month: 1,
      week: 4,
      title: 'Statistical Modeling Mini-Project',
      description: 'Build a Jupyter Notebook analyzing customer churn probability with statistical confidence intervals.',
      category: 'Portfolio Project',
      resources: JSON.stringify(['GitHub Template', 'Telco Churn Dataset']),
      isCompleted: false,
      priority: PriorityLevel.HIGH,
    },
    {
      roadmapId: roadmap.id,
      month: 2,
      week: 5,
      title: 'FastAPI Microservice Development for ML Models',
      description: 'Wrap your trained Scikit-learn model inside a FastAPI REST endpoint with Pydantic request validation.',
      category: 'Backend & ML',
      resources: JSON.stringify(['FastAPI Official Guide', 'Deploying ML Models with FastAPI']),
      isCompleted: false,
      priority: PriorityLevel.MEDIUM,
    },
    {
      roadmapId: roadmap.id,
      month: 2,
      week: 6,
      title: 'Docker Containerization for ML Applications',
      description: 'Write Dockerfiles, build lightweight Python images, configure docker-compose for PostgreSQL + FastAPI.',
      category: 'DevOps & Containers',
      resources: JSON.stringify(['Docker for Beginners', 'Containerizing FastAPI Apps']),
      isCompleted: false,
      priority: PriorityLevel.HIGH,
    },
    {
      roadmapId: roadmap.id,
      month: 3,
      week: 9,
      title: 'AWS Deployment (EC2, S3, RDS)',
      description: 'Deploy containerized ML prediction service to AWS EC2 instance connected to AWS RDS PostgreSQL.',
      category: 'Cloud Infrastructure',
      resources: JSON.stringify(['AWS Free Tier Guide', 'Deploying Docker on EC2']),
      isCompleted: false,
      priority: PriorityLevel.HIGH,
    },
  ];

  for (const rt of roadmapTasks) {
    await prisma.roadmapTask.create({ data: rt });
  }

  // 9. Portfolio Project Recommendations
  const project1 = await prisma.projectRecommendation.create({
    data: {
      userId: demoUser.id,
      title: 'Customer Churn Prediction API & MLOps Pipeline',
      description: 'An end-to-end Machine Learning pipeline that predicts customer churn probability, exposes a FastAPI web service, and is containerized using Docker and deployed on AWS.',
      difficulty: ProjectDifficulty.INTERMEDIATE,
      estimatedDuration: '2 - 3 weeks',
      skillsGained: JSON.stringify(['Python', 'Scikit-learn', 'FastAPI', 'Docker', 'AWS EC2', 'PostgreSQL', 'Statistics']),
      techStack: JSON.stringify(['Python 3.11', 'Scikit-learn', 'FastAPI', 'Docker', 'AWS', 'PostgreSQL']),
      problemStatement: 'Businesses lose 20%+ revenue due to undetected customer churn. Existing static reports fail to provide real-time risk scores.',
      features: JSON.stringify([
        'ML classification model (XGBoost / Random Forest) trained on customer telemetry data.',
        'FastAPI microservice with Pydantic input schemas and automated swagger docs.',
        'Dockerized setup with PostgreSQL database integration.',
        'Comprehensive model evaluation dashboard showing Precision, Recall, and ROC-AUC metrics.'
      ]),
      implementationSteps: JSON.stringify([
        'Step 1: Perform EDA and feature engineering in Jupyter Notebook using Pandas & SciPy.',
        'Step 2: Train Random Forest classifier and serialize model artifact using Joblib.',
        'Step 3: Build FastAPI endpoint /predict receiving customer payload.',
        'Step 4: Create Dockerfile and deploy to AWS EC2 instance.'
      ]),
      resumeValue: 'Fills critical AWS Cloud and Docker gaps on your resume while demonstrating end-to-end MLOps pipeline engineering to hiring managers.',
      status: ProjectStatus.IN_PROGRESS,
    },
  });

  const project2 = await prisma.projectRecommendation.create({
    data: {
      userId: demoUser.id,
      title: 'Real-Time AI Resume Matcher & LLM RAG System',
      description: 'Build an AI application that uses TF-IDF, vector embeddings, and LLM orchestration to automatically parse candidate resumes against job descriptions.',
      difficulty: ProjectDifficulty.ADVANCED,
      estimatedDuration: '3 weeks',
      skillsGained: JSON.stringify(['Python', 'LangChain', 'Vector DB', 'React.js', 'FastAPI', 'NLP Embeddings']),
      techStack: JSON.stringify(['Python', 'FastAPI', 'React', 'TypeScript', 'Tailwind CSS', 'ChromaDB']),
      problemStatement: 'Recruiters spend 80% of time manually reviewing resumes. Automated semantic scoring streamlines candidate placement.',
      features: JSON.stringify([
        'PDF/DOCX document text extractor.',
        'Vector similarity search evaluating resume bullet relevance against JD responsibilities.',
        'Interactive React frontend dashboard visualizing match score breakdown.'
      ]),
      implementationSteps: JSON.stringify([
        'Step 1: Implement PDF text extraction using PyPDF/pdfplumber.',
        'Step 2: Generate TF-IDF and cosine similarity embeddings matrix.',
        'Step 3: Build React frontend with drag-and-drop resume uploader.'
      ]),
      resumeValue: 'Demonstrates cutting-edge Generative AI and NLP capabilities directly aligned with modern AI engineering job descriptions.',
      status: ProjectStatus.NOT_STARTED,
    },
  });

  // 10. Create Past AI Mock Interview Session
  const mockInterview = await prisma.interview.create({
    data: {
      userId: demoUser.id,
      title: 'Data Science & Machine Learning Technical Interview',
      targetRole: 'Data Scientist',
      difficulty: 'Intermediate',
      type: InterviewType.TECHNICAL,
      overallScore: 76.5,
      totalQuestions: 3,
      status: 'COMPLETED',
    },
  });

  const q1 = await prisma.interviewQuestion.create({
    data: {
      interviewId: mockInterview.id,
      questionNumber: 1,
      text: 'Explain the difference between Overfitting and Underfitting in Machine Learning, and how would you detect and prevent overfitting in a model?',
      topic: 'Machine Learning Core Fundamentals',
      difficulty: 'Intermediate',
      expectedKeyPoints: JSON.stringify([
        'Overfitting: High variance, low bias (performs great on training data, poor on unseen test data).',
        'Underfitting: High bias, low variance (fails to capture underlying data patterns).',
        'Detection: Split data into Train/Validation/Test sets, monitor learning curves.',
        'Prevention: Regularization (L1/L2), Cross-validation, Early stopping, Dropout, Reducing model complexity.'
      ]),
      resumeContext: 'Relates to your Smart Job Recommendation project where model validation was performed.',
    },
  });

  const a1 = await prisma.interviewAnswer.create({
    data: {
      questionId: q1.id,
      userTextAnswer: 'Overfitting happens when a machine learning model learns the training data too well, including noisy data and outliers, leading to high training accuracy but poor generalization on validation data. Underfitting is when the model is too simple to learn the pattern. To prevent overfitting, I use K-Fold cross validation, L1 or L2 regularization, feature selection to reduce dimensionality, and getting more training data.',
      durationSeconds: 65,
      fillerWordsCount: 3,
      paceWpm: 135,
    },
  });

  await prisma.interviewEvaluation.create({
    data: {
      questionId: q1.id,
      score: 84.0,
      technicalCorrectness: 88,
      completeness: 82,
      relevance: 90,
      clarity: 85,
      depth: 78,
      whatDoneWell: JSON.stringify([
        'Accurately defined both overfitting and underfitting in terms of generalization.',
        'Mentioned practical prevention methods like K-Fold cross validation and L1/L2 regularization.',
        'Maintained a confident speaking pace (135 WPM) with minimal filler words.'
      ]),
      whatMissed: JSON.stringify([
        'Did not explicitly mention bias-variance trade-off terminology.',
        'Could have given a concrete example of how regularization penalizes large weights.'
      ]),
      betterAnswerStructure: 'Start with the Bias-Variance definition -> Explain Overfitting vs Underfitting symptom on learning curves -> List 4 concrete mitigation techniques (Cross-Val, Regularization, Early Stopping, Data Augmentation).',
      topicToRevise: 'Bias-Variance Trade-off & Regularization Mathematics',
    },
  });

  // 11. Create Career Insights
  const insights = [
    {
      title: 'SQL Assessment Improvement',
      description: 'Your SQL query evaluation score improved by 27% (from 58% to 85%) following your Week 2 database optimization practice.',
      category: 'Skill Growth',
      impactLevel: 'HIGH',
      metricData: JSON.stringify({ skill: 'SQL', oldScore: 58, newScore: 85, increasePercent: 27 }),
    },
    {
      title: 'Highest-Impact Skill Gap Identified',
      description: 'Statistics & Probability is currently required by 80% of your saved job postings but scores 45% on your profile. Prioritize this area to unlock Meta Data Scientist role match.',
      category: 'Skill Gap Warning',
      impactLevel: 'HIGH',
      metricData: JSON.stringify({ skill: 'Statistics & Probability', targetJobsCoverage: 80, currentProficiency: 45 }),
    },
    {
      title: 'Resume Quantification Opportunity',
      description: 'Your resume score is 78/100. Adding measurable outcomes (e.g. "reduced latency by 35%") to your project bullet points could increase your score to 88+.',
      category: 'Resume Optimization',
      impactLevel: 'MEDIUM',
      metricData: JSON.stringify({ currentScore: 78, potentialScore: 88 }),
    },
  ];

  for (const ins of insights) {
    await prisma.careerInsight.create({
      data: {
        userId: demoUser.id,
        ...ins,
      },
    });
  }

  // 12. Create Applications & Saved Jobs
  await prisma.savedJob.create({
    data: {
      userId: demoUser.id,
      jobId: jobMeta.id,
    },
  });

  await prisma.savedJob.create({
    data: {
      userId: demoUser.id,
      jobId: jobGoogle.id,
    },
  });

  await prisma.application.create({
    data: {
      userId: demoUser.id,
      jobId: jobMeta.id,
      status: ApplicationStatus.INTERVIEW,
      appliedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      notes: 'Passed Initial Screening call on Aug 12. Technical Round 1 scheduled for next week.',
      statusHistory: JSON.stringify([
        { status: 'SAVED', date: '2026-08-01' },
        { status: 'APPLIED', date: '2026-08-05' },
        { status: 'INTERVIEW', date: '2026-08-12' }
      ]),
    },
  });

  await prisma.application.create({
    data: {
      userId: demoUser.id,
      jobId: jobStripe.id,
      status: ApplicationStatus.APPLIED,
      appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      notes: 'Applied via company portal with tailored resume.',
      statusHistory: JSON.stringify([
        { status: 'SAVED', date: '2026-08-10' },
        { status: 'APPLIED', date: '2026-08-19' }
      ]),
    },
  });

  // 13. Create Notifications
  await prisma.notification.create({
    data: {
      userId: demoUser.id,
      title: 'Interview Scheduled with Meta',
      message: 'Your Technical Interview for Data Scientist Intern at Meta is coming up. Practice mock interview questions today!',
      type: 'INTERVIEW',
      link: '/interview/new',
    },
  });

  await prisma.notification.create({
    data: {
      userId: demoUser.id,
      title: 'Roadmap Milestone Complete',
      message: 'Congratulations! You completed Month 1 Week 2 task: Advanced SQL Window Functions & Query Optimization.',
      type: 'ROADMAP',
      link: '/roadmap',
    },
  });

  console.log('✅ CareerPilot AI Database Seeding Complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
