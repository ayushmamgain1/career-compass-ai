import { configureStore } from "@reduxjs/toolkit";
import authReducer, { logout } from "../features/auth/authSlice";
import resumeReducer from "../features/resume/resumeSlice";
import jobsReducer from "../features/jobs/jobSlice";
import matchReducer from "../features/match/matchSlice";
import roadmapReducer from "../features/roadmap/roadmapSlice";
import interviewReducer from "../features/interview/interviewSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import uiReducer from "../features/ui/uiSlice";
import { setUnauthorizedHandler } from "../api/axiosClient";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
    jobs: jobsReducer,
    match: matchReducer,
    roadmap: roadmapReducer,
    interview: interviewReducer,
    dashboard: dashboardReducer,
    ui: uiReducer,
  },
});

// Any 401 anywhere in the app clears auth state, which flips
// isAuthenticated to false and lets ProtectedRoute redirect reactively.
setUnauthorizedHandler(() => store.dispatch(logout()));