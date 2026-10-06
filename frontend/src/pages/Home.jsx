import HeroBanner from '../components/HeroBanner';
import FeatureBooks from '../components/FeatureBooks';
import { Link } from 'react-router';

const Home = () => {
    return (
        <div className="overflow-hidden">
            <HeroBanner />
            <section className="mx-auto grid max-w-6xl gap-4 px-4 py-10 sm:grid-cols-3">
                {[
                    ['01', 'Discover', 'Search the catalogue by title, author, or category.'],
                    ['02', 'Reserve', 'Hold an available copy before you visit the library.'],
                    ['03', 'Keep track', 'See reservations, due dates, and fines in one place.'],
                ].map(([number, title, text]) => (
                    <article key={title} className="rounded-box border border-base-300 bg-base-100 p-5 shadow-sm">
                        <span className="text-sm font-semibold text-accent">{number}</span>
                        <h2 className="mt-3 font-display text-2xl">{title}</h2>
                        <p className="mt-2 text-sm leading-6 text-base-content/65">{text}</p>
                    </article>
                ))}
            </section>
            <FeatureBooks />
            <section className="mx-4 mb-16 rounded-box bg-primary px-6 py-12 text-center text-primary-content sm:mx-auto sm:max-w-6xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-content/70">A calmer way to borrow</p>
                <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl sm:text-4xl">Your next great read is waiting on the shelf.</h2>
                <Link to="/books" className="btn btn-accent mt-6">Explore the catalogue</Link>
            </section>
        </div>
    );
};

export default Home;