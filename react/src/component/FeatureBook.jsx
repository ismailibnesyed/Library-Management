import React, { useEffect, useState } from "react";
import { baseUrl } from "../services/BaseUrl";
import BookCard from "./BookCard";

const FeatureBook = () => {
  const [featureBooks, setFeatureBooks] = useState([]);

  useEffect(() => {
    fetch(`${baseUrl}/books/all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("lm_token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        return res.json();
      })

      .then((data) => setFeatureBooks(Array.isArray(data) ? data : []))

      .catch((error) => console.error("Could not load books:", error));
  }, []);

  // useEffect(() => {
  //   fetch(`${baseUrl}/books/all`)
  //     .then((res) => {
  //       if (!res.ok) {
  //         throw new Error(`Request failed: ${res.status}`);
  //       }
  //       return res.json();
  //     })
  //     .then((data) => setFeatureBooks(Array.isArray(data) ? data : []))
  //     .catch((error) => console.error("Could not load books:", error));
  // }, []);

  return (
    <>
      <h1 className="text-center text-4xl py-16 font-bold">
        Our Featured Book
      </h1>
      <div className="grid grid-cols-3">
        {featureBooks.slice(0, 3).map((book) => (
          <BookCard book={book} key={book.id}></BookCard>
        ))}
      </div>
    </>
  );
};

export default FeatureBook;
