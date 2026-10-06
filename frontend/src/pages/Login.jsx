import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { baseUrl } from '../services/BaseUrl';
import { AuthContext } from '../context/AuthProvider';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [busy, setBusy] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const submit = async (e) => {
        e.preventDefault();
        if (!username.trim() || !password) return toast.error('Enter your username and password.');
        setBusy(true);
        try {
            const res = await fetch(`${baseUrl}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ username: username.trim(), password }),
            });
            const data = await res.json();
            if (!data?.access_token) throw new Error('bad-credentials');
            login(data.access_token);
            toast.success('Welcome back!');
            navigate(location.state?.from || '/', { replace: true });
        } catch (err) {
            toast.error(err.message === 'bad-credentials'
                ? 'Wrong username or password.'
                : "Can't reach the server. It may be waking up, so try again in a few seconds.");
        } finally { setBusy(false); }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
            <form onSubmit={submit} className="card w-full max-w-sm bg-base-100 shadow-lg">
                <div className="card-body gap-3">
                    <h1 className="font-display text-3xl">Log in</h1>
                    {location.state?.from && <p className="text-sm text-base-content/60">Log in to continue.</p>}
                    <label className="floating-label">
                        <span>Username</span>
                        <input value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" autoFocus type="text" className="input w-full" placeholder="Username" />
                    </label>
                    <label className="floating-label">
                        <span>Password</span>
                        <input value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" type={show ? 'text' : 'password'} className="input w-full" placeholder="Password" />
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                        <input type="checkbox" className="checkbox checkbox-sm" checked={show} onChange={e => setShow(e.target.checked)} /> Show password
                    </label>
                    <button type="submit" disabled={busy} className="btn btn-primary mt-2">{busy ? <span className="loading loading-spinner" /> : 'Log in'}</button>
                    <p className="text-center text-sm">New here? <Link to="/signup" className="link link-primary">Create an account</Link></p>
                </div>
            </form>
        </div>
    );
};

export default Login;
