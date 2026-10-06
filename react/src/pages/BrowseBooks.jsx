import React, { useContext, useEffect, useState } from "react";
import { baseUrl } from "../services/BaseUrl";
import BookCard from "../component/BookCard";
import { AuthContext } from "../context/AuthProvider";

const BrowseBooks = () => {
  const {accessToken} = useContext(AuthContext)
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch(`${baseUrl}/books/all`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }
        return res.json();
      })

      .then((data) => setBooks(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Could not load books:", error));
  }, [accessToken]);

  return (
    <>
      <div className="grid grid-cols-3 gap-1 px-5 py-5">
        {books.map((book) => (
          <BookCard book={book} key={book.id}></BookCard>
        ))}
      </div>
    </>
  );
};

export default BrowseBooks;
