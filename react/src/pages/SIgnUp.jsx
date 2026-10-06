import { useState } from "react";
import { Link } from "react-router";
import { baseUrl } from "../services/BaseUrl";

const SIgnUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSignup = async () => {
    // e.preventDefault();

    const userData = {
      email,
      username,
      firstname,
      lastname,
      password,
      role,
    };

    const res = await fetch(`${baseUrl}/createuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    console.log(data);
  };

  return (
    <>
      <div className="auth-page">
        <div className="auth-panel auth-panel-wide">
          <div className="auth-heading">
            <span className="eyebrow">Join the community</span>
            <h1>Make space for more stories.</h1>
            <p>Create your account and start building a reading life you love.</p>
          </div>
          <div className="auth-card">
              <div className="auth-fields auth-fields-grid">
                <label htmlFor="signup-email">Email</label>
                <input
                  id="signup-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="example@gmail.com"
                />
                <label htmlFor="signup-username">Username</label>
                <input
                  id="signup-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  placeholder="Username"
                />
                <label htmlFor="signup-firstname">First name</label>
                <input
                  id="signup-firstname"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  type="text"
                  placeholder="First Name"
                />
                <label htmlFor="signup-lastname">Last name</label>
                <input
                  id="signup-lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  type="text"
                  placeholder="Last Name"
                />
                <label htmlFor="signup-password">Password</label>
                <input
                  id="signup-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                />
                <label htmlFor="signup-role">Role</label>
                <input
                  id="signup-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  type="text"
                  placeholder="Role"
                />
                <button onClick={handleSignup} className="btn-primary-custom auth-submit">Create account <span>→</span></button>
                <p className="auth-switch">Already a member? <Link to="/login">Sign in instead</Link></p>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SIgnUp;
