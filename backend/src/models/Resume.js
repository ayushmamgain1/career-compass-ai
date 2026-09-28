import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalFileName: { type: String, required: true },
    fileUrl: { type: String, default: "" }, // local path or Cloudinary URL
    fileType: { type: String, enum: ["pdf", "docx"], required: true },

    rawText: { type: String, default: "" },

    parsedData: {
      name: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      education: { type: [String], default: [] },
      experience: { type: [String], default: [] },
      projects: { type: [String], default: [] },
      certifications: { type: [String], default: [] },
    },

    extractedSkills: { type: [String], default: [] },

    jobTitle: { type: String, default: "" },

    atsScore: {
      total: { type: Number, default: 0 },
      breakdown: {
        keywordMatch: { type: Number, default: 0 },
        formatting: { type: Number, default: 0 },
        skills: { type: Number, default: 0 },
        experience: { type: Number, default: 0 },
        education: { type: Number, default: 0 },
      },
    },

    aiAnalysis: {
      strengths: { type: [String], default: [] },
      weaknesses: { type: [String], default: [] },
      suggestions: { type: [String], default: [] },
      rewrittenPoints: { type: [String], default: [] },
    },

    isActive: { type: Boolean, default: true }, // marks the user's current active resume
  },
  { timestamps: true }
);

export const Resume = mongoose.model("Resume", resumeSchema);