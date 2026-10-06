import React, { useContext, useEffect, useState } from "react";

import { baseUrl } from "../../services/BaseUrl";
import { AuthContext } from "../../context/AuthProvider";

import toast from "react-hot-toast";
import { Link } from "react-router";

const ManageBook = () => {
  const [openModal, setOpenModal] = useState(false);

  const { accessToken } = useContext(AuthContext);

  const [books, setBooks] = useState([]);

  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    price: 0,
    total_copies: 1,
  });

  // Get all books

  const fetchBooks = async () => {
    try {
      const res = await fetch(`${baseUrl}/books/all`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data = await res.json();

      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Could not load books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [accessToken]);

  const deleteBook = async (id)=>{
    const res = await fetch(`${baseUrl}/admin/delete_book/${id}`,{
        method:"DELETE",
        headers:{
            Authorization: `Bearer ${accessToken}`

        }
    })
    const data = await res.json()
    toast.success(data.message)
    fetchBooks()
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setBookData({
      ...bookData,

      [name]:
        name === "price" || name === "total_copies" ? Number(value) : value,
    });
  };

  // Create book

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${baseUrl}/admin/create_book`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,

          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Book created successfully");
        setOpenModal(false);
        setBookData({
          title: "",
          author: "",
          category: "",
          description: "",
          price: 0,
          total_copies: 1,
        });

        // refresh book list

        fetchBooks();
      } else {
        toast.error(data.detail || "Failed to create book");
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-5">Manage Book</h1>

      <button
        onClick={() => setOpenModal(true)}
        className="bg-blue-600 text-white px-5 py-3 rounded-lg"
      >
        Add Book
      </button>
      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Author</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Total Copies</th>
              <th className="border px-4 py-2">Available Copies</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td className="border px-4 py-2">{book.id}</td>
                <td className="border px-4 py-2">{book.title}</td>
                <td className="border px-4 py-2">{book.author}</td>
                <td className="border px-4 py-2">{book.category}</td>
                <td className="border px-4 py-2">{book.description}</td>
                <td className="border px-4 py-2">{book.price}</td>
                <td className="border px-4 py-2">{book.total_copies}</td>
                <td className="border px-4 py-2">{book.available_copies}</td>
                <td className="border px-4 py-2">
                  <Link
                    to={`/admin/edit/book/${book.id}`}
                    className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </Link>

                  <button onClick={()=> deleteBook(book.id)} className="bg-red-600 text-white px-3 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-full max-w-lg rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-5">Add New Book</h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                value={bookData.title}
                onChange={handleChange}
                placeholder="Book Title"
                className="w-full border p-3 rounded mb-3"
                required
              />

              <input
                type="text"
                name="author"
                value={bookData.author}
                onChange={handleChange}
                placeholder="Author Name"
                className="w-full border p-3 rounded mb-3"
                required
              />

              <input
                type="text"
                name="category"
                value={bookData.category}
                onChange={handleChange}
                placeholder="Category"
                className="w-full border p-3 rounded mb-3"
                required
              />

              <textarea
                name="description"
                value={bookData.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border p-3 rounded mb-3"
              />

              <input
                type="number"
                name="price"
                value={bookData.price}
                onChange={handleChange}
                placeholder="Price"
                className="w-full border p-3 rounded mb-3"
              />

              <input
                type="number"
                name="total_copies"
                value={bookData.total_copies}
                onChange={handleChange}
                placeholder="Total Copies"
                className="w-full border p-3 rounded mb-5"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-5 py-2 rounded"
                >
                  Save Book
                </button>

                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="bg-red-500 text-white px-5 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBook;
