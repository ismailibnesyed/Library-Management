import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../context/AuthProvider';

const PrivateRoutes = ({ children }) => {
    const { authUser, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) return <div className="flex min-h-[50vh] items-center justify-center"><span className="loading loading-spinner loading-lg text-primary" /></div>;
    if (!authUser) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    return children;
};

export default PrivateRoutes;
