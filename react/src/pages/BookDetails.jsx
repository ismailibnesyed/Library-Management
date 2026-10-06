import React, { useCallback, useContext, useEffect, useState } from "react";
import { data, useParams } from "react-router";
import { baseUrl } from "../services/BaseUrl";
import { AuthContext } from "../context/AuthProvider";
import toast from "react-hot-toast";

const BookDetails = () => {
  const { id } = useParams();
  const [bookDetails, setBookDetails] = useState(null);
  const { accessToken } = useContext(AuthContext);

  //   console.log(accessToken);

  const handleReserve = async () => {
    try {
      const res = await fetch(`${baseUrl}/reserve/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if(data){
        toast.success(data.message)
      }
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    if (!id) return;

    fetch(`${baseUrl}/books/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setBookDetails(data))
      .catch((err) => console.log(err));
  }, [id, accessToken]);

//   console.log(bookDetails);

  return (
    <>
      {!bookDetails ? (
        <div className="text-center text-xl font-semibold mt-10">
          Loading...
        </div>
      ) : (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 flex gap-6">
          {/* Book Cover */}
          <div className="w-40 h-56 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
            {bookDetails.cover_image ? (
              <img
                src={bookDetails.cover_image}
                alt={bookDetails.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-sm">No Cover</span>
            )}
          </div>

          {/* Book Information */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{bookDetails.title}</h1>

            <p className="text-gray-600 mb-3">
              By <span className="font-semibold">{bookDetails.author}</span>
            </p>

            <div className="space-y-2">
              <p>
                <span className="font-semibold">Category:</span>{" "}
                {bookDetails.category}
              </p>

              <p>
                <span className="font-semibold">Price:</span> ৳
                {bookDetails.price}
              </p>

              <p>
                <span className="font-semibold">Available Copies:</span>{" "}
                {bookDetails.available_copies}/{bookDetails.total_copies}
              </p>

              <p className="mt-4 text-gray-700">{bookDetails.description}</p>
            </div>

            {/* Reserve Button */}
            <button
              onClick={handleReserve}
              disabled={bookDetails.available_copies === 0}
              className={`mt-6 cursor-pointer px-6 py-3 rounded-lg text-white font-semibold 
            ${
              bookDetails.available_copies > 0
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            >
              Reserve
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BookDetails;
