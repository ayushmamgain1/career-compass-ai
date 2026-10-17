import { Job } from "../models/Job.js";
import { Resume } from "../models/Resume.js";
import { calculateATSScore } from "../services/atsScorer.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { matchPercentage } from "../utils/cosineSimilarity.js";
import { analyzeSkillGap } from "../utils/skillGapAnalyzer.js";

const matchResumeToJob = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ user: req.user._id, isActive: true });
  if (!resume) throw new ApiError(404, "No active resume found. Please upload a resume first.");

  const job = await Job.findById(req.params.jobId);
  if (!job) throw new ApiError(404, "Job not found");

  // Module 7: Resume-Job Matching
  const matchScore = matchPercentage(resume.rawText, job.description);

  // Module 8: Skill Gap Analysis
  const skillGap = analyzeSkillGap(resume.extractedSkills, job.requiredSkills);

  // Recalculate ATS score in context of this specific job
  const contextualATSScore = calculateATSScore(
    { rawText: resume.rawText, extractedSkills: resume.extractedSkills, parsedData: resume.parsedData },
    { description: job.description, requiredSkills: job.requiredSkills }
  );

  res
  .status(201)
  .json(
    new ApiResponse(
      201,
      {
        job: { id: job._id, title: job.title, company: job.company },
        matchPercentage: matchScore,
        matchingSkills: skillGap.matchingSkills,
        missingSkills: skillGap.missingSkills,
        readinessScore: skillGap.readinessScore,
        contextualATSScore,
        improvementSuggestions: skillGap.missingSkills.map(
          (skill) => `Consider learning or highlighting experience with ${skill}`
        )
      },
      "Matched resume with Jobs"
    )
  );
});

const bulkSkillGapAnalysis = asyncHandler(async (req, res) => {
  const { jobIds = [] } = req.body;

  const resume = await Resume.findOne({ user: req.user._id, isActive: true });
  if (!resume) throw new ApiError(404, "No active resume found. Please upload a resume first.");

  const jobs = await Job.find({ _id: { $in: jobIds } });

  const results = jobs.map((job) => {
    const gap = analyzeSkillGap(resume.extractedSkills, job.requiredSkills);
    return {
      jobId: job._id,
      title: job.title,
      company: job.company,
      ...gap,
    };
  });

  res
  .status(201)
  .json(
    new ApiResponse(
      201,
      { results },
      ""
    )
  );
});

export { matchResumeToJob, bulkSkillGapAnalysis };