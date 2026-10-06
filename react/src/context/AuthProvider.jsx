import { createContext, useEffect, useState } from "react";
import { baseUrl } from "../services/BaseUrl";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("lm_token"));

  const fetchUser = async () => {
    if (!accessToken) {
      setAuthUser(null);
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${baseUrl}/user`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error("Session expired");
      setAuthUser(await response.json());
    } catch {
      localStorage.removeItem("lm_token");
      setAccessToken(null);
      setAuthUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [accessToken]);

  const logout = () => {
    localStorage.removeItem("lm_token");
    setAccessToken(null);
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, accessToken, setAccessToken, logout, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
