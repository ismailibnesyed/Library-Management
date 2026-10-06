import { FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router";

const BookCard = ({ book }) => (
  <article className="book-card">
    <div className="book-cover">
      <span className="cover-category">{book.category || "Featured"}</span>
      <div className="cover-title">{book.title}</div>
      <div className="cover-author">{book.author}</div>
      <span className="cover-number">0{(book.id % 9) + 1}</span>
    </div>
    <div className="book-card-body">
      <div>
        <h3>{book.title}</h3>
        <p>by {book.author}</p>
      </div>
      <span className={`availability ${book.available_copies > 0 ? "available" : "unavailable"}`}>
        {book.available_copies > 0 ? `${book.available_copies} available` : "Unavailable"}
      </span>
    </div>
    <Link className="card-link" to={`/books/${book.id}`}>View details <FiArrowUpRight /></Link>
  </article>
);

export default BookCard;
