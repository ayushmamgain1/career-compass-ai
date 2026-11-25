import { axiosClient } from "./axiosClient";

export const authApi = {
  register: async ({ name, email, password }) => {
    const res = await axiosClient.post("/auth/register", { name, email, password });
    return res.data.data;
  },

  verifyOtp: async ({ email, otp }) => {
    const res = await axiosClient.post("/auth/verify-otp", { email, otp });
    return res.data.data;
  },

  resendOtp: async (email) => {
    const res = await axiosClient.post("/auth/resend-otp", { email });
    return res.data.data;
  },

  googleLogin: async (credential) => {
    const res = await axiosClient.post("/auth/google", { credential });
    return res.data.data;
  },

  login: async ({ email, password }) => {
    const res = await axiosClient.post("/auth/login", { email, password });
    return res.data.data;
  },

  getProfile: async () => {
    const res = await axiosClient.get("/auth/profile");
    return res.data.data.user;
  },

  updateProfile: async (payload) => {
    const res = await axiosClient.put("/auth/profile", payload);
    return res.data.data;
  },
};