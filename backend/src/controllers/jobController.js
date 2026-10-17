import { Job } from "../models/Job.js";
import { Resume } from "../models/Resume.js";
import { fetchJobsFromExternalAPI, recommendJobsForTitle } from "../services/jobService.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const searchJobs = asyncHandler(async (req, res) => {
  const { query = "software developer", location = "" } = req.query;
  const jobs = await fetchJobsFromExternalAPI(query, location);
  res
  .status(201)
  .json(
    new ApiResponse(
      201,
      { count: jobs.length, data: jobs },
      ""
    )
  );
});

const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 }).limit(100);
  res.json({ success: true, count: jobs.length, data: jobs });
});

const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new ApiError(404, "Job not found");
  
  res
  .status(201)
  .json(
    new ApiResponse(
      201,
      { job },
      "Job Found"
    )
  );
});

const getJobRecommendations = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ user: req.user._id, isActive: true });

  if (!resume) throw new ApiError(404, "No active resume found. Please upload a resume first.");

  let recommendations = await recommendJobsForTitle(resume.jobTitle, 10);

  if(!recommendations.length) {
    await fetchJobsFromExternalAPI(resume.jobTitle);
    recommendations = await recommendJobsForTitle(resume.jobTitle, 10);
  }

  res.
  status(200)
  .json(
    new ApiResponse(
      201,
      { count: recommendations.length, data: recommendations },
      "Job recommendations"
    )
  );
});

const createJob = asyncHandler(async (req, res) => {
  const job = await Job.create({ ...req.body, source: "manual" });
  res
  .status(201)
  .json(new ApiResponse(
    201,
    { data: job },
    "Job Created"
  ));
  res.status(201).json({ success: true, data: job });
});

export {
  searchJobs,
  getAllJobs,
  getJobById,
  getJobRecommendations,
  createJob,
};