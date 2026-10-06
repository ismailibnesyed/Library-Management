import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { baseUrl } from '../services/BaseUrl';

const Signup = () => {
    const navigate = useNavigate();
    const [f, setF] = useState({ firstname: '', lastname: '', username: '', email: '', password: '', role: 'user' });
    const [show, setShow] = useState(false);
    const [busy, setBusy] = useState(false);
    const [touched, setTouched] = useState(false);
    const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

    const errors = {
        firstname: !f.firstname.trim() && 'Enter your first name.',
        lastname: !f.lastname.trim() && 'Enter your last name.',
        username: f.username.trim().length < 3 && 'Use at least 3 characters.',
        email: !/^\S+@\S+\.\S+$/.test(f.email) && 'Enter a valid email address.',
        password: f.password.length < 6 && 'Use at least 6 characters.',
    };
    const err = (k) => touched && errors[k] && <span className="text-xs text-error">{errors[k]}</span>;

    const submit = async (e) => {
        e.preventDefault();
        setTouched(true);
        if (Object.values(errors).some(Boolean)) return toast.error('Fix the highlighted fields.');
        setBusy(true);
        try {
            const res = await fetch(`${baseUrl}/createuser`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...f, username: f.username.trim(), email: f.email.trim() }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(typeof data.detail === 'string' ? data.detail : 'Sign up failed.');
            toast.success('Account created. Log in to continue.');
            navigate('/login');
        } catch (e2) {
            toast.error(e2 instanceof TypeError ? "Can't reach the server. Try again in a few seconds." : e2.message);
        } finally { setBusy(false); }
    };

    const field = (k, label, type = 'text', auto) => (
        <div>
            <label className="floating-label">
                <span>{label}</span>
                <input value={f[k]} onChange={set(k)} type={type} autoComplete={auto} placeholder={label}
                    className={`input w-full ${touched && errors[k] ? 'input-error' : ''}`} />
            </label>
            {err(k)}
        </div>
    );

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
            <form onSubmit={submit} noValidate className="card w-full max-w-md bg-base-100 shadow-lg">
                <div className="card-body gap-3">
                    <h1 className="font-display text-3xl">Create your account</h1>
                    <div className="grid grid-cols-2 gap-3">
                        {field('firstname', 'First name', 'text', 'given-name')}
                        {field('lastname', 'Last name', 'text', 'family-name')}
                    </div>
                    {field('username', 'Username', 'text', 'username')}
                    {field('email', 'Email', 'email', 'email')}
                    {field('password', 'Password', show ? 'text' : 'password', 'new-password')}
                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                        <input type="checkbox" className="checkbox checkbox-sm" checked={show} onChange={e => setShow(e.target.checked)} /> Show password
                    </label>
                    <div className="join w-full" role="radiogroup" aria-label="Account type">
                        {[['user', 'Member'], ['admin', 'Admin']].map(([v, l]) => (
                            <input key={v} type="radio" name="role" aria-label={l} value={v} checked={f.role === v} onChange={set('role')} className="btn join-item flex-1" />
                        ))}
                    </div>
                    <button type="submit" disabled={busy} className="btn btn-primary mt-2">{busy ? <span className="loading loading-spinner" /> : 'Create account'}</button>
                    <p className="text-center text-sm">Already have an account? <Link to="/login" className="link link-primary">Log in</Link></p>
                </div>
            </form>
        </div>
    );
};

export default Signup;
