import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import toast from 'react-hot-toast';
import { baseUrl } from '../services/BaseUrl';
import { AuthContext } from '../context/AuthProvider';

const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { authUser, accessToken } = useContext(AuthContext);
    const [book, setBook] = useState(null);
    const [status, setStatus] = useState('loading');
    const [reserved, setReserved] = useState(false);
    const [busy, setBusy] = useState(false);
    const headers = { Authorization: `Bearer ${accessToken}` };

    useEffect(() => {
        let off = false;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        setStatus('loading');
        // the single-book endpoint needs a login, so visitors fall back to the public list
        const viaList = () => fetch(`${baseUrl}/books/all`, { signal: controller.signal }).then(r => r.json()).then(l => l.find(b => String(b.id) === id));
        (accessToken ? fetch(`${baseUrl}/books/${id}`, { headers, signal: controller.signal }).then(r => r.ok ? r.json() : viaList()) : viaList())
            .then(b => { if (off) return; setBook(b || null); setStatus(b ? 'ok' : 'missing'); })
            .catch(() => { if (!off) setStatus('error'); });
        return () => { off = true; clearTimeout(timeout); controller.abort(); };
    }, [id, accessToken]);

    useEffect(() => {
        if (!accessToken) { setReserved(false); return; }
        fetch(`${baseUrl}/reserve/my`, { headers })
            .then(r => r.ok ? r.json() : [])
            .then(l => setReserved(l.some(x => String(x.book_id) === id)))
            .catch(() => { });
    }, [id, accessToken]);

    const reserve = async () => {
        if (!authUser) return navigate('/login', { state: { from: `/books/${id}` } });
        setBusy(true);
        try {
            const r = await fetch(`${baseUrl}/reserve/${id}`, { method: 'POST', headers });
            if (!r.ok) throw new Error();
            setReserved(true);
            toast.success('Reserved. You can track it in My books.');
        } catch { toast.error("Couldn't reserve this book. Please try again."); }
        finally { setBusy(false); }
    };

    if (status === 'loading') return (
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-[320px_1fr]">
            <div className="skeleton aspect-[3/4] w-full" />
            <div className="space-y-4"><div className="skeleton h-8 w-2/3" /><div className="skeleton h-5 w-1/3" /><div className="skeleton h-32 w-full" /></div>
        </div>
    );
    if (status !== 'ok') return (
        <div className="mx-auto max-w-md px-4 py-20 text-center">
            <p className="font-display text-2xl">{status === 'missing' ? "We couldn't find that book." : "Couldn't load this book."}</p>
            <Link to="/books" className="btn btn-primary mt-6">Back to all books</Link>
        </div>
    );

    const out = book.available_copies <= 0;
    const pct = book.total_copies ? Math.round((book.available_copies / book.total_copies) * 100) : 0;

    return (
        <div className="mx-auto max-w-5xl px-4 py-10">
            <Link to="/books" className="link link-hover text-sm text-base-content/60">Back to all books</Link>
            <div className="mt-4 grid gap-8 md:grid-cols-[320px_1fr]">
                <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-box bg-primary text-primary-content shadow-md">
                    {book.cover_image
                        ? <img src={book.cover_image} alt={`Cover of ${book.title}`} className="h-full w-full object-cover" />
                        : <span className="font-display text-8xl">{book.title?.charAt(0)}</span>}
                </div>

                <div className="rounded-box bg-base-100 p-6 md:p-8">
                    <span className="badge badge-outline badge-primary">{book.category}</span>
                    <h1 className="mt-3 font-display text-4xl leading-tight">{book.title}</h1>
                    <p className="mt-2 text-lg text-base-content/70">by {book.author}</p>
                    {book.description && <p className="mt-5 max-w-prose leading-7 text-base-content/80">{book.description}</p>}

                    <div className="mt-6">
                        <div className="mb-2 flex justify-between text-sm">
                            <span className={`font-semibold ${out ? 'text-error' : 'text-success'}`}>{out ? 'All copies are out' : `${book.available_copies} of ${book.total_copies} copies available`}</span>
                            <span className="font-semibold">৳{book.price}</span>
                        </div>
                        <progress className={`progress w-full ${out ? 'progress-error' : 'progress-success'}`} value={pct} max="100" aria-label="Copies available" />
                    </div>

                    {reserved ? (
                        <Link to="/reserve/my" className="btn btn-outline btn-success mt-6 w-full">You reserved this book. View it in My books</Link>
                    ) : (
                        <button onClick={reserve} disabled={busy} className="btn btn-primary btn-lg mt-6 w-full">
                            {busy ? <span className="loading loading-spinner" /> : authUser ? 'Reserve this book' : 'Log in to reserve'}
                        </button>
                    )}
                    {out && !reserved && <p className="mt-2 text-sm text-base-content/60">Every copy is out right now, but you can still place a reservation.</p>}
                    <p className="mt-4 text-sm text-base-content/60">Loans run 14 days. Late returns are charged ৳20 per day.</p>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;
