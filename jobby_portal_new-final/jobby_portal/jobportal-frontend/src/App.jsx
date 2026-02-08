// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { setAuthToken } from "./api/api";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";

// Transitions
import PageTransition from "./components/PageTransition";

// AI Chatbot (Global)
import AIChatbot from "./components/AIChatbot";

// Landing Page
import LandingPage from "./pages/LandingPage";

// Auth pages (DIRECT PAGES — NOT AuthPage)
import LoginJobseeker from "./pages/auth/LoginJobseeker";
import LoginEmployer from "./pages/auth/LoginEmployer";
import SignupJobseeker from "./pages/auth/SignupJobseeker";
import SignupEmployer from "./pages/auth/SignupEmployer";
import AuthPage from "./pages/auth/AuthPage";
import ResetPassword from "./pages/auth/ResetPassword";
import NotFound from "./pages/NotFound";

// Protected wrapper
import ProtectedRoute from "./components/ProtectedRoute";

// Profile Steps (Job Seeker)
import ProfileSteps from "./pages/profile/ProfileSteps";

// Dashboards
import SeekerDashboard from "./pages/SeekerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import ApplicantTracking from "./pages/employer/ApplicantTracking";

// Employer Profile
import EmployerProfile from "./pages/EmployerProfile";

// Jobs Module
import JobsList from "./pages/jobs/JobsList";
import JobCreate from "./pages/jobs/JobCreate";
import JobEdit from "./pages/jobs/JobEdit";
import JobView from "./pages/jobs/JobView";
import MyJobs from "./pages/jobs/MyJobs";
import JobSearch from "./pages/jobs/JobSearch";
import JobCategories from "./pages/jobs/JobCategories";

// Companies
import CompanyList from "./pages/companies/CompanyList";
import CompanyView from "./pages/companies/CompanyView";

// Blog
import BlogList from "./pages/blog/BlogList";
import BlogDetail from "./pages/blog/BlogDetail";

// Applications
import MyApplications from "./pages/applications/MyApplications";
import ApplicationManagement from "./pages/applications/ApplicationManagement";

// Extra Pages
import Assessments from "./pages/Assessments";
import Events from "./pages/Events";
import Interviews from "./pages/Interviews";
import Resume from "./pages/Resume";
import ContactPage from "./pages/ContactPage";

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* AUTH ROUTES */}
        <Route path="/login/jobseeker" element={<PageTransition><LoginJobseeker /></PageTransition>} />
        <Route path="/login/employer" element={<PageTransition><LoginEmployer /></PageTransition>} />

        <Route path="/register/jobseeker" element={<PageTransition><SignupJobseeker /></PageTransition>} />
        <Route path="/register/employer" element={<PageTransition><SignupEmployer /></PageTransition>} />

        {/* Clean unified optional route */}
        <Route path="/auth/:mode/:role" element={<PageTransition><AuthPage /></PageTransition>} />

        {/* Redirects */}
        <Route path="/login" element={<Navigate to="/login/jobseeker" />} />
        <Route path="/register" element={<Navigate to="/register/jobseeker" />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/profile/steps"
          element={
            <ProtectedRoute allowedRole="jobseeker">
              <PageTransition><ProfileSteps /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/seeker"
          element={
            <ProtectedRoute allowedRole="jobseeker">
              <PageTransition><SeekerDashboard /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/find-jobs"
          element={
            <ProtectedRoute allowedRole="jobseeker">
              <PageTransition><JobSearch /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/employer"
          element={
            <ProtectedRoute allowedRole="employer">
              <PageTransition><EmployerDashboard /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/employer/applications"
          element={
            <ProtectedRoute allowedRole="employer">
              <PageTransition><ApplicantTracking /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/employer"
          element={
            <ProtectedRoute allowedRole="employer">
              <PageTransition><EmployerProfile /></PageTransition>
            </ProtectedRoute>
          }
        />

        {/* Public Job Routes (accessible to all) */}
        <Route path="/jobs" element={<JobsList />} />
        <Route path="/jobs/:id" element={<PageTransition><JobView /></PageTransition>} />
        <Route path="/job-categories" element={<PageTransition><JobCategories /></PageTransition>} />

        {/* Company Routes */}
        <Route path="/companies" element={<CompanyList />} />
        <Route path="/companies/:id" element={<PageTransition><CompanyView /></PageTransition>} />

        {/* Blog Routes */}
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:id" element={<PageTransition><BlogDetail /></PageTransition>} />

        {/* Employer-Only Job Management */}
        <Route
          path="/my-jobs"
          element={
            <ProtectedRoute allowedRole="employer">
              <PageTransition><MyJobs /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/create"
          element={
            <ProtectedRoute allowedRole="employer">
              <PageTransition><JobCreate /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:id/edit"
          element={
            <ProtectedRoute allowedRole="employer">
              <PageTransition><JobEdit /></PageTransition>
            </ProtectedRoute>
          }
        />

        {/* Application Routes */}
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute allowedRole="jobseeker">
              <PageTransition><MyApplications /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute allowedRole="employer">
              <PageTransition><ApplicationManagement /></PageTransition>
            </ProtectedRoute>
          }
        />

        {/* Extra Pages */}
        <Route path="/assessments" element={<PageTransition><Assessments /></PageTransition>} />
        <Route path="/events" element={<PageTransition><Events /></PageTransition>} />
        <Route path="/interviews" element={<PageTransition><Interviews /></PageTransition>} />
        <Route path="/resume" element={<PageTransition><Resume /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />

        {/* Auth Extras */}
        <Route path="/forgot-password" element={<PageTransition><ResetPassword /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

// Component to conditionally render chatbot for authenticated users
const AuthenticatedChatbot = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check immediately on mount
    return !!localStorage.getItem("token");
  });

  useEffect(() => {
    // Check periodically for login/logout changes
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    // Check immediately
    checkAuth();

    // Check every 500ms for faster response
    const interval = setInterval(checkAuth, 500);

    // Also listen for storage events (from other tabs)
    window.addEventListener("storage", checkAuth);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  if (!isAuthenticated) return null;
  return <AIChatbot />;
};

export default function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <AppRoutes />
        <AuthenticatedChatbot />
      </div>
    </BrowserRouter>
  );
}

