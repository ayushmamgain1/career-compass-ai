import axios from "axios";
import { ApiError } from "../utils/ApiError.js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL;


const callGemini = async (prompt, { temperature = 0.4 } = {}, fallbackModel = GEMINI_MODEL) => {
  if (!GEMINI_API_KEY) {
    throw new ApiError(500, "Gemini API key is missing");
  }

  const start = performance.now();

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${fallbackModel}:generateContent`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature,
          maxOutputTokens: 256,
          responseMimeType: "application/json",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
      }
    );

    console.log(
      `Gemini generation: ${((performance.now() - start) / 1000).toFixed(2)}s`
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new ApiError(502, "Empty Gemini response");
    }

    return text;
  } catch (error) {
    console.error("Gemini error:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
    });

    if (error instanceof ApiError) throw error;

    throw new ApiError(502, "Gemini evaluation failed");
  }
};

const parseJSONResponse = (rawText) => {
  const cleaned = rawText.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new ApiError(500, "Failed to parse Gemini JSON response: " + err.message);
  }
};

const analyzeResume = async (resumeText) => {
  const prompt = `
You are an expert resume reviewer and career coach. Analyze the following resume text.

Return ONLY valid JSON (no markdown, no preamble) in this exact shape:
{
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "suggestions": ["...", "..."],
  "rewrittenPoints": ["original weak bullet -> improved version", "..."]
}

Resume text:
"""
${resumeText}
"""
`;
  const raw = await callGemini(prompt);
  return parseJSONResponse(raw);
};

const generateLearningRoadmap = async (currentSkills, missingSkills, careerGoal) => {
  const prompt = `
You are a career mentor creating a personalized learning roadmap.

Current skills: ${currentSkills.join(", ") || "None specified"}
Missing/target skills: ${missingSkills.join(", ")}
Career goal: ${careerGoal || "Not specified"}

Return ONLY valid JSON (no markdown) in this exact shape:
{
  "roadmap": [
    { "week": 1, "topic": "...", "description": "...", "resources": ["...", "..."] }
  ],
  "estimatedDurationWeeks": number
}

Create a realistic week-by-week plan (max 12 weeks) that builds skills in a logical order.
`;
  const raw = await callGemini(prompt);
  return parseJSONResponse(raw);
};

const generateInterviewQuestions = async (role, difficulty = "intermediate", count = 5) => {
  const prompt = `
Generate ${count} mock interview questions for the role of "${role}" at ${difficulty} difficulty.
Include a mix of technical and behavioral questions relevant to the role.

Return ONLY valid JSON (no markdown) in this exact shape:
{
  "questions": ["question 1", "question 2", "..."]
}
`;
  const raw = await callGemini(prompt);
  return parseJSONResponse(raw);
};

const evaluateInterviewAnswer = async (question, answer, role) => {
  const prompt = `
You are an interview coach evaluating a candidate's answer for a "${role}" position.

Question: "${question}"
Candidate's answer: "${answer}"

Return ONLY valid JSON (no markdown) in this exact shape:
{
  "score": number (0-10),
  "feedback": "specific, constructive feedback in 2-3 sentences",
  "improvementTip": "one concrete tip to improve this answer"
}
Be concise. Do not explain your scoring process.
`;
  const raw = await callGemini(prompt, { temperature: 0.2 }, "gemini-3.5-flash-lite");
  return parseJSONResponse(raw);
};

const generateInterviewSummary = async (qaHistory, role) => {
  const historyText = qaHistory
    .map((qa, i) => `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}\nScore: ${qa.score}/10`)
    .join("\n\n");

  const prompt = `
You are an interview coach summarizing a candidate's mock interview performance for a "${role}" role.

${historyText}

Return ONLY valid JSON (no markdown) in this exact shape:
{
  "overallScore": number (0-100),
  "strengths": ["...", "..."],
  "improvementAreas": ["...", "..."],
  "summary": "2-3 sentence overall summary"
}
`;
  const raw = await callGemini(prompt);
  return parseJSONResponse(raw);
};

const generateJobTitle = async (skills = []) => {
  const prompt = `
You are an expert technical recruiter.

Based on the following skills, determine the SINGLE most suitable job title.

Skills:
${skills.join(", ")}

Rules:
- Return ONLY the job title.
- Do NOT include any explanation.
- Do NOT use markdown or quotes.
- Keep it between 1 and 4 words.
- Use a common industry-standard title.

Examples:
Skills: React, JavaScript, HTML, CSS, Redux
Output: Frontend Developer

Skills: Node.js, Express.js, MongoDB, REST API
Output: Backend Developer

Skills: Python, TensorFlow, Machine Learning
Output: Machine Learning Engineer

Skills: React, Node.js, MongoDB, Express.js
Output: Full Stack Developer
`;

  const raw = await callGemini(prompt);
  return raw.trim();
};

export {
  callGemini,
  analyzeResume,
  generateLearningRoadmap,
  generateInterviewQuestions,
  evaluateInterviewAnswer,
  generateInterviewSummary,
  generateJobTitle
};