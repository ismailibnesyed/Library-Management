import BookCard from './BookCard';

const BookGrid = ({ books, loading, count = 8 }) => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
        {loading
            ? Array.from({ length: count }).map((_, i) => <div key={i} className="skeleton h-80 rounded-box" />)
            : books.map(b => <BookCard key={b.id} book={b} />)}
    </div>
);

export default BookGrid;
