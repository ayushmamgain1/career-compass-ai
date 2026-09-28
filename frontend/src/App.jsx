import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "./features/auth/authSlice";
import { connectSocket, disconnectSocket } from "./lib/socket";
import { setOnlineUsers } from "./features/ui/uiSlice";

import PublicLayout from "./components/layout/PublicLayout";
import AppShell from "./components/layout/AppShell";
import ProtectedRoute from "./components/ui/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ResumesPage from "./pages/ResumesPage";
import ResumeDetailPage from "./pages/ResumeDetailPage";
import JobsPage from "./pages/JobsPage";
import JobDetailPage from "./pages/JobDetailPage";
import RoadmapPage from "./pages/RoadmapPage";
import InterviewsPage from "./pages/InterviewsPage";
import InterviewSessionPage from "./pages/InterviewSessionPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.user?._id);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (token) {
      dispatch(fetchProfile());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAuthenticated && userId) {
      const socket = connectSocket(userId);
      socket.on("getOnlineUsers", (ids) => dispatch(setOnlineUsers(ids)));
      return () => {
        socket.off("getOnlineUsers");
      };
    }
    disconnectSocket();
  }, [isAuthenticated, userId, dispatch]);

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/resume" element={<ResumesPage />} />
        <Route path="/resume/:id" element={<ResumeDetailPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/interviews" element={<InterviewsPage />} />
        <Route path="/interviews/:id" element={<InterviewSessionPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}