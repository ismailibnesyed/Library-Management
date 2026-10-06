import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { baseUrl } from "../services/BaseUrl";
import { AuthContext } from "../context/AuthProvider";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { authUser, setAuthUser } = useContext(AuthContext);
  const naviagate = useNavigate();

  const handleLogin = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);
      // console.log(formData)

      const res = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Login failed: ${res.status}`);
      }

      const data = await res.json();
      // console.log(data);

      const accessToken = data?.access_token;

      localStorage.setItem("lm_token", accessToken);
      // setAuthUser(data);
      const userRes = await fetch(`${baseUrl}/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userData = await userRes.json();

      if (userData.id) {
        setAuthUser(userData);
        naviagate("/");
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(authUser);

  return (
    <div className="auth-page">
      <div className="auth-panel">
          <div className="auth-heading">
            <span className="eyebrow">Welcome back</span>
            <h1>Good to see you again.</h1>
            <p>Sign in to continue exploring your reading list.</p>
          </div>
          <div className="auth-card">
              <div className="auth-fields">
                <label htmlFor="login-username">Username</label>
                <input
                  id="login-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  placeholder="Username"
                />
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin} className="btn-primary-custom auth-submit">Sign in <span>→</span></button>
                <p className="auth-switch">New to Leaf &amp; Lore? <Link to="/signup">Create an account</Link></p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Login;
