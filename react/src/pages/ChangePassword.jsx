import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import toast from "react-hot-toast";
import { baseUrl } from "../services/BaseUrl";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { accessToken } = useContext(AuthContext);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const passwordData = {
      current_password: currentPassword,
      new_password: newPassword,
    };

    console.log(passwordData);

    const res = await fetch(`${baseUrl}/passwordchange`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(passwordData),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message);
      setCurrentPassword("");
      setNewPassword("");
    } else {
      toast.error(data.detail || "Password change failed. Enter Correct Password");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-10">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold mb-2">Change Password</h1>

        <p className="text-gray-500 mb-6">
          Update your account password securely.
        </p>

        <form onSubmit={handleChangePassword}>
          {/* Current Password */}
          <div className="mb-5">
            <label className="text-sm text-gray-600">Current Password</label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full mt-2 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* New Password */}
          <div className="mb-5">
            <label className="text-sm text-gray-600">New Password</label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full mt-2 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
