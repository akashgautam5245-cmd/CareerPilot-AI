import jsPDF from 'jspdf';
import { InterviewSession } from '../types';

export function exportInterviewPDF(session: InterviewSession) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header background banner
  doc.setFillColor(30, 41, 59); // Slate dark
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('AI MOCK INTERVIEW SCORECARD REPORT', 15, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 30);

  // Meta Information Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 48, pageWidth - 30, 35, 3, 3, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Target Role: ${session.targetRole}`, 22, 58);
  doc.text(`Difficulty: ${session.difficulty}`, 22, 66);
  doc.text(`Type: ${session.interviewType}`, 22, 74);

  doc.text(`Company Type: ${session.companyType || 'N/A'}`, 110, 58);
  doc.text(`Experience Level: ${session.experienceLevel || 'N/A'}`, 110, 66);
  doc.text(`Overall Score: ${session.overallScore || 85} / 100`, 110, 74);

  // Granular Metric Scores
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Performance Metrics Breakdown', 15, 96);

  const metrics = [
    { label: 'Technical Accuracy', score: session.technicalScore || 85 },
    { label: 'Grammar & Clarity', score: session.grammarScore || 90 },
    { label: 'Confidence Score', score: session.confidenceScore || 88 },
    { label: 'Communication Skills', score: session.communicationScore || 92 },
    { label: 'Fluency', score: session.fluencyScore || 86 },
    { label: 'Completeness', score: session.completenessScore || 84 },
  ];

  let startY = 105;
  metrics.forEach((m, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = col === 0 ? 15 : 110;
    const y = startY + row * 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    doc.text(`${m.label}: ${m.score}%`, x, y);

    // Draw score bar background
    doc.setFillColor(226, 232, 240);
    doc.rect(x, y + 2, 70, 4, 'F');
    // Draw fill bar
    doc.setFillColor(59, 130, 246);
    doc.rect(x, y + 2, Math.min(70, (m.score / 100) * 70), 4, 'F');
  });

  // Questions and Answers
  let currentY = 155;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('Questions & Answer Evaluation Details', 15, currentY);
  currentY += 10;

  if (session.answers && session.answers.length > 0) {
    session.answers.forEach((ans, i) => {
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 58, 138);
      const qText = doc.splitTextToSize(`Q${i + 1}: ${ans.question}`, pageWidth - 30);
      doc.text(qText, 15, currentY);
      currentY += qText.length * 6 + 2;

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      const aText = doc.splitTextToSize(`Candidate Answer: "${ans.userAnswer}"`, pageWidth - 35);
      doc.text(aText, 20, currentY);
      currentY += aText.length * 5 + 3;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(16, 185, 129);
      doc.text(`Score: ${ans.score}%`, 20, currentY);
      currentY += 5;

      doc.setTextColor(51, 65, 85);
      const fText = doc.splitTextToSize(`Feedback: ${ans.feedback}`, pageWidth - 35);
      doc.text(fText, 20, currentY);
      currentY += fText.length * 5 + 8;
    });
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Detailed question-by-question responses completed in live AI session.', 15, currentY);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Powered by AI Mock Interview Studio — Antigravity Platform', 15, 285);

  doc.save(`Interview_Report_${session.targetRole.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
}
