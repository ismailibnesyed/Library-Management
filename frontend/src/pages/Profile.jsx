import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { baseUrl } from '../services/BaseUrl';
import { AuthContext } from '../context/AuthProvider';

const Profile = () => {
    const { authUser, accessToken, setAuthUser } = useContext(AuthContext);
    const [profile, setProfile] = useState({ firstname: '', lastname: '', email: '', username: '' });
    const [passwords, setPasswords] = useState({ current_password: '', new_password: '' });
    const [saving, setSaving] = useState(false);
    const [changing, setChanging] = useState(false);
    const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };

    useEffect(() => {
        if (authUser) setProfile({
            firstname: authUser.firstname || '',
            lastname: authUser.lastname || '',
            email: authUser.email || '',
            username: authUser.username || '',
        });
    }, [authUser]);

    const update = key => e => setProfile(current => ({ ...current, [key]: e.target.value }));
    const updatePassword = key => e => setPasswords(current => ({ ...current, [key]: e.target.value }));

    const saveProfile = async e => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await fetch(`${baseUrl}/edituser`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    firstname: profile.firstname.trim(),
                    lastname: profile.lastname.trim(),
                    email: profile.email.trim(),
                    username: profile.username.trim(),
                }),
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.detail || 'Could not update profile.');
            const refreshed = await fetch(`${baseUrl}/user`, { headers }).then(r => r.json());
            setAuthUser(refreshed);
            toast.success('Profile updated successfully.');
        } catch (error) {
            toast.error(error.message || 'Could not update profile.');
        } finally { setSaving(false); }
    };

    const changePassword = async e => {
        e.preventDefault();
        if (passwords.new_password.length < 6) return toast.error('New password must be at least 6 characters.');
        setChanging(true);
        try {
            const response = await fetch(`${baseUrl}/passwordchange`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(passwords),
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.detail || 'Could not change password.');
            setPasswords({ current_password: '', new_password: '' });
            toast.success('Password changed successfully.');
        } catch (error) {
            toast.error(error.message || 'Could not change password.');
        } finally { setChanging(false); }
    };

    return (
        <main className="mx-auto max-w-4xl px-4 py-10">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">Account</p>
                <h1 className="font-display text-4xl">Your profile</h1>
                <p className="mt-1 text-base-content/65">Update your personal information and password.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
                <form onSubmit={saveProfile} className="card bg-base-100 shadow-sm">
                    <div className="card-body gap-4">
                        <h2 className="font-display text-2xl">Edit profile</h2>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <input required value={profile.firstname} onChange={update('firstname')} className="input w-full" placeholder="First name" />
                            <input required value={profile.lastname} onChange={update('lastname')} className="input w-full" placeholder="Last name" />
                        </div>
                        <input required type="email" value={profile.email} onChange={update('email')} className="input w-full" placeholder="Email" />
                        <input required minLength="3" value={profile.username} onChange={update('username')} className="input w-full" placeholder="Username" />
                        <div className="mt-2 flex items-center justify-between gap-3">
                            <span className="badge badge-outline capitalize">{authUser?.role}</span>
                            <button type="submit" disabled={saving} className="btn btn-primary">{saving ? <span className="loading loading-spinner" /> : 'Save changes'}</button>
                        </div>
                    </div>
                </form>
                <form onSubmit={changePassword} className="card bg-base-100 shadow-sm">
                    <div className="card-body gap-4">
                        <h2 className="font-display text-2xl">Change password</h2>
                        <input required type="password" autoComplete="current-password" value={passwords.current_password} onChange={updatePassword('current_password')} className="input w-full" placeholder="Current password" />
                        <input required minLength="6" type="password" autoComplete="new-password" value={passwords.new_password} onChange={updatePassword('new_password')} className="input w-full" placeholder="New password" />
                        <button type="submit" disabled={changing} className="btn btn-outline btn-primary mt-2">{changing ? <span className="loading loading-spinner" /> : 'Change password'}</button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Profile;
