import mongoose from "mongoose";

const qaSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, default: "" },
    feedback: { type: String, default: "" },
    score: { type: Number, min: 0, max: 10, default: 0 },
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: { type: String, required: true }, // e.g. "Frontend Developer"
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "intermediate",
    },
    questions: { type: [qaSchema], default: [] },
    overallScore: { type: Number, min: 0, max: 100, default: 0 },
    strengths: { type: [String], default: [] },
    improvementAreas: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
  },
  { timestamps: true }
);

export const Interview = mongoose.model("Interview", interviewSchema);