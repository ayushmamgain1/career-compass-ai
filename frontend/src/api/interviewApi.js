import { axiosClient } from "./axiosClient";

export const interviewApi = {
  start: async ({ role, difficulty }) => {
    const res = await axiosClient.post("/interviews/start", { role, difficulty });
    return res.data.data.interview;
  },

  submitAnswer: async (id, questionIndex, answer) => {
    const res = await axiosClient.post(`/interviews/${id}/answer`, { questionIndex, answer });
    return res.data.data; // { questionIndex, score, feedback, improvementTip }
  },

  complete: async (id) => {
    const res = await axiosClient.post(`/interviews/${id}/complete`);
    return res.data.data.interview;
  },

  // getInterviews responds with a plain res.json(...), one level shallower
  // than the ApiResponse-wrapped endpoints (same pattern as jobApi.getAll).
  getAll: async () => {
    const res = await axiosClient.get("/interviews");
    return res.data.data;
  },

  getById: async (id) => {
    const res = await axiosClient.get(`/interviews/${id}`);
    return res.data.data.interview;
  },
};