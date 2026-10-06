import { Link } from 'react-router';

const Footer = () => (
    <footer className="border-t border-base-300 bg-base-100">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
            <div>
                <p className="font-display text-2xl font-semibold text-primary">Leaf &amp; Lore</p>
                <p className="mt-1 text-sm text-base-content/60">Browse the shelves, reserve a copy, track your loans.</p>
            </div>
            <nav className="flex flex-col gap-2 text-sm" aria-label="Footer navigation">
                <span className="font-semibold">Explore</span>
                <Link to="/" className="link link-hover">Home</Link>
                <Link to="/books" className="link link-hover">Browse books</Link>
                <Link to="/reserve/my" className="link link-hover">My books</Link>
            </nav>
            <div className="text-sm text-base-content/65">
                <p className="font-semibold text-base-content">Library hours</p>
                <p className="mt-2">Sunday–Thursday · 9:00–18:00</p>
                <p>Friday–Saturday · 10:00–16:00</p>
            </div>
        </div>
        <div className="border-t border-base-300 px-4 py-4 text-center text-xs text-base-content/50">© {new Date().getFullYear()} Leaf &amp; Lore Library</div>
    </footer>
);

export default Footer;
