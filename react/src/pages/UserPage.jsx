import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { baseUrl } from "../services/BaseUrl";
import toast from "react-hot-toast";

const UserPage = () => {
  const { authUser, accessToken } = useContext(AuthContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastname] = useState("");
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // Set backend user information as default input values
  useEffect(() => {
    if (authUser) {
      setFirstName(authUser.firstname || "");
      setLastname(authUser.lastname || "");
      setUsername(authUser.username || "");
      setEmail(authUser.email || "");
    }
  }, [authUser]);
  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = {
      firstname: firstName,
      lastname: lastName,
      username: userName,
      email: email,
    };

    console.log("Sending:", formData);

    try {
      const res = await fetch(`${baseUrl}/edituser`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Status:", res.status);

      const data = await res.json();

      console.log("Backend response:", data);

      if (!res.ok) {
        throw new Error(data.detail || "Update failed");
      }

      toast.success(data.message || "Profile updated");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold">My Profile</h1>

        <p className="text-gray-500 mb-8">
          Manage your personal information and account details.
        </p>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          {/* Profile Header */}
          <div className="h-36 bg-blue-600 flex items-center px-8 text-white">
            <div className="h-20 w-20 rounded-full bg-white/30 flex items-center justify-center text-3xl font-bold">
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </div>

            <div className="ml-6">
              <h2 className="text-2xl font-bold">
                {firstName} {lastName}
              </h2>

              <p>@{userName}</p>

              <div className="flex gap-3 mt-3">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {authUser?.role}
                </span>

                <span className="bg-green-400 px-3 py-1 rounded-full text-sm">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="p-8">
            <h2 className="text-xl font-bold">Personal Information</h2>

            <p className="text-gray-500 mb-6">
              Update the information associated with your account.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* First Name */}
              <div>
                <label className="text-sm text-gray-600">First Name</label>

                <input
                  type="text"
                  name="firstname"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="w-full mt-2 border rounded-lg p-3"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="text-sm text-gray-600">Last Name</label>

                <input
                  type="text"
                  name="lastname"
                  value={lastName}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="Last Name"
                  className="w-full mt-2 border rounded-lg p-3"
                />
              </div>

              {/* Username */}
              <div>
                <label className="text-sm text-gray-600">Username</label>

                <input
                  type="text"
                  name="username"
                  value={userName}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full mt-2 border rounded-lg p-3"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-gray-600">Email Address</label>

                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full mt-2 border rounded-lg p-3"
                />
              </div>
            </div>

            <button
              onClick={handleUpdate}
              className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
            >
              Save Changes
            </button>
          </div>

          {/* Account Information */}
          <div className="border-t p-8">
            <h2 className="text-xl font-bold mb-6">Account Information</h2>

            <div className="grid grid-cols-2">
              <div>
                <p className="text-gray-500">User ID</p>
                <p className="font-semibold">{authUser?.id}</p>
              </div>

              <div>
                <p className="text-gray-500">Account Role</p>
                <p className="font-semibold">{authUser?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
