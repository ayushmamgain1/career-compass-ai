import axios from "axios";

const NLP_SERVICE_URL = process.env.NLP_SERVICE_URL;

/**
 * Module 5: Skill Extraction (NLP)
 * Sends resume text to the Python spaCy microservice and returns extracted skills.
 * Falls back to an empty array (with a warning) if the microservice is unreachable,
 * so the rest of the pipeline (ATS scoring, matching) can still proceed.
 */
const extractSkillsFromText = async (text) => {
  try {
    const response = await axios.post(
      `${NLP_SERVICE_URL}/extract-skills`,
      { text },
      { timeout: 10000 }
    );
    return response.data?.skills || [];
  } catch (error) {
    console.error("NLP microservice error:", error.message);
    return [];
  }
};

/**
 * Health check for the NLP microservice
 */
const checkNLPServiceHealth = async () => {
  try {
    const response = await axios.get(`${NLP_SERVICE_URL}/health`, { timeout: 5000 });
    return response.data;
  } catch (error) {
    return { status: "unreachable", error: error.message };
  }
};

export { extractSkillsFromText, checkNLPServiceHealth };