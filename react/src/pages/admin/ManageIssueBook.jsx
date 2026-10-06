import React, { useContext, useState } from "react";

import { baseUrl } from "../../services/BaseUrl";
import { AuthContext } from "../../context/AuthProvider";
import toast from "react-hot-toast";

const ManageIssueBook = () => {
  const { accessToken } = useContext(AuthContext);

  const [issueId, setIssueId] = useState("");
  const [payReturnIssueId, setPayReturnIssueId] = useState("");

  const [loading, setLoading] = useState(false);

  const handleReturnBook = async (e) => {
    e.preventDefault();

    if (!issueId) return;

    try {
      setLoading(true);

      const res = await fetch(`${baseUrl}/admin/return_book/${issueId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Something went wrong");
      }

      toast.success(data.message);

      setIssueId("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Issues</h1>

        <p className="text-gray-500 mt-2">
          Manage book returns and fine payments efficiently.
        </p>
      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Normal Return */}

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-900">Return Book</h2>

            <p className="text-sm text-gray-500 mt-1">
              Enter issue ID to return a borrowed book.
            </p>
          </div>

          <form onSubmit={handleReturnBook}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue ID
            </label>

            <input
              type="number"
              value={issueId}
              onChange={(e) => setIssueId(e.target.value)}
              placeholder="Enter Issue ID"
              min="1"
              required
              className="
                w-full 
                border 
                border-gray-300 
                rounded-xl 
                px-4 
                py-3
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />

            <button
              type="submit"
              disabled={loading}
              className="
                w-full 
                mt-5
                bg-blue-600
                text-white
                py-3
                rounded-xl
                font-medium
                hover:bg-blue-700
                transition
                disabled:opacity-50
              "
            >
              {loading ? "Returning..." : "Return Book"}
            </button>
          </form>
        </div>

        {/* Fine Return */}

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Return With Fine
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Return a book after fine payment.
            </p>
          </div>

          <form>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue ID
            </label>

            <input
              type="number"
              value={payReturnIssueId}
              onChange={(e) => setPayReturnIssueId(e.target.value)}
              placeholder="Enter Issue ID"
              min="1"
              required
              className="
                w-full
                border
                border-gray-300
                rounded-xl
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-green-500
              "
            />

            <button
              type="submit"
              className="
                w-full
                mt-5
                bg-green-600
                text-white
                py-3
                rounded-xl
                font-medium
                hover:bg-green-700
                transition
              "
            >
              Return & Pay Fine
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManageIssueBook;
