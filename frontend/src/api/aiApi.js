import { axiosClient } from "./axiosClient";

export const aiApi = {
  // The controller for this endpoint double-wraps the payload as
  // { data: aiAnalysis } inside the usual ApiResponse envelope, so the real
  // analysis object ends up three levels deep: response.data.data.data
  analyzeResume: async (resumeId) => {
    const res = await axiosClient.post(`/ai/analyze-resume/${resumeId}`);
    return res.data.data.data; // { strengths, weaknesses, suggestions, rewrittenPoints }
  },
};