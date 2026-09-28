import { axiosClient } from "./axiosClient";

export const jobApi = {
  search: async (query, location = "") => {
    const res = await axiosClient.get("/jobs/search", { params: { query, location } });
    return res.data.data.data; // ApiResponse-wrapped { count, data }
  },

  // getAllJobs on the backend responds with a plain res.json(...) instead of
  // the ApiResponse wrapper used everywhere else, so this one sits one level
  // shallower than its siblings.
  getAll: async () => {
    const res = await axiosClient.get("/jobs");
    return res.data.data;
  },

  getById: async (id) => {
    const res = await axiosClient.get(`/jobs/${id}`);
    return res.data.data.job;
  },

  getRecommendations: async () => {
    const res = await axiosClient.get("/jobs/recommendations");
    return res.data.data.data; // ApiResponse-wrapped { count, data }
  },
};