// components/ProtectedRoute.jsx
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Loader from './Loader'; // Ahora existe este componente

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  return user ? children : <Navigate to="/" replace />;
}