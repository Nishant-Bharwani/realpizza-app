import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const useAuthRedirect = () => {
    const isAuth = useSelector((state) => state.authSlice.isAuth);

    if (isAuth) {
        return <Navigate to="/dashboard" />;
    }

    return null;
};

export default useAuthRedirect;
