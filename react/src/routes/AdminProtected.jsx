import React, { useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../context/AuthProvider";

const AdminProtected = ({ children }) => {
  const { authUser } = useContext(AuthContext);
  // console.log("ADMIN USER:", authUser);
  if (!authUser) {
    return <Navigate to="/login" />;
  }

  if (authUser.role !== "librarian") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminProtected;
