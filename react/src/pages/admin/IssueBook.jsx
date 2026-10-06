import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { baseUrl } from "../../services/BaseUrl";
import toast from "react-hot-toast";

const IssueBook = () => {
  const { accessToken } = useContext(AuthContext);

  const [bookId, setBookId] = useState("");
  const [userId, setUserId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      user_id: Number(userId),
      book_id: Number(bookId),
    };

    const res = await fetch(`${baseUrl}/admin/create_issue`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    toast.success(data.message);
  };

  
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Issue Book</h1>

      <div className="bg-white shadow rounded-xl p-8 max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-semibold">Book ID</label>

            <input
              type="number"
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              placeholder="Enter Book ID"
              className="w-full border p-3 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">User ID</label>

            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter User ID"
              className="w-full border p-3 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full"
          >
            Issue Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default IssueBook;
