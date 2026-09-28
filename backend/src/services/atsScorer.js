import { matchPercentage } from "../utils/cosineSimilarity.js";

/**
 * Custom ATS Scoring Algorithm
 * Produces a score out of 100 based on weighted categories:
 *   - Keyword Match      (30 pts)
 *   - Formatting         (15 pts)
 *   - Skills             (25 pts)
 *   - Experience         (20 pts)
 *   - Education          (10 pts)
 */

const WEIGHTS = {
  keywordMatch: 30,
  formatting: 15,
  skills: 25,
  experience: 20,
  education: 10,
};

// Common ATS-unfriendly patterns to check for
const scoreFormatting = (rawText) => {
  let score = WEIGHTS.formatting;

  const wordCount = rawText.split(/\s+/).filter(Boolean).length;
  if (wordCount < 150) score -= 5; // too short
  if (wordCount > 1200) score -= 3; // too long

  // Penalize excessive special characters / tables-as-text artifacts
  const specialCharRatio =
    (rawText.match(/[^\w\s]/g) || []).length / Math.max(rawText.length, 1);
  if (specialCharRatio > 0.15) score -= 4;

  // Reward presence of clear section headers
  const hasHeaders = /education|experience|skills|projects/i.test(rawText);
  if (!hasHeaders) score -= 5;

  return Math.max(0, Math.round(score));
};

const scoreSkills = (extractedSkills, jobRequiredSkills = []) => {
  if (!jobRequiredSkills.length) {
    // No job context - score based on quantity/breadth of skills found
    const count = extractedSkills.length;
    if (count >= 10) return WEIGHTS.skills;
    return Math.round((count / 10) * WEIGHTS.skills);
  }

  const normalizedExtracted = extractedSkills.map((s) => s.toLowerCase());
  const normalizedRequired = jobRequiredSkills.map((s) => s.toLowerCase());
  const matched = normalizedRequired.filter((skill) =>
    normalizedExtracted.includes(skill)
  );

  return Math.round((matched.length / normalizedRequired.length) * WEIGHTS.skills);
};

const scoreExperience = (experienceLines) => {
  const count = experienceLines.length;
  if (count === 0) return 0;
  if (count >= 8) return WEIGHTS.experience;
  return Math.round((count / 8) * WEIGHTS.experience);
};

const scoreEducation = (educationLines) => {
  return educationLines.length > 0 ? WEIGHTS.education : 0;
};

const scoreKeywordMatch = (rawText, jobDescription) => {
  if (!jobDescription) {
    // Without a target job, give a neutral baseline based on resume richness
    return Math.round(WEIGHTS.keywordMatch * 0.6);
  }
  const percentage = matchPercentage(rawText, jobDescription);
  return Math.round((percentage / 100) * WEIGHTS.keywordMatch);
};

/**
 * Calculates full ATS score for a resume, optionally against a job description
 * @param {Object} resume - { rawText, extractedSkills, parsedData }
 * @param {Object} [job] - { description, requiredSkills }
 */
const calculateATSScore = (resume, job = null) => {
  const keywordMatch = scoreKeywordMatch(resume.rawText, job?.description);
  const formatting = scoreFormatting(resume.rawText);
  const skills = scoreSkills(resume.extractedSkills, job?.requiredSkills);
  const experience = scoreExperience(resume.parsedData?.experience || []);
  const education = scoreEducation(resume.parsedData?.education || []);

  const total = keywordMatch + formatting + skills + experience + education;

  return {
    total: Math.min(100, total),
    breakdown: { keywordMatch, formatting, skills, experience, education },
  };
};

export { calculateATSScore };