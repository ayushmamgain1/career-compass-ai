import { Interview } from "../models/Interview.js";
import { Job } from "../models/Job.js";
import { Resume } from "../models/Resume.js";
import { recommendJobsForTitle } from "../services/jobService.js";
import { generateCareerReport } from "../services/pdfReportService.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Generate and download a full career report PDF
// @route   GET /api/reports/download?jobId=optional
// @access  Private
const downloadCareerReport = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ user: req.user._id, isActive: true });
  if (!resume) throw new ApiError(404, "No active resume found. Please upload a resume first.");

  const jobMatches = await recommendJobsForTitle(resume.jobTitle, 5);

  let skillGap = null;
  let roadmap = null;

  const { jobId } = req.query;
  const targetJob = jobId ? await Job.findById(jobId) : jobMatches[0];

  if (targetJob) {
    skillGap = analyzeSkillGap(resume.extractedSkills, targetJob.jobTitle || []);
    try {
      roadmap = await generateLearningRoadmap(
        resume.extractedSkills,
        skillGap.missingSkills,
        req.user.careerGoal || targetJob.title
      );
    } catch (err) {
      console.error("Roadmap generation skipped in report:", err.message);
    }
  }

  const interviews = await Interview.find({
    user: req.user._id,
    status: "completed",
  }).sort({ createdAt: -1 });

  generateCareerReport(res, {
    user: req.user,
    resume,
    jobMatches,
    skillGap,
    roadmap,
    interviews,
  });
});

export { downloadCareerReport };