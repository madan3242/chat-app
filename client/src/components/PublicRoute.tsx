import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = useAuth();

  if (token || user?._id) return <Navigate to={"/chat"} replace />;

  return children;
};

export default PublicRoute;
