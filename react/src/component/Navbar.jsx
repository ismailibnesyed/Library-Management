import { useContext, useState } from "react";
import { FiBookOpen, FiMenu, FiUser, FiX } from "react-icons/fi";
import { Link, NavLink } from "react-router";
import { AuthContext } from "../context/AuthProvider";

const Navbar = () => {
  const { authUser, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navClass = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;

  return (
    <header className="site-header">
      <div className="container-wide header-inner">
        <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark"><FiBookOpen /></span>
          <span>Leaf &amp; Lore</span>
        </Link>

        <button className="mobile-menu" type="button" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <nav className={`main-nav${menuOpen ? " open" : ""}`}>
          <NavLink className={navClass} to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink className={navClass} to="/books" onClick={() => setMenuOpen(false)}>Browse books</NavLink>
          {authUser && <NavLink className={navClass} to="/reserve/my" onClick={() => setMenuOpen(false)}>My shelf</NavLink>}
          {authUser && <NavLink className={navClass} to="/issues/my" onClick={() => setMenuOpen(false)}>Borrowed</NavLink>}
        </nav>

        {authUser ? (
          <div className="account-menu">
            <Link className="account-link" to="/user/profile" aria-label="Open profile">
              <span className="avatar"><FiUser /></span>
              <span className="account-name">{authUser.username}</span>
            </Link>
            <button className="logout-button" type="button" onClick={logout}>Log out</button>
          </div>
        ) : (
          <Link className="login-link" to="/login">Sign in <span>→</span></Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
