import { axiosClient } from "./axiosClient";

export const matchApi = {
  matchResumeToJob: async (jobId) => {
    const res = await axiosClient.post(`/match/${jobId}`);
    return res.data.data; // { job, matchPercentage, matchingSkills, missingSkills, readinessScore, contextualATSScore, improvementSuggestions }
  },

  bulkSkillGap: async (jobIds) => {
    const res = await axiosClient.post("/match/skill-gap/bulk", { jobIds });
    return res.data.data.results;
  },
};