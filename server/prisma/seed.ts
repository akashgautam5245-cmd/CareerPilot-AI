import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const studentPassword = await bcrypt.hash('Password123!', 10);
  const adminPassword = await bcrypt.hash('AdminPass123!', 10);

  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      name: 'Jane Student',
      email: 'student@example.com',
      passwordHash: studentPassword,
      role: 'STUDENT',
      isEmailVerified: true,
      targetRole: 'Software Engineer',
      bio: 'Final year CS student aiming for full-stack software development roles.',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      isEmailVerified: true,
      targetRole: 'Platform Administrator',
    },
  });

  // Seed sample resume
  const resume = await prisma.resume.create({
    data: {
      userId: student.id,
      title: 'Jane_Student_Software_Engineer_Resume.pdf',
      fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1/sample_resume.pdf',
      parsedText: 'Jane Student Software Engineer React TypeScript Node.js Express PostgreSQL',
      parsedData: {
        name: 'Jane Student',
        email: 'student@example.com',
        skills: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS', 'Git', 'Docker'],
      },
      isPrimary: true,
      analyses: {
        create: {
          overallScore: 88,
          formattingScore: 92,
          keywordScore: 85,
          grammarScore: 95,
          sectionOrderScore: 90,
          softSkillsScore: 88,
          hardSkillsScore: 87,
          missingKeywords: ['CI/CD', 'GraphQL', 'System Design'],
          missingSkills: ['Kubernetes', 'Redis', 'AWS Lambda'],
          weakSections: ['Quantifiable Impact Metrics'],
          suggestions: [
            'Add clear numerical metrics to work experience bullet points.',
            'Mention AWS and Docker experience prominently in technical skills section.',
          ],
        },
      },
    },
  });

  // Seed job applications
  await prisma.jobApplication.createMany({
    data: [
      {
        userId: student.id,
        company: 'Google',
        position: 'Software Engineer - University Graduate',
        status: 'INTERVIEWING',
        salary: '$145,000 / yr',
        location: 'Mountain View, CA',
        notes: 'Technical phone screen completed cleanly. Virtual onsite scheduled.',
      },
      {
        userId: student.id,
        company: 'Microsoft',
        position: 'Frontend Developer',
        status: 'OFFER',
        salary: '$140,000 / yr',
        location: 'Redmond, WA',
        notes: 'Offer letter received! Reviewing benefits package.',
      },
      {
        userId: student.id,
        company: 'Stripe',
        position: 'Full Stack Engineer',
        status: 'APPLIED',
        salary: '$150,000 / yr',
        location: 'Remote',
        notes: 'Submitted customized resume with tailored project details.',
      },
    ],
  });

  console.log('Seeding completed successfully!');
  console.log('Sample Credentials:');
  console.log('Student: student@example.com / Password123!');
  console.log('Admin: admin@example.com / AdminPass123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
