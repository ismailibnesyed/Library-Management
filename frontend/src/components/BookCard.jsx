import { Link } from 'react-router';

const BookCard = ({ book }) => {
    const out = book.available_copies <= 0;
    return (
        <Link to={`/books/${book.id}`} className="group card overflow-hidden border border-base-300 bg-base-100 transition hover:-translate-y-1 hover:shadow-lg">
            <figure className="relative aspect-[3/4] bg-primary text-primary-content">
                {book.cover_image ? (
                    <img src={book.cover_image} alt={`Cover of ${book.title}`} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                    <div className="flex flex-col items-center">
                        <span className="font-display text-7xl">{book.title?.charAt(0)}</span>
                        <span className="mt-2 text-sm opacity-80">{book.category}</span>
                    </div>
                )}
                <span className={`badge absolute left-3 top-3 ${out ? 'badge-neutral' : 'badge-success'}`}>
                    {out ? 'All copies out' : `${book.available_copies} available`}
                </span>
            </figure>
            <div className="card-body gap-1 p-4">
                <p className="text-xs text-base-content/60">{book.category}</p>
                <h2 className="line-clamp-2 font-display text-lg leading-snug group-hover:text-primary">{book.title}</h2>
                <p className="text-sm text-base-content/70">{book.author}</p>
                <p className="mt-2 font-semibold">৳{book.price}</p>
            </div>
        </Link>
    );
};

export default BookCard;
