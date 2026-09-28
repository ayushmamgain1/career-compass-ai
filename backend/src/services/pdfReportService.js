import PDFDocument from "pdfkit";

/**
 * Module 12: PDF Report Generation
 * Generates a full career report PDF and streams it directly to the response.
 * @param {Object} res - Express response object (used as write stream target)
 * @param {Object} data - { user, resume, jobMatches, skillGap, roadmap, interviews }
 */
const generateCareerReport = (res, data) => {
  const { user, resume, jobMatches = [], skillGap, roadmap, interviews = [] } = data;

  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="career-compass-report-${Date.now()}.pdf"`
  );
  doc.pipe(res);

  // --- Header ---
  doc.fontSize(22).text("Career Compass AI - Career Report", { align: "center" });
  doc.moveDown();
  doc.fontSize(11).fillColor("gray").text(`Generated for: ${user.name} (${user.email})`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);
  doc.fillColor("black").moveDown(1.5);

  // --- ATS Score ---
  doc.fontSize(16).text("1. Resume ATS Score", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).text(`Overall Score: ${resume?.atsScore?.total ?? "N/A"} / 100`);
  if (resume?.atsScore?.breakdown) {
    const b = resume.atsScore.breakdown;
    doc.text(`  Keyword Match: ${b.keywordMatch}`);
    doc.text(`  Formatting: ${b.formatting}`);
    doc.text(`  Skills: ${b.skills}`);
    doc.text(`  Experience: ${b.experience}`);
    doc.text(`  Education: ${b.education}`);
  }
  doc.moveDown();

  // --- AI Resume Analysis ---
  if (resume?.aiAnalysis) {
    doc.fontSize(16).text("2. AI Resume Analysis", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text("Strengths:", { continued: false });
    (resume.aiAnalysis.strengths || []).forEach((s) => doc.text(`  • ${s}`));
    doc.moveDown(0.3);
    doc.text("Areas to Improve:");
    (resume.aiAnalysis.weaknesses || []).forEach((w) => doc.text(`  • ${w}`));
    doc.moveDown(0.3);
    doc.text("Suggestions:");
    (resume.aiAnalysis.suggestions || []).forEach((s) => doc.text(`  • ${s}`));
    doc.moveDown();
  }

  // --- Job Matches ---
  doc.fontSize(16).text("3. Job Match Results", { underline: true });
  doc.moveDown(0.5);
  if (jobMatches.length) {
    jobMatches.slice(0, 5).forEach((job) => {
      doc.fontSize(12).text(`${job.title} at ${job.company || "N/A"} — ${job.matchScore}% match`);
    });
  } else {
    doc.fontSize(12).text("No job matches available.");
  }
  doc.moveDown();

  // --- Skill Gap Analysis ---
  if (skillGap) {
    doc.fontSize(16).text("4. Skill Gap Analysis", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Readiness Score: ${skillGap.readinessScore}%`);
    doc.text(`Matching Skills: ${skillGap.matchingSkills.join(", ") || "None"}`);
    doc.text(`Missing Skills: ${skillGap.missingSkills.join(", ") || "None"}`);
    doc.moveDown();
  }

  // --- Learning Roadmap ---
  if (roadmap?.roadmap?.length) {
    doc.fontSize(16).text("5. Personalized Learning Roadmap", { underline: true });
    doc.moveDown(0.5);
    roadmap.roadmap.forEach((item) => {
      doc.fontSize(12).text(`Week ${item.week}: ${item.topic}`);
      doc.fontSize(10).fillColor("gray").text(item.description);
      doc.fillColor("black");
      doc.moveDown(0.3);
    });
    doc.moveDown();
  }

  // --- Interview Performance ---
  if (interviews.length) {
    doc.fontSize(16).text("6. Mock Interview Performance", { underline: true });
    doc.moveDown(0.5);
    interviews.forEach((interview) => {
      doc
        .fontSize(12)
        .text(`${interview.role} (${interview.difficulty}) — Score: ${interview.overallScore}/100`);
    });
  }

  doc.end();
};

export { generateCareerReport };