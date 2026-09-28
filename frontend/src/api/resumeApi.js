import { axiosClient } from "./axiosClient";

export const resumeApi = {
  upload: async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append("resume", file); // field name must be "resume" - multer expects this exact key
    const res = await axiosClient.post("/resumes/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    });
    return res.data.data.resume;
  },

  getAll: async () => {
    const res = await axiosClient.get("/resumes");
    return res.data.data.data; // { count, data: [...] } payload
  },

  getActive: async () => {
    const res = await axiosClient.get("/resumes/active");
    return res.data.data.resume;
  },

  getById: async (id) => {
    const res = await axiosClient.get(`/resumes/${id}`);
    return res.data.data.resume;
  },

  remove: async (id) => {
    await axiosClient.delete(`/resumes/${id}`);
    return id;
  },
};