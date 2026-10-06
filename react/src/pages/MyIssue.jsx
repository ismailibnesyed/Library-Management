import React, { useContext, useEffect, useState } from "react";

import { baseUrl } from "../services/BaseUrl";
import { AuthContext } from "../context/AuthProvider";

const MyIssue = () => {
  const { accessToken } = useContext(AuthContext);

  const [myIssues, setMyIssues] = useState([]);

  useEffect(() => {
    fetch(`${baseUrl}/issues/my`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setMyIssues(data))
      .catch((err) => console.log(err));
  }, [accessToken]);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">My Issued Books</h1>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 bg-white shadow rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-3">ID</th>
              <th className="border p-3">User ID</th>
              <th className="border p-3">Book ID</th>
              <th className="border p-3">Issue Date</th>
              <th className="border p-3">Due Date</th>
              <th className="border p-3">Status</th>
              <th className="border p-3">Fine Amount</th>
              <th className="border p-3">Fine Paid</th>
            </tr>
          </thead>

          <tbody>
            {myIssues.map((issue) => (
              <tr key={issue.id}>
                <td className="border p-3 text-center">{issue.id}</td>

                <td className="border p-3 text-center">{issue.user_id}</td>
                <td className="border p-3 text-center">{issue.book_id}</td>

                <td className="border p-3 text-center">
                  {new Date(issue.issue_date).toLocaleDateString()}
                </td>

                <td className="border p-3 text-center">
                  {new Date(issue.due_date).toLocaleDateString()}
                </td>

                <td className="border p-3 text-center">{issue.status}</td>

                <td className="border p-3 text-center">{issue.fine_amount}</td>

                <td className="border p-3 text-center">
                  {issue.fine_paid ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyIssue;
