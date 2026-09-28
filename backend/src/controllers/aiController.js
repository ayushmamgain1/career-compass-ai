import { Resume } from "../models/Resume.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { analyzeResume } from "../services/geminiService.js";

// @desc    Run AI analysis on a resume (quality review, suggestions, rewrites)
// @route   POST /api/ai/analyze-resume/:resumeId
// @access  Private
const runResumeAnalysis = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.resumeId,
    user: req.user._id,
  });

  if (!resume) throw new ApiError(404, "Resume not found");

  const analysis = await analyzeResume(resume.rawText);

  resume.aiAnalysis = analysis;
  await resume.save();

  return res.status(200).json(new ApiResponse(200, { data: resume.aiAnalysis }, "Analysis successfully"));
});

export { runResumeAnalysis };