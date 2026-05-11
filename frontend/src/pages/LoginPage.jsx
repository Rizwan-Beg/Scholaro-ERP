import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

/**
 * LoginPage Component
 * 
 * Provides a login form with email and password fields.
 * Features:
 * - Client-side validation
 * - Loading state with spinner
 * - Error/success toast messages
 * - Auto-redirect if already authenticated
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Auto-dismiss toast after 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  /**
   * Validate form fields on the client side.
   */
  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };

  /**
   * Handle form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    // Validate
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    // Call login API
    const result = await login(email.trim().toLowerCase(), password);
    setLoading(false);

    if (result.success) {
      setToast({ type: 'success', message: 'Welcome back!' });
      navigate('/', { replace: true });
    } else {
      setToast({ type: 'error', message: result.message });
    }
  };

  // Don't render form while checking auth status
  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner spinner-dark" />
      </div>
    );
  }

  return (
    <>
      {/* Toast notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span>{toast.type === 'success' ? '✓' : '✕'}</span>
          <span>{toast.message}</span>
          <button className="toast-close" onClick={() => setToast(null)}>×</button>
        </div>
      )}

      <AuthLayout
        title="Welcome back"
        subtitle="Sign in to your Scholaro account to continue."
      >
        <form onSubmit={handleSubmit} noValidate>
          {/* Email field */}
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">Email</label>
            <div className="input-wrapper">
              <span className="input-icon">✉</span>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`form-input ${errors.email ? 'error' : ''}`}
              />
            </div>
            {errors.email && <p className="form-error">⚠ {errors.email}</p>}
          </div>

          {/* Password field */}
          <div className="form-group">
            <label htmlFor="login-password" className="form-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`form-input ${errors.password ? 'error' : ''}`}
              />
            </div>
            {errors.password && <p className="form-error">⚠ {errors.password}</p>}
          </div>

          {/* Submit button */}
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? <div className="spinner" /> : 'Sign in'}
          </button>

          {/* Footer link */}
          <p className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register">Create one</Link>
          </p>
        </form>
      </AuthLayout>
    </>
  );
}
