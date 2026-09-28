import { axiosClient } from "./axiosClient";

export const roadmapApi = {
  createForJob: async (jobId) => {
    const res = await axiosClient.post(`/roadmap/${jobId}`);
    return res.data.data.roadmap; // { roadmap: [{ week, topic, description, resources }], estimatedDurationWeeks }
  },

  createGeneral: async (targetSkills = []) => {
    const res = await axiosClient.post("/roadmap/general", { targetSkills });
    return res.data.data.roadmap;
  },
};