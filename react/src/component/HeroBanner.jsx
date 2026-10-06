import { FiArrowRight, FiBookOpen, FiSearch } from "react-icons/fi";
import { Link } from "react-router";

const HeroBanner = () => (
  <section className="hero-section">
    <div className="container-wide hero-grid">
      <div className="hero-copy">
        <span className="eyebrow">A better way to read</span>
        <h1>Find your next <em>great story.</em></h1>
        <p>Explore a thoughtfully curated collection, keep your reading life organized, and always know what to pick up next.</p>
        <div className="hero-actions">
          <Link className="btn-primary-custom" to="/books">Explore the collection <FiArrowRight /></Link>
          <Link className="btn-secondary-custom" to="/signup">Join the library</Link>
        </div>
        <div className="hero-proof">
          <div className="proof-avatars"><span>R</span><span>A</span><span>M</span><span>+</span></div>
          <span>Beloved by curious readers everywhere</span>
        </div>
      </div>
      <div className="hero-art" aria-label="A stack of books">
        <div className="art-glow"></div>
        <div className="book-stack">
          <div className="book book-one"><FiBookOpen /><strong>THE<br />QUIET<br />HOUR</strong></div>
          <div className="book book-two"><FiSearch /><strong>WAYS<br />OF<br />SEEING</strong></div>
          <div className="book book-three"><strong>THE<br />GARDEN<br />WITHIN</strong></div>
        </div>
        <div className="art-note"><span>✦</span> Take a moment.<br />Stay a while.</div>
      </div>
    </div>
  </section>
);

export default HeroBanner;
