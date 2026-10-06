import { useCallback, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { baseUrl } from '../services/BaseUrl';
import { AuthContext } from '../context/AuthProvider';

const emptyBook = { title: '', author: '', category: '', description: '', price: '', total_copies: 1 };

const Dashboard = () => {
    const { accessToken, authUser } = useContext(AuthContext);
    const [books, setBooks] = useState([]);
    const [form, setForm] = useState(emptyBook);
    const [busy, setBusy] = useState(false);
    const headers = { Authorization: `Bearer ${accessToken}` };

    const load = useCallback(() => {
        fetch(`${baseUrl}/books/all`).then(r => r.ok ? r.json() : Promise.reject())
            .then(setBooks).catch(() => toast.error("Couldn't load the inventory."));
    }, []);

    useEffect(() => { load(); }, [load]);

    const update = key => e => setForm(current => ({ ...current, [key]: e.target.value }));
    const addBook = async e => {
        e.preventDefault();
        setBusy(true);
        try {
            const response = await fetch(`${baseUrl}/admin/create_book`, {
                method: 'POST',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, price: Number(form.price) || 0, total_copies: Number(form.total_copies) || 1 }),
            });
            if (!response.ok) throw new Error();
            setForm(emptyBook);
            toast.success('Book added to the catalogue.');
            load();
        } catch { toast.error("Couldn't add the book. Check your permissions."); }
        finally { setBusy(false); }
    };

    const removeBook = async id => {
        if (!window.confirm('Delete this book from the catalogue?')) return;
        try {
            const response = await fetch(`${baseUrl}/admin/delete_book/${id}`, { method: 'DELETE', headers });
            if (!response.ok) throw new Error();
            setBooks(current => current.filter(book => book.id !== id));
            toast.success('Book deleted.');
        } catch { toast.error("Couldn't delete this book."); }
    };

    return (
        <main className="mx-auto max-w-6xl px-4 py-10">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-primary">{authUser.role}</p>
                    <h1 className="font-display text-4xl">Library dashboard</h1>
                    <p className="mt-1 text-base-content/65">Manage the catalogue from one simple workspace.</p>
                </div>
                <div className="stat rounded-box bg-base-100 shadow-sm">
                    <div className="stat-title">Total books</div>
                    <div className="stat-value text-primary">{books.length}</div>
                </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
                <form onSubmit={addBook} className="card h-fit bg-base-100 shadow-sm">
                    <div className="card-body gap-3">
                        <h2 className="font-display text-2xl">Add a book</h2>
                        {[
                            ['title', 'Title'], ['author', 'Author'], ['category', 'Category'],
                        ].map(([key, label]) => <input key={key} required value={form[key]} onChange={update(key)} className="input w-full" placeholder={label} />)}
                        <textarea value={form.description} onChange={update('description')} className="textarea w-full" placeholder="Short description" />
                        <div className="grid grid-cols-2 gap-3">
                            <input type="number" min="0" step="0.01" value={form.price} onChange={update('price')} className="input w-full" placeholder="Price" />
                            <input type="number" min="1" value={form.total_copies} onChange={update('total_copies')} className="input w-full" placeholder="Copies" />
                        </div>
                        <button type="submit" disabled={busy} className="btn btn-primary">{busy ? <span className="loading loading-spinner" /> : 'Add book'}</button>
                    </div>
                </form>

                <section className="rounded-box bg-base-100 p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="font-display text-2xl">Inventory</h2>
                        <button onClick={load} className="btn btn-ghost btn-sm">Refresh</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead><tr><th>Book</th><th>Available</th><th /></tr></thead>
                            <tbody>{books.map(book => <tr key={book.id}>
                                <td><div className="font-semibold">{book.title}</div><div className="text-xs opacity-60">{book.author}</div></td>
                                <td>{book.available_copies}/{book.total_copies}</td>
                                <td><button onClick={() => removeBook(book.id)} className="btn btn-error btn-outline btn-xs">Delete</button></td>
                            </tr>)}</tbody>
                        </table>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Dashboard;
