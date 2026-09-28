import asyncHandler from "../utils/asyncHandler.js";
import { Interview } from "../models/Interview.js";
import { generateInterviewQuestions, evaluateInterviewAnswer, generateInterviewSummary } from "../services/geminiService.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// @desc    Start a new mock interview - generates questions for a role
// @route   POST /api/interviews/start
// @access  Private
// body: { role, difficulty }
const startInterview = asyncHandler(async (req, res) => {
  const { role, difficulty = "intermediate" } = req.body;

  if (!role) throw new ApiError(400, "Please specify a target role for the interview");

  const { questions } = await generateInterviewQuestions(role, difficulty, 5);

  const interview = await Interview.create({
    user: req.user._id,
    role,
    difficulty,
    questions: questions.map((q) => ({ question: q, answer: "", feedback: "", score: 0 })),
    status: "in-progress",
  });

  res.status(201).json(new ApiResponse(201, { interview }, "Interview Started"));
});

// @desc    Submit an answer to a specific question in the interview, get AI feedback
// @route   POST /api/interviews/:id/answer
// @access  Private
// body: { questionIndex, answer }
const submitAnswer = asyncHandler(async (req, res) => {
  const { questionIndex, answer } = req.body;

  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) throw new ApiError(404, "Interview session not found");

  if (questionIndex < 0 || questionIndex >= interview.questions.length) {
    throw new ApiError(404, "Invalid question index");
  }

  const questionText = interview.questions[questionIndex].question;
  const evaluation = await evaluateInterviewAnswer(questionText, answer, interview.role);

  interview.questions[questionIndex].answer = answer;
  interview.questions[questionIndex].feedback = evaluation.feedback;
  interview.questions[questionIndex].score = evaluation.score;

  await interview.save();

  res
  .status(201)
  .json(
    new ApiResponse(
      201,
      {
        questionIndex,
        score: evaluation.score,
        feedback: evaluation.feedback,
        improvementTip: evaluation.improvementTip,
      },
      "Answer submitted"
    )
  );
});

// @desc    Complete the interview and generate an overall performance summary
// @route   POST /api/interviews/:id/complete
// @access  Private
const completeInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) throw new ApiError(404, "Interview session not found");

  const answeredQuestions = interview.questions.filter((q) => q.answer);
  // if (answeredQuestions.length === 0) {
  //   res.status(400);
  //   throw new Error("Please answer at least one question before completing the interview");
  // }

  const summary = await generateInterviewSummary(answeredQuestions, interview.role);

  interview.overallScore = summary.overallScore;
  interview.strengths = summary.strengths;
  interview.improvementAreas = summary.improvementAreas;
  interview.status = "completed";

  await interview.save();

  res
  .status(201)
  .json(
    new ApiResponse(
      201,
      {
        interview
      }
    )
  );
});

// @desc    Get all interviews for the logged-in user
// @route   GET /api/interviews
// @access  Private
const getInterviews = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: interviews.length, data: interviews });
});

// @desc    Get a single interview by ID
// @route   GET /api/interviews/:id
// @access  Private
const getInterviewById = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) throw new ApiError(404, "Interview session not found");

  res
  .status(201)
  .json(
    new ApiResponse(
      201,
      { interview },
      "Interview fetched"
    )
  );
});

export {
  startInterview,
  submitAnswer,
  completeInterview,
  getInterviews,
  getInterviewById,
};