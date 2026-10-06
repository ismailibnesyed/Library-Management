import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import useBooks from '../hooks/useBooks';
import BookGrid from '../components/BookGrid';

const sorts = {
    new: (a, b) => b.id - a.id,
    title: (a, b) => a.title.localeCompare(b.title),
    low: (a, b) => a.price - b.price,
    high: (a, b) => b.price - a.price,
};

const BrowseBooks = () => {
    const { books, loading, error, reload } = useBooks();
    const [params] = useSearchParams();
    const [q, setQ] = useState(params.get('q') || '');
    const [cat, setCat] = useState('All');
    const [avail, setAvail] = useState(false);
    const [sort, setSort] = useState('new');

    const cats = useMemo(() => ['All', ...new Set(books.map(b => b.category).filter(Boolean))], [books]);
    const shown = useMemo(() => {
        const t = q.trim().toLowerCase();
        return books
            .filter(b => (cat === 'All' || b.category === cat)
                && (!avail || b.available_copies > 0)
                && (!t || `${b.title} ${b.author}`.toLowerCase().includes(t)))
            .sort(sorts[sort]);
    }, [books, q, cat, avail, sort]);

    const reset = () => { setQ(''); setCat('All'); setAvail(false); setSort('new'); };
    const hasFilters = q.trim() || cat !== 'All' || avail || sort !== 'new';

    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <h1 className="font-display text-4xl">Browse books</h1>
            <p className="mt-1 text-base-content/60">{loading ? 'Loading the shelves...' : `${shown.length} of ${books.length} books`}</p>

            <div className="mt-6 flex flex-col gap-3 md:flex-row">
                <label className="input w-full md:flex-1">
                    <svg className="h-4 w-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
                    <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search by title or author" />
                </label>
                <select value={sort} onChange={e => setSort(e.target.value)} className="select w-full md:w-52" aria-label="Sort books">
                    <option value="new">Newest first</option>
                    <option value="title">Title A to Z</option>
                    <option value="low">Price: low to high</option>
                    <option value="high">Price: high to low</option>
                </select>
                <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap px-1">
                    <input type="checkbox" className="toggle toggle-primary" checked={avail} onChange={e => setAvail(e.target.checked)} />
                    <span className="text-sm">Available now</span>
                </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
                {cats.map(c => (
                    <button key={c} onClick={() => setCat(c)} className={`btn btn-sm ${cat === c ? 'btn-primary' : 'btn-outline border-base-300'}`}>{c}</button>
                ))}
                {hasFilters && <button onClick={reset} className="btn btn-ghost btn-sm ml-1">Clear all</button>}
            </div>

            <div className="mt-8">
                {error ? (
                    <div className="rounded-box bg-base-100 p-10 text-center">
                        <p className="font-semibold">We couldn't reach the library.</p>
                        <p className="mt-1 text-sm text-base-content/60">The server may be waking up. Wait a few seconds and try again.</p>
                        <button onClick={reload} className="btn btn-primary mt-4">Try again</button>
                    </div>
                ) : !loading && shown.length === 0 ? (
                    <div className="rounded-box bg-base-100 p-10 text-center">
                        <p className="font-semibold">No books match your filters.</p>
                        <button onClick={reset} className="btn btn-primary mt-4">Clear filters</button>
                    </div>
                ) : (
                    <BookGrid books={shown} loading={loading} />
                )}
            </div>
        </div>
    );
};

export default BrowseBooks;
