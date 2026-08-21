import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SolveFlow AI Database...');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.aIInsight.deleteMany();
  await prisma.productivityMetric.deleteMany();
  await prisma.dailyReview.deleteMany();
  await prisma.knowledgeBaseEntry.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.workSession.deleteMany();
  await prisma.task.deleteMany();
  await prisma.category.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const user = await prisma.user.create({
    data: {
      name: 'Alex Rivera',
      email: 'student@example.com',
      passwordHash: hashedPassword,
      role: 'USER',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      bio: 'AI & Data Science Student | Full-Stack Developer | Building SolveFlow AI',
      focusHoursGoal: 6.5,
    },
  });

  console.log(`👤 Created Demo User: ${user.email}`);

  // Create Projects
  const projectMl = await prisma.project.create({
    data: {
      userId: user.id,
      name: 'Machine Learning Coursework',
      description: 'CS480 Deep Learning & Model Architecture Assignments',
      color: '#8b5cf6', // purple
    },
  });

  const projectSolveflow = await prisma.project.create({
    data: {
      userId: user.id,
      name: 'SolveFlow AI Web App',
      description: 'Full-stack SaaS application for portfolio & placement interviews',
      color: '#3b82f6', // blue
    },
  });

  const projectCareer = await prisma.project.create({
    data: {
      userId: user.id,
      name: 'Internships & Career',
      description: 'Resume updates, applications, and system design prep',
      color: '#10b981', // green
    },
  });

  // Create Categories
  const catTech = await prisma.category.create({
    data: { userId: user.id, name: 'Technical & Code', color: '#3b82f6' },
  });
  const catDocs = await prisma.category.create({
    data: { userId: user.id, name: 'Documentation', color: '#f59e0b' },
  });
  const catResearch = await prisma.category.create({
    data: { userId: user.id, name: 'AI & Research', color: '#ec4899' },
  });
  const catCareer = await prisma.category.create({
    data: { userId: user.id, name: 'Career Prep', color: '#10b981' },
  });

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Tasks
  const task1 = await prisma.task.create({
    data: {
      userId: user.id,
      projectId: projectMl.id,
      categoryId: catResearch.id,
      title: 'Train ResNet-50 Model on Custom Dataset',
      description: 'Execute fine-tuning on PyTorch framework and calculate validation accuracy, precision, and recall.',
      categoryName: 'AI & Research',
      projectName: 'Machine Learning Coursework',
      priority: 'CRITICAL',
      status: 'IN_PROGRESS',
      deadline: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000), // tomorrow
      estimatedDuration: 120,
      actualDuration: 90,
      tags: ['PyTorch', 'Computer Vision', 'Deep Learning'],
      notes: 'Need to monitor GPU memory usage during batch processing.',
      aiPriorityScore: 94,
      aiRecommendation: 'Complete your Machine Learning model training first because the assignment deadline is tomorrow and loss optimization has high dependency on remaining evaluation steps.',
      importanceScore: 5,
      difficultyScore: 4,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      userId: user.id,
      projectId: projectSolveflow.id,
      categoryId: catTech.id,
      title: 'Build AI Task Priority Engine REST API',
      description: 'Implement weighted prioritization algorithm considering deadline, difficulty, and workload.',
      categoryName: 'Technical & Code',
      projectName: 'SolveFlow AI Web App',
      priority: 'HIGH',
      status: 'COMPLETED',
      deadline: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
      estimatedDuration: 90,
      actualDuration: 75,
      tags: ['TypeScript', 'Express', 'Algorithm'],
      notes: 'API tested against edge cases with empty workload.',
      aiPriorityScore: 88,
      aiRecommendation: 'Task completed efficiently within estimated time budget.',
      importanceScore: 5,
      difficultyScore: 3,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      userId: user.id,
      projectId: projectSolveflow.id,
      categoryId: catTech.id,
      title: 'Integrate Root Cause Analysis Diagram Component',
      description: 'Build responsive visual step-by-step diagram showing Problem -> Cause -> Evidence -> Solution -> Result -> Prevention.',
      categoryName: 'Technical & Code',
      projectName: 'SolveFlow AI Web App',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      deadline: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
      estimatedDuration: 100,
      actualDuration: 45,
      tags: ['React', 'Tailwind', 'UI/UX'],
      notes: 'Use glassmorphic container cards with hover step indicators.',
      aiPriorityScore: 86,
      aiRecommendation: 'High visual impact for portfolio presentation.',
      importanceScore: 4,
      difficultyScore: 3,
    },
  });

  const task4 = await prisma.task.create({
    data: {
      userId: user.id,
      projectId: projectCareer.id,
      categoryId: catCareer.id,
      title: 'Submit 5 AI Engineer Internship Applications',
      description: 'Tailor resume bullets for roles at Anthropic, OpenAI, Google, Cohere, and Databricks.',
      categoryName: 'Career Prep',
      projectName: 'Internships & Career',
      priority: 'HIGH',
      status: 'TODO',
      deadline: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
      estimatedDuration: 60,
      actualDuration: 0,
      tags: ['Job Application', 'Resume', 'Networking'],
      notes: 'Focus on high-value AI roles.',
      aiPriorityScore: 78,
      aiRecommendation: 'Schedule early in the day when focus is highest.',
      importanceScore: 4,
      difficultyScore: 2,
    },
  });

  const task5 = await prisma.task.create({
    data: {
      userId: user.id,
      projectId: projectSolveflow.id,
      categoryId: catDocs.id,
      title: 'Write Technical Documentation & OpenAPI Spec',
      description: 'Generate comprehensive README.md and Swagger API endpoints breakdown.',
      categoryName: 'Documentation',
      projectName: 'SolveFlow AI Web App',
      priority: 'MEDIUM',
      status: 'TODO',
      deadline: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000),
      estimatedDuration: 80,
      actualDuration: 0,
      tags: ['Documentation', 'Swagger', 'Markdown'],
      notes: 'Include architecture diagrams and installation commands.',
      aiPriorityScore: 65,
      aiRecommendation: 'Execute after core API endpoints are verified.',
      importanceScore: 3,
      difficultyScore: 2,
    },
  });

  const task6 = await prisma.task.create({
    data: {
      userId: user.id,
      projectId: projectMl.id,
      categoryId: catTech.id,
      title: 'Resolve Python Virtual Environment Dependency Conflicts',
      description: 'Fix NumPy and PyTorch Cuda version mismatches breaking model training execution.',
      categoryName: 'Technical & Code',
      projectName: 'Machine Learning Coursework',
      priority: 'CRITICAL',
      status: 'BLOCKED',
      deadline: new Date(today.getTime()),
      estimatedDuration: 45,
      actualDuration: 60,
      tags: ['Python', 'Pip', 'CUDA', 'Bug'],
      notes: 'Currently getting CUDA driver version incompatibility error.',
      aiPriorityScore: 96,
      aiRecommendation: 'Task is currently BLOCKED. Use AI Problem Solver to perform root cause diagnosis immediately.',
      importanceScore: 5,
      difficultyScore: 4,
    },
  });

  const task7 = await prisma.task.create({
    data: {
      userId: user.id,
      projectId: projectSolveflow.id,
      categoryId: catTech.id,
      title: 'Implement Dark/Light Mode SaaS Theme Switcher',
      description: 'Add persistent theme context with smooth CSS transitions and local storage retention.',
      categoryName: 'Technical & Code',
      projectName: 'SolveFlow AI Web App',
      priority: 'LOW',
      status: 'COMPLETED',
      deadline: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
      estimatedDuration: 30,
      actualDuration: 25,
      tags: ['React', 'CSS', 'Theme'],
      notes: 'Verified across all dashboard cards and modals.',
      aiPriorityScore: 42,
      aiRecommendation: 'Completed quickly with clean code encapsulation.',
      importanceScore: 2,
      difficultyScore: 1,
    },
  });

  // Create Problems
  const problem1 = await prisma.problem.create({
    data: {
      userId: user.id,
      taskId: task6.id,
      title: 'Python PyTorch CUDA Dependency Version Mismatch Error',
      description: 'Attempting to run PyTorch model training outputs: `RuntimeError: CUDA error: no kernel image is available for execution on the device`. Package installed via pip has mismatched CUDA runtime version 11.8 vs installed NVIDIA driver CUDA 12.2.',
      categoryName: 'Technical & Environment',
      severity: 'CRITICAL',
      status: 'INVESTIGATING',
      date: new Date(),
      attempts: 3,
      notes: 'Tried upgrading pip and reinstalling pytorch, still failing.',
      whatHappened: 'PyTorch script crashed on GPU allocation step with CUDA kernel availability failure.',
      whyHappened: 'Default `pip install torch` installed pre-built binary compiled for CUDA 11.8 instead of CUDA 12.2 supported by system GPU drivers.',
      whatTried: 'Reinstalling torch standard build, cleaning pip cache.',
      whatWorked: 'Pending testing official `--index-url https://download.pytorch.org/whl/cu121` build package.',
      whatFailed: 'Standard pip install torch command.',
      whatDifferentNextTime: 'Always specify exact CUDA wheels URL matching installed NVIDIA driver version.',
      aiSummary: 'PyTorch binary CUDA version incompatiblity with system NVIDIA display drivers causing GPU kernel execution crash.',
      aiPossibleCauses: [
        'Incorrect PyTorch wheel channel specified during pip install.',
        'Broken or cached virtual environment with conflicting C++ DLLs.',
        'System CUDA toolkit driver version mismatch with PyTorch runtime target.'
      ],
      aiRecommendedSolutions: [
        'Re-create python venv and install torch with explicit cu121 index URL.',
        'Run model training in CPU fallback mode if driver update is restricted.',
        'Use Docker container matching exact PyTorch CUDA base image.'
      ],
      aiBestSolution: 'Re-create python virtual environment and run `pip install torch --index-url https://download.pytorch.org/whl/cu121` to match system drivers.',
      aiActionPlan: [
        'Deactivate current virtual environment: `deactivate`',
        'Delete broken `.venv` folder.',
        'Create fresh venv: `python -m venv .venv` and activate.',
        'Install explicit CUDA 12.1 PyTorch wheel.',
        'Run test script `torch.cuda.is_available()` to verify clean GPU detection.'
      ],
      aiPrevention: 'Maintain a locked `requirements.txt` with specific wheel URLs and document environment setup steps in workspace README.'
    },
  });

  const problem2 = await prisma.problem.create({
    data: {
      userId: user.id,
      taskId: task2.id,
      title: 'PostgreSQL Database Connection Pool Exhaustion under Stress',
      description: 'Express server stopped responding after 50 concurrent requests due to unclosed Prisma Client instances in async loops.',
      categoryName: 'Database & Backend',
      severity: 'HIGH',
      status: 'RESOLVED',
      date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
      attempts: 2,
      notes: 'Resolved by converting Prisma Client to global singleton instance across server modules.',
      whatHappened: 'Backend server timed out on high batch requests with `PrismaClientInitializationError: Too many connections`.',
      whyHappened: 'Multiple route files initialized `new PrismaClient()` separately causing max connection limit overflow.',
      whatTried: 'Increasing PostgreSQL max connection config.',
      whatWorked: 'Created single exported `prisma` client instance in `server/src/config/prisma.ts`.',
      whatFailed: 'Creating inline Prisma instances in controller request handlers.',
      whatDifferentNextTime: 'Never instantiate database connection clients inside request handlers or loops.',
      aiSummary: 'Connection pool leak caused by multiple uncontrolled PrismaClient instantiations.',
      aiPossibleCauses: ['Multiple PrismaClient instances created per HTTP request.'],
      aiRecommendedSolutions: ['Use singleton pattern for PrismaClient.'],
      aiBestSolution: 'Export singleton `prisma` instance from global configuration module.',
      aiActionPlan: ['Create `prisma.ts` singleton.', 'Replace direct instantiations in all controller files.'],
      aiPrevention: 'Enforce lint rule prohibiting `new PrismaClient()` outside configuration module.'
    },
  });

  // Create Knowledge Base Entry for problem2
  await prisma.knowledgeBaseEntry.create({
    data: {
      userId: user.id,
      problemId: problem2.id,
      title: 'PostgreSQL Prisma Connection Pool Leak Prevention in Express',
      category: 'Database & Backend',
      tags: ['PostgreSQL', 'Prisma', 'Express', 'Performance', 'Node.js'],
      problemSummary: 'Express backend timing out under concurrent traffic due to multiple PrismaClient instantiations exhausting PostgreSQL connection limit.',
      rootCause: 'Instantiating `new PrismaClient()` in individual route handlers opens fresh connection pools until DB server limits are hit.',
      solution: 'Export single global Prisma instance from `config/prisma.ts` attached to global NodeJS object in development mode.',
      prevention: 'Always centralize database ORM clients in a single configuration file and import the instance across models.',
      usageCount: 14,
    },
  });

  // Create Productivity Metrics for past 7 days
  for (let i = 6; i >= 0; i--) {
    const metricDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const total = 7 + (i % 3);
    const completed = 5 + (i % 2);
    const pending = total - completed;
    const focusMinutes = 280 + (i * 15) % 90;
    
    await prisma.productivityMetric.create({
      data: {
        userId: user.id,
        date: metricDate,
        totalTasks: total,
        completedTasks: completed,
        pendingTasks: pending,
        overdueTasks: i === 0 ? 1 : 0,
        problemsEncountered: i === 1 ? 2 : 1,
        problemsSolved: i === 1 ? 1 : 1,
        focusTimeMinutes: focusMinutes,
        productivityPercentage: Math.round((completed / total) * 100 * 10) / 10,
        estVsActualRatio: 1.15 - (i * 0.02),
      },
    });
  }

  // Create AI Insights
  await prisma.aIInsight.createMany({
    data: [
      {
        userId: user.id,
        title: 'Peak Morning Focus Advantage',
        description: 'You complete complex technical & machine learning tasks 34% faster when scheduled between 8:30 AM and 11:30 AM compared to evening hours.',
        category: 'Productivity Pattern',
        impactLevel: 'HIGH',
      },
      {
        userId: user.id,
        title: 'Duration Underestimation Warning',
        description: 'Your primary cause of incomplete daily tasks is underestimating tasks longer than 90 minutes by an average of 25%. Consider breaking large tasks into 45-minute sub-tasks.',
        category: 'Time Estimation',
        impactLevel: 'HIGH',
      },
      {
        userId: user.id,
        title: 'Environment Dependency Blockers',
        description: 'Technical configuration & dependency errors account for 65% of your total task delay time. Pre-flighting virtual environments saves ~2.5 hours weekly.',
        category: 'Problem Frequency',
        impactLevel: 'MEDIUM',
      },
      {
        userId: user.id,
        title: 'Consistent Daily Velocity',
        description: 'Your weekly task completion rate improved by +14% compared to last week, with an average focus duration of 5.5 hours daily.',
        category: 'Weekly Trend',
        impactLevel: 'LOW',
      },
    ],
  });

  // Create Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        title: 'Task Overdue Warning',
        message: 'Task "Resolve Python Virtual Environment Dependency Conflicts" is past due date.',
        type: 'OVERDUE',
        isRead: false,
        link: '/tasks',
      },
      {
        userId: user.id,
        title: 'AI Problem Solver Insight Ready',
        message: 'AI analyzed problem "PyTorch CUDA Dependency Mismatch" with recommended action plan.',
        type: 'RECOMMENDATION',
        isRead: false,
        link: '/problems',
      },
      {
        userId: user.id,
        title: 'Daily Review Reminder',
        message: 'Time to record your daily accomplishments and reflection for today.',
        type: 'REVIEW',
        isRead: true,
        link: '/daily-review',
      },
    ],
  });

  // Create Daily Review
  await prisma.dailyReview.create({
    data: {
      userId: user.id,
      date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
      accomplishments: 'Completed AI Task Priority Engine REST API and integrated SaaS theme switcher.',
      problemsFaced: 'Encountered PostgreSQL connection pool overflow during concurrent API load testing.',
      remainingUnfinished: 'ResNet-50 fine-tuning training model script.',
      distractions: 'Slack notifications during deep work block in the afternoon.',
      wentWell: 'High focus flow state in morning 9-11 AM window.',
      improveTomorrow: 'Set phone to Do Not Disturb during deep coding blocks and pre-test GPU environment.',
      aiSummary: 'Strong productivity output (82% task completion). Successfully resolved connection pool architecture bottleneck.',
    },
  });

  console.log('✨ Seed database execution finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
