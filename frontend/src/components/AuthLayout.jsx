/**
 * AuthLayout Component
 * 
 * Shared layout for Login and Registration pages.
 * Features a split-screen design:
 * - Left: Brand panel with gradient background, school branding, and tagline
 * - Right: Form panel (children are rendered here)
 * 
 * On mobile, the brand panel is hidden and a compact logo is shown instead.
 */
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-layout">
      {/* ===== Brand Panel (visible on desktop only) ===== */}
      <div className="auth-brand-panel">
        {/* Logo */}
        <div className="brand-logo">
          <div className="brand-logo-icon">🎓</div>
          <span className="brand-logo-text">Scholaro ERP</span>
        </div>

        {/* Hero text */}
        <div className="brand-hero">
          <h2>One platform for your entire school.</h2>
          <p>
            Manage students, teachers and administration with a modern,
            secure and elegant ERP built for education.
          </p>
        </div>

        {/* Footer */}
        <div className="brand-footer">
          © {new Date().getFullYear()} Scholaro Education Systems
        </div>
      </div>

      {/* ===== Form Panel ===== */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          {/* Mobile logo (hidden on desktop) */}
          <div className="mobile-logo">
            <div className="mobile-logo-icon">🎓</div>
            <span className="mobile-logo-text">Scholaro ERP</span>
          </div>

          {/* Title and subtitle */}
          <h1 className="auth-title">{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>

          {/* Form content (Login or Register form) */}
          <div className="auth-form">{children}</div>
        </div>
      </div>
    </div>
  );
}
