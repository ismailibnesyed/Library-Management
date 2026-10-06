import React from "react";
import { Link } from "react-router";

const BookCard = ({ book }) => {
  return (
    <div className="card bg-base-100 w-96 shadow-md hover:shadow-xl transition-shadow duration-300">
      {/* Book Cover Placeholder */}
      <figure className="h-56 bg-linear-to-br from-slate-800 via-slate-700 to-blue-900 flex items-center justify-center">
        <div className="text-center text-white px-6">
          <div className="text-5xl mb-3">📖</div>

          <h2 className="text-2xl font-bold tracking-wide">{book.title}</h2>

          <p className="text-sm opacity-80 mt-2">{book.category}</p>
        </div>
      </figure>

      {/* Card Body */}
      <div className="card-body">
        {/* Title + Category */}
        <div>
          <h2 className="card-title text-xl">{book.title}</h2>

          <div className="badge badge-primary badge-outline mt-2">
            {book.category}
          </div>
        </div>

        {/* Author */}
        <p className="text-sm text-gray-500">
          By <span className="font-medium text-gray-700">{book.author}</span>
        </p>

        {/* Price + Availability */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-2xl font-bold text-primary">৳{book.price}</span>

          <span
            className={`badge ${
              book.available_copies > 0 ? "badge-success" : "badge-error"
            }`}
          >
            {book.available_copies > 0
              ? `${book.available_copies} available`
              : "Out of stock"}
          </span>
        </div>
        {/* Action */}
        <div className="card-actions justify-end mt-3 w-full">
          <Link to={`/books/${book.id}`}>
            <button className="btn btn-primary w-full cursor-pointer">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
