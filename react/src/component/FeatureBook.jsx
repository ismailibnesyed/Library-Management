import { useContext, useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router";
import { baseUrl } from "../services/BaseUrl";
import { AuthContext } from "../context/AuthProvider";
import BookCard from "./BookCard";

const FeatureBook = () => {
  const { accessToken } = useContext(AuthContext);
  const [featureBooks, setFeatureBooks] = useState([]);

  useEffect(() => {
    fetch(`${baseUrl}/books/all`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setFeatureBooks(Array.isArray(data) ? data : []))
      .catch(() => setFeatureBooks([]));
  }, [accessToken]);

  return (
    <section className="featured-section">
      <div className="container-wide">
        <div className="featured-header">
          <div className="section-heading">
            <span className="eyebrow">Curated for you</span>
            <h2>Stories worth making time for.</h2>
            <p>Discover our handpicked selection of books, chosen to spark ideas and keep you turning pages.</p>
          </div>
          <Link className="text-link" to="/books">View all books <FiArrowRight /></Link>
        </div>
        <div className="book-grid">
          {featureBooks.slice(0, 3).map((book) => <BookCard book={book} key={book.id} />)}
          {!featureBooks.length && <div className="empty-state">Sign in to explore the library collection.</div>}
        </div>
      </div>
    </section>
  );
};

export default FeatureBook;
