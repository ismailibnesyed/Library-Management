import { FiArrowUpRight, FiBookOpen, FiInstagram, FiTwitter } from "react-icons/fi";
import { Link } from "react-router";

const Footer = () => (
  <footer className="site-footer">
    <div className="container-wide footer-top">
      <div className="footer-brand">
        <Link className="brand" to="/"><span className="brand-mark"><FiBookOpen /></span>Leaf &amp; Lore</Link>
        <p>A calmer, more thoughtful way to discover and enjoy your next book.</p>
      </div>
      <div className="footer-links">
        <div><span>Explore</span><Link to="/books">Browse books</Link><Link to="/signup">Join the library</Link></div>
        <div><span>Connect</span><a href="mailto:hello@leafandlore.com">Contact us <FiArrowUpRight /></a><a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter <FiTwitter /></a><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram <FiInstagram /></a></div>
      </div>
    </div>
    <div className="container-wide footer-bottom"><span>© 2025 Leaf &amp; Lore Library</span><span>Made for curious minds.</span></div>
  </footer>
);

export default Footer;
