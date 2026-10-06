import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthProvider';

const Navbar = () => {
    const { authUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const links = [
        { to: '/', label: 'Home' },
        { to: '/books', label: 'Browse books' },
        ...(authUser ? [{ to: '/reserve/my', label: 'My books' }] : []),
        ...(authUser && ['admin', 'librarian'].includes(authUser.role) ? [{ to: '/dashboard', label: 'Dashboard' }] : []),
    ];
    const cls = ({ isActive }) => isActive ? 'font-semibold text-primary bg-primary/10' : '';
    const handleLogout = () => { logout(); toast.success('You are logged out.'); navigate('/'); };

    return (
        <header className="sticky top-0 z-30 border-b border-base-300 bg-base-100/90 backdrop-blur">
            <div className="navbar mx-auto max-w-6xl px-4">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden" aria-label="Open menu">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </div>
                        <ul tabIndex={-1} className="menu dropdown-content z-10 mt-3 w-52 rounded-box bg-base-100 p-2 shadow">
                            {links.map(l => <li key={l.to}><NavLink to={l.to} end={l.to === '/'} className={cls}>{l.label}</NavLink></li>)}
                        </ul>
                    </div>
                    <Link to="/" className="font-display text-2xl font-semibold text-primary">Leaf &amp; Lore</Link>
                </div>
                <nav className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal gap-1 px-1">
                        {links.map(l => <li key={l.to}><NavLink to={l.to} end={l.to === '/'} className={cls}>{l.label}</NavLink></li>)}
                    </ul>
                </nav>
                <div className="navbar-end gap-2">
                    {authUser ? (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost gap-2 px-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-content">{(authUser.firstname || authUser.username || '?').charAt(0).toUpperCase()}</span>
                                <span className="hidden sm:inline">{authUser.firstname || authUser.username}</span>
                            </div>
                            <ul tabIndex={-1} className="menu dropdown-content z-10 mt-3 w-52 rounded-box bg-base-100 p-2 shadow">
                                <li className="menu-title">{authUser.email}</li>
                                <li><Link to="/profile">Profile &amp; settings</Link></li>
                                <li><Link to="/reserve/my">My books</Link></li>
                                {['admin', 'librarian'].includes(authUser.role) && <li><Link to="/dashboard">Dashboard</Link></li>}
                                <li><button onClick={handleLogout}>Log out</button></li>
                            </ul>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-ghost">Log in</Link>
                            <Link to="/signup" className="btn btn-primary">Sign up</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
