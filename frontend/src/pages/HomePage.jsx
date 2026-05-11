import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * HomePage Component
 * 
 * Minimal authenticated home page that displays the user's profile info
 * after successful login. Shows:
 * - Welcome banner with gradient background
 * - User email, full name, and role
 * - Sign out button
 * 
 * This is the auth module only — dashboard features can be built on top.
 */
export default function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /** Handle sign out */
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <div className="home-header-inner">
          <div className="landing-header-logo">
            <div className="logo-icon">🎓</div>
            <span>Scholaro ERP</span>
          </div>
          <button className="btn btn-outline" onClick={handleLogout}>
            🚪 Sign out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="home-content">
        {/* Welcome card */}
        <div className="home-welcome-card">
          <p className="label">✓ Authenticated</p>
          <h1>Welcome, {user?.fullName || user?.email || 'User'}</h1>
          <p className="role-text">
            You're signed in as <strong style={{ textTransform: 'capitalize' }}>
              {user?.role?.toLowerCase() || '—'}
            </strong>.
          </p>
        </div>

        {/* Info cards */}
        <div className="home-info-grid">
          <div className="info-card">
            <p className="info-label">Full Name</p>
            <p className="info-value">{user?.fullName || '—'}</p>
          </div>
          <div className="info-card">
            <p className="info-label">Email</p>
            <p className="info-value">{user?.email || '—'}</p>
          </div>
          <div className="info-card">
            <p className="info-label">Role</p>
            <p className="info-value capitalize">{user?.role?.toLowerCase() || '—'}</p>
          </div>
          <div className="info-card">
            <p className="info-label">Session Status</p>
            <p className="info-value" style={{ color: 'var(--color-success)' }}>● Active</p>
          </div>
        </div>

        <p className="home-footer-note">
          This is the authentication module only — your dashboard and ERP features can be built on top of this.
        </p>
      </main>
    </div>
  );
}
