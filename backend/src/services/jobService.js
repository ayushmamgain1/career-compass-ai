import axios from "axios";
import { Job } from "../models/Job.js";
import { matchPercentage } from "../utils/cosineSimilarity.js";

const JOB_API_URL = process.env.JOB_API_URL;
const JOB_API_KEY = process.env.JOB_API_KEY;

const fetchJobsFromExternalAPI = async (query = "software developer", location = "") => {
  if (!JOB_API_URL || !JOB_API_KEY) {
    console.warn("Job API not configured - falling back to local dataset only");
    return [];
  }

  try {
    const response = await axios.get(JOB_API_URL, {
      params: { query: `${query} ${location}`.trim(), num_pages: 1 },
      headers: {
        "X-RapidAPI-Key": JOB_API_KEY,
        "X-RapidAPI-Host": new URL(JOB_API_URL).hostname,
      },
      timeout: 10000,
    });

    const rawJobs = response.data?.data?.jobs || [];

    const normalized = rawJobs.map((job) => ({
      externalId: job.job_id,
      title: job.job_title || "Untitled Role",
      company: job.employer_name || "",
      location: [job.job_city, job.job_state, job.job_country].filter(Boolean).join(", "),
      description: job.job_description || "",
      requiredSkills: [], // enriched later via NLP extraction if needed
      employmentType: job.job_employment_type || "",
      salaryRange:
        job.job_min_salary && job.job_max_salary
          ? `${job.job_min_salary} - ${job.job_max_salary}`
          : "",
      applyUrl: job.job_apply_link || ""
    }));

    // Cache into DB (upsert by title+company to avoid duplicates)
    const savedJobs = [];
    for (const job of normalized) {
      const saved = await Job.findOneAndUpdate(
        { externalId: job.externalId },
        job,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      savedJobs.push(saved);
    }

    return savedJobs;
  } catch (error) {
    console.error("Job API fetch error:", error.message);
    return [];
  }
};

const recommendJobsForTitle = async (jobTitle, limit = 10) => {
  if (!jobTitle?.trim()) return [];

  const jobs = await Job.find().limit(200).lean();

  const ranked = jobs
    .map((job) => ({
      ...job,
      matchScore: matchPercentage(
        jobTitle,
        `${job.title} ${job.description}`
      ),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);

  return ranked.slice(0, limit);
};

export { fetchJobsFromExternalAPI, recommendJobsForTitle };