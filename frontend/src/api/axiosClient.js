import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const axiosClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

const TOKEN_KEY = "cc_token";

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

axiosClient.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Lazily wired from store.js to avoid a circular import (store -> slices ->
// this file -> store). setUnauthorizedHandler is called once at app startup.
let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && onUnauthorized) {
      onUnauthorized();
    }
    return Promise.reject(error);
  }
);

/**
 * The backend's error responses consistently look like { success: false, message }.
 * This normalizes any axios error down to a plain string for use in Redux
 * rejectWithValue / toasts, regardless of network vs. server-side failure.
 */
export const extractErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message === "Network Error") return "Can't reach the server. Check your connection and try again.";
  if (error?.code === "ECONNABORTED") return "That request timed out. Please try again.";
  return error?.message || fallback;
};