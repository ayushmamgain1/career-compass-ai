import { Interview } from "../models/Interview.js";
import { Resume } from "../models/Resume.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const activeResume = await Resume.findOne({ user: userId, isActive: true });
  const allResumes = await Resume.find({ user: userId }).sort({ createdAt: -1 });
  const interviews = await Interview.find({ user: userId }).sort({ createdAt: -1 });

  const completedInterviews = interviews.filter((i) => i.status === "completed");

  const avgInterviewScore = completedInterviews.length
    ? Math.round(
        completedInterviews.reduce((sum, i) => sum + i.overallScore, 0) /
          completedInterviews.length
      )
    : 0;

  // Skill progress: track how extractedSkills count has grown across resume versions
  const skillProgress = allResumes
    .slice()
    .reverse()
    .map((r) => ({
      date: r.createdAt,
      skillCount: r.extractedSkills.length,
      atsScore: r.atsScore.total,
    }));

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        {
          atsScore: activeResume?.atsScore?.total ?? null,
          atsBreakdown: activeResume?.atsScore?.breakdown ?? null,
          totalSkills: activeResume?.extractedSkills?.length ?? 0,
          skills: activeResume?.extractedSkills ?? [],
          resumeAnalysis: activeResume?.aiAnalysis ?? null,
          interviews: {
            total: interviews.length,
            completed: completedInterviews.length,
            averageScore: avgInterviewScore,
            recent: interviews.slice(0, 5),
          },
          skillProgress,
          hasActiveResume: !!activeResume,
        },
        "Dashboard fetched"
      )
    );
});

export { getDashboardData };