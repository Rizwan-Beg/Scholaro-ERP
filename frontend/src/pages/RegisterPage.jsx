import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

/**
 * RegisterPage Component
 * 
 * Registration form with fields: Full Name, Email, Phone, Password,
 * Confirm Password, and Role (Student/Teacher/Admin).
 * 
 * Features:
 * - Comprehensive client-side validation
 * - Loading state with spinner
 * - Toast messages for success/error
 * - Auto-redirect if already authenticated
 */
export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated, loading: authLoading, clearError } = useAuth();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  /** Update a single form field */
  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /** Validate all form fields */
  const validate = () => {
    const e = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      e.fullName = 'Full name is required (min 2 characters)';
    }
    if (!form.email.trim()) {
      e.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Enter a valid email address';
    }
    if (!form.phoneNumber.trim()) {
      e.phoneNumber = 'Phone number is required';
    } else if (form.phoneNumber.trim().length < 7) {
      e.phoneNumber = 'Enter a valid phone number';
    } else if (!/^[+\d\s\-()]+$/.test(form.phoneNumber)) {
      e.phoneNumber = 'Only digits, spaces, +, -, (, ) allowed';
    }
    if (!form.password) {
      e.password = 'Password is required';
    } else if (form.password.length < 8) {
      e.password = 'Password must be at least 8 characters';
    }
    if (!form.confirmPassword) {
      e.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      e.confirmPassword = 'Passwords do not match';
    }
    return e;
  };

  /** Handle form submission */
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    const result = await register({
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      phoneNumber: form.phoneNumber.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
      role: form.role,
    });
    setLoading(false);

    if (result.success) {
      setToast({ type: 'success', message: 'Account created — welcome to Scholaro!' });
      navigate('/', { replace: true });
    } else {
      setToast({ type: 'error', message: result.message });
    }
  };

  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner spinner-dark" />
      </div>
    );
  }

  return (
    <>
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span>{toast.type === 'success' ? '✓' : '✕'}</span>
          <span>{toast.message}</span>
          <button className="toast-close" onClick={() => setToast(null)}>×</button>
        </div>
      )}

      <AuthLayout
        title="Create your account"
        subtitle="Join Scholaro ERP — choose your role to get started."
      >
        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="reg-fullname" className="form-label">Full Name</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                id="reg-fullname"
                type="text"
                autoComplete="name"
                placeholder="Jane Doe"
                value={form.fullName}
                onChange={(e) => setField('fullName', e.target.value)}
                className={`form-input ${errors.fullName ? 'error' : ''}`}
              />
            </div>
            {errors.fullName && <p className="form-error">⚠ {errors.fullName}</p>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">Email</label>
            <div className="input-wrapper">
              <span className="input-icon">✉</span>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                placeholder="you@school.edu"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                className={`form-input ${errors.email ? 'error' : ''}`}
              />
            </div>
            {errors.email && <p className="form-error">⚠ {errors.email}</p>}
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label htmlFor="reg-phone" className="form-label">Phone Number</label>
            <div className="input-wrapper">
              <span className="input-icon">📞</span>
              <input
                id="reg-phone"
                type="tel"
                autoComplete="tel"
                placeholder="+1 555 000 1234"
                value={form.phoneNumber}
                onChange={(e) => setField('phoneNumber', e.target.value)}
                className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
              />
            </div>
            {errors.phoneNumber && <p className="form-error">⚠ {errors.phoneNumber}</p>}
          </div>

          {/* Role */}
          <div className="form-group">
            <label htmlFor="reg-role" className="form-label">I am a</label>
            <div className="input-wrapper">
              <span className="input-icon">🛡</span>
              <select
                id="reg-role"
                value={form.role}
                onChange={(e) => setField('role', e.target.value)}
                className="form-select"
              >
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
          </div>

          {/* Password + Confirm Password (side by side on desktop) */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reg-password" className="form-label">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="reg-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setField('password', e.target.value)}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                />
              </div>
              {errors.password && <p className="form-error">⚠ {errors.password}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="reg-confirm" className="form-label">Confirm</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="reg-confirm"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) => setField('confirmPassword', e.target.value)}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                />
              </div>
              {errors.confirmPassword && <p className="form-error">⚠ {errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '8px' }}>
            {loading ? <div className="spinner" /> : 'Create account'}
          </button>

          <p className="auth-footer">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </form>
      </AuthLayout>
    </>
  );
}
