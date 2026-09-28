import { axiosClient } from "./axiosClient";

export const dashboardApi = {
  getDashboard: async () => {
    const res = await axiosClient.get("/dashboard");
    return res.data.data;
  },
};