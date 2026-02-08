import React from "react";
import { useParams } from "react-router-dom";
import SignupJobseeker from "./SignupJobseeker";
import SignupEmployer from "./SignupEmployer";
import LoginJobseeker from "./LoginJobseeker";
import LoginEmployer from "./LoginEmployer";

export default function AuthPage() {
  const { mode, role } = useParams();

  // Default → login/jobseeker
  const finalMode = mode || "login";
  const finalRole = role || "jobseeker";

  if (finalMode === "register" && finalRole === "jobseeker") {
    return <SignupJobseeker />;
  }

  if (finalMode === "register" && finalRole === "employer") {
    return <SignupEmployer />;
  }

  if (finalMode === "login" && finalRole === "jobseeker") {
    return <LoginJobseeker />;
  }

  if (finalMode === "login" && finalRole === "employer") {
    return <LoginEmployer />;
  }

  return <div className="text-center p-10 text-red-500">Invalid route</div>;
}
