import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loader label="Checking your session…" dark />;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
