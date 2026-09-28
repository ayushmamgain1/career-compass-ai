import { axiosClient } from "./axiosClient";

// NOTE on response shapes: this backend wraps successful responses in an
// ApiResponse class as { statusCode, data, message, success }, so the actual
// payload always sits one level deeper than a typical axios response
// (response.data.data, not response.data). Each function below unwraps to
// exactly the shape components need.

export const authApi = {
  register: async ({ name, email, password }) => {
    const res = await axiosClient.post("/auth/register", { name, email, password });
    return res.data.data; // { _id, name, email, token }
  },

  login: async ({ email, password }) => {
    const res = await axiosClient.post("/auth/login", { email, password });
    return res.data.data; // { _id, name, email, token }
  },

  getProfile: async () => {
    const res = await axiosClient.get("/auth/profile");
    return res.data.data.user; // getUserProfile nests the user under `user`
  },

  updateProfile: async (payload) => {
    const res = await axiosClient.put("/auth/profile", payload);
    return res.data.data; // { _id, name, email, careerGoal, currentSkills }
  },
};