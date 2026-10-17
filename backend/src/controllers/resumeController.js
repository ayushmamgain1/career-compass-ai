import path from "path";
import asyncHandler from "../utils/asyncHandler.js";
import { Resume } from "../models/Resume.js";
import { parseResume } from "../utils/resumeParser.js";
import { extractSkillsFromText } from "../services/nlpService.js";
import { calculateATSScore } from "../services/atsScorer.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateJobTitle } from "../services/geminiService.js";

const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(404, "No resume file uploaded");

  const fileType = path.extname(req.file.originalname).toLowerCase() === ".pdf" ? "pdf" : "docx";

  const { rawText, parsedData } = await parseResume(req.file.path, fileType);

  const extractedSkills = await extractSkillsFromText(rawText);

  const atsScore = calculateATSScore({ rawText, extractedSkills, parsedData });

  const jobTitle = await generateJobTitle(extractedSkills);

  await Resume.updateMany({ user: req.user._id }, { isActive: false });

  const resume = await Resume.create({
    user: req.user._id,
    originalFileName: req.file.originalname,
    fileUrl: req.file.path,
    fileType,
    rawText,
    parsedData,
    jobTitle,
    extractedSkills,
    atsScore,
    isActive: true,
  });

  res
  .status(201)
  .json(
    new ApiResponse(
      201,
      { resume },
      "Resume uploaded"
    )
  );
});

const getResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
  res
  .status(201)
  .json(
    new ApiResponse(
      201,
      { count: resumes.length, data: resumes },
      "Resumes fetched"
    )
  );
});

const getResumeById = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });

  if (!resume) throw new ApiError(404, "Resume not found");

  res
  .status(201)
  .json(
    new ApiResponse(
      201,
      { resume },
      "Resume Found"
    )
  );
});

const getActiveResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ user: req.user._id, isActive: true }).sort({
    createdAt: -1,
  });

  if (!resume) throw new ApiError(404, "No active resume found. Please upload a resume first.");

  res
  .status(201)
  .json(
    new ApiResponse(
      201,
      { resume },
      "Active Resume Found"
    )
  );
});

const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!resume) throw new ApiError(404, "Resume not found");

 res
  .status(201)
  .json(
    new ApiResponse(
      201,
      {},
      "Resume deleted successfully"
    )
  );
});

export {
  uploadResume,
  getResumes,
  getResumeById,
  getActiveResume,
  deleteResume,
};