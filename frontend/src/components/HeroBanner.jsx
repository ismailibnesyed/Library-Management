import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

const HeroBanner = () => {
    const [q, setQ] = useState('');
    const navigate = useNavigate();
    const go = (e) => { e.preventDefault(); navigate(q.trim() ? `/books?q=${encodeURIComponent(q.trim())}` : '/books'); };

    return (
        <section
            className="relative flex min-h-[460px] items-center bg-cover bg-center"
            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1694730750153-8b66cf3dd014?q=80&w=1170&auto=format&fit=crop)" }}
        >
            <div className="absolute inset-0 bg-secondary/80" />
            <div className="relative mx-auto w-full max-w-6xl px-4 py-20 text-white">
                <h1 className="max-w-2xl font-display text-4xl leading-tight md:text-6xl">Find your next read and hold a copy before you arrive.</h1>
                <p className="mt-4 max-w-xl text-white/80">See what is on the shelf right now, reserve in one tap, and keep track of your loans and due dates.</p>
                <form onSubmit={go} className="join mt-8 w-full max-w-xl">
                    <input value={q} onChange={e => setQ(e.target.value)} aria-label="Search books" className="input join-item flex-1 text-base-content" placeholder="Search by title or author" />
                    <button className="btn btn-accent join-item">Search</button>
                </form>
                <Link to="/books" className="link mt-4 inline-block text-white/90">Browse all books</Link>
            </div>
        </section>
    );
};

export default HeroBanner;
