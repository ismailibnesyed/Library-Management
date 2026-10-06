import { Link } from 'react-router';
import useBooks from '../hooks/useBooks';
import BookGrid from './BookGrid';

const FeatureBooks = () => {
    const { books, loading, error, reload } = useBooks();
    const latest = [...books].sort((a, b) => b.id - a.id).slice(0, 4);

    return (
        <section className="mx-auto max-w-6xl px-4 py-14">
            <div className="mb-6 flex items-end justify-between">
                <h2 className="font-display text-3xl">New on the shelves</h2>
                <Link to="/books" className="link link-primary">See all books</Link>
            </div>
            {error
                ? <div className="rounded-box bg-base-100 p-8 text-center">Couldn't load books. <button onClick={reload} className="link link-primary">Try again</button></div>
                : <BookGrid books={latest} loading={loading} count={4} />}
        </section>
    );
};

export default FeatureBooks;
