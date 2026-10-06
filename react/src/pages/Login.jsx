import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { baseUrl } from "../services/BaseUrl";
import { AuthContext } from "../context/AuthProvider";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { setAuthUser, setAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      toast.error("Enter your username and password");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new URLSearchParams({ username, password });
      const response = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok || !data.access_token) {
        throw new Error(data.detail || "Invalid username or password");
      }

      const token = data.access_token;
      localStorage.setItem("lm_token", token);
      setAccessToken(token);
      const userResponse = await fetch(`${baseUrl}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await userResponse.json();
      if (!userResponse.ok || !user.id) throw new Error(user.detail || "Could not load your profile");
      setAuthUser(user);
      toast.success("Signed in successfully");
      navigate("/");
    } catch (error) {
      localStorage.removeItem("lm_token");
      setAccessToken(null);
      setAuthUser(null);
      toast.error(error.message || "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  };

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
            <input id="login-username" value={username} onChange={(event) => setUsername(event.target.value)} type="text" placeholder="Username" />
            <label htmlFor="login-password">Password</label>
            <input id="login-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
            <button onClick={handleLogin} disabled={submitting} className="btn-primary-custom auth-submit">
              {submitting ? "Signing in..." : <>Sign in <span>→</span></>}
            </button>
            <p className="auth-switch">New to Leaf &amp; Lore? <Link to="/signup">Create an account</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
