import React, { useContext, useEffect, useState } from "react";
import { baseUrl } from "../services/BaseUrl";
import { AuthContext } from "../context/AuthProvider";
import toast from "react-hot-toast";

const MyReserve = () => {
  const [myReserve, setMyReserve] = useState([]);
  const { accessToken } = useContext(AuthContext);

  const fetchReservation = async () => {
    try {
      const res = await fetch(`${baseUrl}/reserve/my`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      setMyReserve(
        Array.isArray(data)
          ? data.filter((reserve) => reserve.status !== "cancelled")
          : [],
      );
    } catch (err) {
      console.log(err);
      setMyReserve([]);
    }
  };

  const cancelReservation = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/reserve/cancel/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      toast.success(data.message);
      fetchReservation();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchReservation();
    }
  }, [accessToken]);

  return (
    <div className="max-w-5xl mx-auto mt-10 px-5">
      <h1 className="text-3xl font-bold mb-6">My Reserved Books</h1>
      {myReserve.length === 0 ? (
        <p className="text-gray-500">No reservation found</p>
      ) : (
        <div className="grid gap-5">
          {myReserve.map((reserve) => (
            <div
              key={reserve.id}
              className="bg-white shadow-lg rounded-xl p-6 border"
            >
              <h2 className="text-xl font-bold mb-4">Reservation Details</h2>
              <div className="space-y-3">
                <p>
                  <span className="font-semibold">Reservation ID:</span>{" "}
                  {reserve.id}
                </p>
                <p>
                  <span className="font-semibold">Book ID:</span>{" "}
                  {reserve.book_id}
                </p>
                <p>
                  <span className="font-semibold">User ID:</span>{" "}
                  {reserve.user_id}
                </p>
                <p>
                  <span className="font-semibold">Reservation Date:</span>{" "}
                  {new Date(reserve.reservation_date).toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      reserve.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : reserve.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {reserve.status}
                  </span>
                </p>
              </div>
              <button
                onClick={() => cancelReservation(reserve.id)}
                className="mt-5 px-5 py-2 cursor-pointer bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Cancel Reservation
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReserve;
