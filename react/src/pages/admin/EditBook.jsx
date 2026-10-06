import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { baseUrl } from "../../services/BaseUrl";
import { AuthContext } from "../../context/AuthProvider";
import toast from "react-hot-toast";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  const [bookDetails, setBookDetails] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    price: 0,
    total_copies: 0,
    available_copies: 0,
  });

  // Get single book details

  useEffect(() => {
    if (!id) return;

    fetch(`${baseUrl}/books/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch book");
        }

        return res.json();
      })

      .then((data) => {
        setBookDetails(data);
      })

      .catch((err) => {
        console.log(err);
      });
  }, [id, accessToken]);

  // Handle input change

  const handleChange = (e) => {
    const { name, value } = e.target;

    setBookDetails({
      ...bookDetails,

      [name]:
        name === "price" ||
        name === "total_copies" ||
        name === "available_copies"
          ? Number(value)
          : value,
    });
  };

  // Update book

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${baseUrl}/admin/update_book/${id}`,

        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${accessToken}`,

            "Content-Type": "application/json",
          },

          body: JSON.stringify(bookDetails),
        },
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Book updated successfully");

        navigate("/admin/manage-book");
      } else {
        toast.error(data.detail || "Update failed");
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Book</h1>

        <button
          type="button"
          onClick={() => navigate("/admin/manage-book")}
          className="bg-red-500 text-white px-5 py-2 rounded"
        >
          Cancel
        </button>
      </div>

      <div className="bg-white shadow rounded-xl p-8 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={bookDetails?.title}
            onChange={handleChange}
            placeholder="Book Title"
            className="border p-3 w-full rounded"
            required
          />

          <input
            type="text"
            name="author"
            value={bookDetails?.author}
            onChange={handleChange}
            placeholder="Author Name"
            className="border p-3 w-full rounded"
            required
          />

          <input
            type="text"
            name="category"
            value={bookDetails?.category}
            onChange={handleChange}
            placeholder="Category"
            className="border p-3 w-full rounded"
            required
          />

          <textarea
            name="description"
            value={bookDetails?.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-3 w-full rounded"
            rows="4"
          />

          <input
            type="number"
            name="price"
            value={bookDetails?.price}
            onChange={handleChange}
            placeholder="Price"
            className="border p-3 w-full rounded"
          />

          <input
            type="number"
            name="total_copies"
            value={bookDetails?.total_copies}
            onChange={handleChange}
            placeholder="Total Copies"
            className="border p-3 w-full rounded"
          />

          <input
            type="number"
            name="available_copies"
            value={bookDetails?.available_copies}
            onChange={handleChange}
            placeholder="Available Copies"
            className="border p-3 w-full rounded"
          />

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded w-full"
          >
            Update Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBook;
