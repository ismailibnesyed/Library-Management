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
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col text-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold">Sign Up now!</h1>
            <p className="py-6 w-100">Please fill the input correctly.</p>
          </div>

          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <fieldset className="fieldset">
                <label className="label">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="input"
                  placeholder="example@gmail.com"
                />
                <label className="label">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  className="input"
                  placeholder="Username"
                />
                <label className="label">First Name</label>
                <input
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  type="text"
                  className="input"
                  placeholder="First Name"
                />
                <label className="label">Last Name</label>
                <input
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  type="text"
                  className="input"
                  placeholder="Last Name"
                />
                <label className="label">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="input"
                  placeholder="Password"
                />
                <label className="label">Role</label>
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  type="text"
                  className="input"
                  placeholder="Role"
                />

                <div>
                  <Link to={"/login"} className="link link-hover">
                    Already have an account.
                  </Link>
                </div>
                
                {/* Sign Up Button */}
                <button onClick={handleSignup} className="btn cursor-pointer btn-neutral mt-4">
                  Sign Up
                </button>{" "}
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SIgnUp;
