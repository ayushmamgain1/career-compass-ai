import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    externalId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    company: { type: String, default: "" },
    location: { type: String, default: "" },
    description: { type: String, required: true },
    jobTitle: { type: String, required: true },
    employmentType: { type: String, default: "" },
    salaryRange: { type: String, default: "" },
    applyUrl: { type: String, default: "" },
    postedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Text index to support keyword search fallback
jobSchema.index({ title: "text", description: "text", requiredSkills: "text" });

export const Job = mongoose.model("Job", jobSchema);