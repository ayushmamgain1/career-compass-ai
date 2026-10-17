import { Job } from "../models/Job.js";
import { Resume } from "../models/Resume.js";
import { generateLearningRoadmap } from "../services/geminiService.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { analyzeSkillGap } from "../utils/skillGapAnalyzer.js";

const createRoadmapForJob = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ user: req.user._id, isActive: true });
  if (!resume) throw new ApiError(404, "No active resume found. Please upload a resume first.");

  const job = await Job.findById(req.params.jobId);
  if (!job) throw new ApiError(404, "Job not found");

  const skillGap = analyzeSkillGap(resume.extractedSkills, job.requiredSkills);

  const roadmap = await generateLearningRoadmap(
    resume.extractedSkills,
    skillGap.missingSkills,
    req.user.careerGoal || job.title
  );

  res
  .status(201)
  .json(
    new ApiResponse(
      201,
      { roadmap },
      "Roadmap created successfully"
    )
  );
});

const createGeneralRoadmap = asyncHandler(async (req, res) => {
  const { targetSkills = [] } = req.body;

  const resume = await Resume.findOne({ user: req.user._id, isActive: true });
  const currentSkills = resume ? resume.extractedSkills : req.user.currentSkills;

  if (!req.user.careerGoal && targetSkills.length === 0) throw new ApiError(400, "Please set a career goal in your profile or provide targetSkills");

  const missingSkills = targetSkills.filter(
    (skill) => !currentSkills.map((s) => s.toLowerCase()).includes(skill.toLowerCase())
  );

  const roadmap = await generateLearningRoadmap(
    currentSkills,
    missingSkills.length ? missingSkills : targetSkills,
    req.user.careerGoal
  );

  res
  .status(201)
  .json(
    new ApiResponse(
      201,
      { roadmap },
      "General Roadmap created"
    )
  );
});

export { createRoadmapForJob, createGeneralRoadmap };