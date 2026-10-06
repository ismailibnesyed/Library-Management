import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import toast from 'react-hot-toast';
import { baseUrl } from '../services/BaseUrl';
import { AuthContext } from '../context/AuthProvider';
import useBooks from '../hooks/useBooks';

const fmt = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
const badge = { pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-error' };
const FINE_PER_DAY = 20; // same rate the library charges on return

const Thumb = ({ book }) => (
    <div className="flex h-24 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary font-display text-2xl text-primary-content">
        {book?.cover_image ? <img src={book.cover_image} alt="" className="h-full w-full object-cover" /> : book?.title?.charAt(0) || '?'}
    </div>
);

const MyReserve = () => {
    const { accessToken } = useContext(AuthContext);
    const { books } = useBooks();
    const [tab, setTab] = useState('reserved');
    const [reservations, setReservations] = useState(null);
    const [issues, setIssues] = useState(null);
    const [target, setTarget] = useState(null);
    const [busy, setBusy] = useState(false);
    const dialog = useRef(null);
    const headers = { Authorization: `Bearer ${accessToken}` };
    const byId = useMemo(() => Object.fromEntries(books.map(b => [b.id, b])), [books]);

    useEffect(() => {
        if (!accessToken) return;
        Promise.all([fetch(`${baseUrl}/reserve/my`, { headers }), fetch(`${baseUrl}/issues/my`, { headers })])
            .then(rs => Promise.all(rs.map(r => r.ok ? r.json() : [])))
            .then(([a, b]) => { setReservations(a); setIssues(b); })
            .catch(() => { setReservations([]); setIssues([]); toast.error("Couldn't load your books. Refresh to try again."); });
    }, [accessToken]);

    const ask = (r) => { setTarget(r); dialog.current.showModal(); };
    const cancel = async () => {
        setBusy(true);
        try {
            const r = await fetch(`${baseUrl}/reserve/cancel/${target.id}`, { method: 'DELETE', headers });
            if (!r.ok) throw new Error();
            setReservations(l => l.filter(x => x.id !== target.id));
            toast.success('Reservation cancelled.');
        } catch { toast.error("Couldn't cancel. Please try again."); }
        finally { setBusy(false); dialog.current.close(); setTarget(null); }
    };

    const loading = reservations === null;
    const empty = (text, cta) => (
        <div className="rounded-box bg-base-100 p-10 text-center">
            <p className="font-semibold">{text}</p>
            <Link to="/books" className="btn btn-primary mt-4">{cta}</Link>
        </div>
    );

    return (
        <div className="mx-auto max-w-4xl px-4 py-10">
            <h1 className="font-display text-4xl">My books</h1>
            <div role="tablist" className="tabs tabs-border mt-4">
                <button role="tab" className={`tab ${tab === 'reserved' ? 'tab-active' : ''}`} onClick={() => setTab('reserved')}>Reservations {reservations && `(${reservations.length})`}</button>
                <button role="tab" className={`tab ${tab === 'borrowed' ? 'tab-active' : ''}`} onClick={() => setTab('borrowed')}>Borrowed {issues && `(${issues.length})`}</button>
            </div>

            <div className="mt-6 space-y-4">
                {loading && [0, 1, 2].map(i => <div key={i} className="skeleton h-32 w-full" />)}

                {!loading && tab === 'reserved' && (reservations.length === 0
                    ? empty("You haven't reserved any books yet.", 'Find a book')
                    : reservations.map(r => {
                        const b = byId[r.book_id];
                        return (
                            <div key={r.id} className="flex gap-4 rounded-box bg-base-100 p-4 shadow-sm">
                                <Thumb book={b} />
                                <div className="flex-1">
                                    <Link to={`/books/${r.book_id}`} className="font-display text-xl hover:text-primary">{b?.title || `Book #${r.book_id}`}</Link>
                                    {b && <p className="text-sm text-base-content/60">by {b.author}</p>}
                                    <p className="mt-2 text-sm text-base-content/60">Reserved on {fmt(r.reservation_date)}</p>
                                    <span className={`badge badge-sm mt-2 capitalize ${badge[r.status?.toLowerCase()] || 'badge-info'}`}>{r.status}</span>
                                </div>
                                {r.status === 'pending' && <button onClick={() => ask(r)} className="btn btn-outline btn-error btn-sm self-start">Cancel</button>}
                            </div>
                        );
                    }))}

                {!loading && tab === 'borrowed' && (issues.length === 0
                    ? empty('Nothing borrowed right now.', 'Browse books')
                    : issues.map(i => {
                        const b = byId[i.book_id];
                        const left = Math.ceil((new Date(i.due_date) - new Date()) / 864e5);
                        const late = left < 0;
                        return (
                            <div key={i.id} className="flex gap-4 rounded-box bg-base-100 p-4 shadow-sm">
                                <Thumb book={b} />
                                <div className="flex-1">
                                    <Link to={`/books/${i.book_id}`} className="font-display text-xl hover:text-primary">{b?.title || `Book #${i.book_id}`}</Link>
                                    <p className="mt-2 text-sm text-base-content/60">Borrowed {fmt(i.issue_date)}, due {fmt(i.due_date)}</p>
                                    <span className={`badge badge-sm mt-2 ${late ? 'badge-error' : left <= 3 ? 'badge-warning' : 'badge-success'}`}>
                                        {late ? `${-left} days overdue` : left === 0 ? 'Due today' : `${left} days left`}
                                    </span>
                                    {late && <p className="mt-2 text-sm text-error">Estimated fine if returned today: ৳{-left * FINE_PER_DAY}</p>}
                                </div>
                            </div>
                        );
                    }))}
            </div>

            <dialog ref={dialog} className="modal" onClose={() => setTarget(null)}>
                <div className="modal-box">
                    <h3 className="font-display text-2xl">Cancel this reservation?</h3>
                    <p className="py-3 text-base-content/70">{byId[target?.book_id]?.title || 'This book'} will go back on the shelf for others.</p>
                    <div className="modal-action">
                        <form method="dialog"><button className="btn btn-ghost">Keep it</button></form>
                        <button onClick={cancel} disabled={busy} className="btn btn-error">{busy ? <span className="loading loading-spinner" /> : 'Cancel reservation'}</button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop"><button>close</button></form>
            </dialog>
        </div>
    );
};

export default MyReserve;
