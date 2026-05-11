import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication.
 * - If the user is authenticated → render children
 * - If loading → show a spinner
 * - If not authenticated → redirect to /login
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while verifying token
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner spinner-dark" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
