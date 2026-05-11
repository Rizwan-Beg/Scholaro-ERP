import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';

/**
 * App Component — Root of the Scholaro ERP Frontend
 * 
 * Sets up React Router with three routes:
 * - /         → HomePage (protected — requires JWT)
 * - /login    → LoginPage (public)
 * - /register → RegisterPage (public)
 * - *         → Redirect to /
 * 
 * AuthProvider wraps all routes to provide authentication state globally.
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Protected home route — redirects to /login if not authenticated */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* Public auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Catch-all — redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
