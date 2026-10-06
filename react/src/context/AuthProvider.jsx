import React, { createContext, useEffect, useState } from "react";
import { baseUrl } from "../services/BaseUrl";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem("lm_token");
  //   console.log(accessToken);

  const fetchUser = async () => {
    const userRes = await fetch(`${baseUrl}/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = await userRes.json();
    setAuthUser(userData);
    setLoading(false)
  };

  useEffect(() => {
    if (!accessToken) {
      setAuthUser(null);
      setLoading(false)
      return;
    }

    fetchUser();
  }, [accessToken]);

  const logout = () => {
    localStorage.removeItem("lm_token");
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ authUser, setAuthUser, accessToken, logout, loading, fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
