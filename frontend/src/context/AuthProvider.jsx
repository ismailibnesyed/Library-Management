import { createContext, useEffect, useState } from 'react';
import { baseUrl } from '../services/BaseUrl';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(() => localStorage.getItem('lm_token'));
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!accessToken) {
            setAuthUser(null);
            setLoading(false);
            return undefined;
        }
        let ignore = false;
        setLoading(true);
        fetch(`${baseUrl}/user`, { headers: { Authorization: `Bearer ${accessToken}` } })
            .then(response => response.ok ? response.json() : Promise.reject(new Error('session-expired')))
            .then(user => { if (!ignore) setAuthUser(user); })
            .catch(() => {
                if (ignore) return;
                localStorage.removeItem('lm_token');
                setAccessToken(null);
                setAuthUser(null);
            })
            .finally(() => { if (!ignore) setLoading(false); });
        return () => { ignore = true; };
    }, [accessToken]);

    const login = token => {
        localStorage.setItem('lm_token', token);
        setLoading(true);
        setAccessToken(token);
    };

    const logout = () => {
        localStorage.removeItem('lm_token');
        setAccessToken(null);
        setAuthUser(null);
    };

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser, accessToken, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
