// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { apiFetch } from "../services/api";
// import { useAuth } from "../context/AuthContext";
// import "./AuthPage.css";

// const AuthPage = () => {
//   const [mode, setMode] = useState("login");
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const { setUser } = useAuth();

//   const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       const path = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
//       const payload =
//         mode === "signup"
//           ? form
//           : { email: form.email, password: form.password };
//       const user = await apiFetch(path, {
//         method: "POST",
//         body: JSON.stringify(payload),
//       });
//       setUser(user);
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="auth">
//       <header className="auth-top">
//         <div className="auth-logo">
//           <span className="auth-logo-dot" />
//           Orcas
//         </div>
//       </header>

//       <div className="auth-bg">
//         <div className="auth-card">
//           <div className="auth-icon">{mode === "signup" ? "??" : "?"}</div>
//           <h2>{mode === "signup" ? "Create Account" : "Welcome Back"}</h2>
//           <p>
//             {mode === "signup"
//               ? "Start managing your projects efficiently."
//               : "Enter your credentials to access your workspace."}
//           </p>

//           <form onSubmit={onSubmit}>
//             {mode === "signup" && (
//               <label>
//                 Full Name
//                 <input
//                   placeholder="e.g. Alex Smith"
//                   name="name"
//                   value={form.name}
//                   onChange={onChange}
//                 />
//               </label>
//             )}
//             <label>
//               Email
//               <input
//                 placeholder="alex@company.com"
//                 name="email"
//                 value={form.email}
//                 onChange={onChange}
//               />
//             </label>
//             <label>
//               Password
//               <input
//                 type="password"
//                 placeholder="��������"
//                 name="password"
//                 value={form.password}
//                 onChange={onChange}
//               />
//             </label>
//             {mode === "signup" && (
//               <label>
//                 Confirm Password
//                 <input
//                   type="password"
//                   placeholder="��������"
//                   name="confirmPassword"
//                   value={form.confirmPassword}
//                   onChange={onChange}
//                 />
//               </label>
//             )}

//             {error && <p className="auth-error">{error}</p>}

//             <button type="submit" className="auth-btn">
//               {mode === "signup" ? "Get Started ?" : "Sign In"}
//             </button>
//           </form>

//           <div className="auth-switch">
//             {mode === "signup" ? (
//               <span>
//                 Already have an account?{" "}
//                 <button onClick={() => setMode("login")}>Log in</button>
//               </span>
//             ) : (
//               <span>
//                 Don&apos;t have an account?{" "}
//                 <button onClick={() => setMode("signup")}>Sign up</button>
//               </span>
//             )}
//           </div>
//         </div>
//       </div>

//       <footer className="auth-footer">
//         � 2024 QuickTask Inc. � Privacy & Terms
//       </footer>
//     </div>
//   );
// };
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./AuthPage.css";

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTos: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const onChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const path = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const payload =
        mode === "signup"
          ? form
          : { email: form.email, password: form.password };
      const user = await apiFetch(path, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setUser(user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };
  // toggle helper that preserves cursor position
  const togglePasswordField = (ref, setter) => {
    try {
      const el = ref.current;
      const start = el?.selectionStart ?? null;
      const end = el?.selectionEnd ?? null;
      setter((s) => !s);
      // restore focus and selection after DOM updates
      setTimeout(() => {
        if (!el) return;
        el.focus();
        if (start !== null && end !== null) {
          try { el.setSelectionRange(start, end); } catch (e) {}
        }
      }, 0);
    } catch (e) {
      setter((s) => !s);
    }
  };
  // password strength helpers (computed each render)
  const pwScore = (() => {
    const p = form.password || "";
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[a-z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthClass = pwScore === 0 ? "" : pwScore <= 2 ? "weak" : pwScore <= 4 ? "medium" : "strong";
  const strengthPercent = Math.round((pwScore / 5) * 100);

  return (
    <div className="auth">
      {/* Background shapes — matches landing page */}
      <div className="auth-bg-shapes" aria-hidden="true">
        <div className="auth-triangle-blue" />
        <div className="auth-triangle-green" />
        <div className="auth-hero-pattern" />
      </div>

      {/* Nav */}
      <header className="auth-nav">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <span className="auth-logo-name">Orcas</span>
        </div>
      </header>

      {/* Main */}
      <main className="auth-main">
        {/* Left panel — decorative (desktop only) */}
        <div className="auth-left" aria-hidden="true">
          <div className="auth-left-content">
            <div className="auth-testimonial">
              <div className="auth-quote-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
                </svg>
              </div>
              <p>"Orcas cut our project chaos in half. Our team ships twice as fast and everyone actually knows what's happening."</p>
              <div className="auth-testimonial-author">
                <div className="auth-author-avatar">JM</div>
                <div>
                  <strong>Jamie Moore</strong>
                  <span>Head of Product, Velocity</span>
                </div>
              </div>
            </div>

            <div className="auth-stats">
              <div className="auth-stat">
                <strong>20k+</strong>
                <span>Teams</span>
              </div>
              <div className="auth-stat-divider" />
              <div className="auth-stat">
                <strong>98%</strong>
                <span>Satisfaction</span>
              </div>
              <div className="auth-stat-divider" />
              <div className="auth-stat">
                <strong>4.9★</strong>
                <span>Rating</span>
              </div>
            </div>

            {/* Mini Kanban preview */}
            <div className="auth-preview">
              <div className="auth-preview-bar">
                <span className="auth-preview-dot auth-preview-dot--red" />
                <span className="auth-preview-dot auth-preview-dot--yellow" />
                <span className="auth-preview-dot auth-preview-dot--green" />
              </div>
              <div className="auth-preview-body">
                <div className="auth-preview-col">
                  <div className="auth-preview-label" />
                  <div className="auth-preview-card">
                    <span className="auth-preview-tag auth-preview-tag--blue" />
                    <div className="auth-preview-line" />
                    <div className="auth-preview-line auth-preview-line--short" />
                  </div>
                  <div className="auth-preview-card">
                    <span className="auth-preview-tag auth-preview-tag--purple" />
                    <div className="auth-preview-line auth-preview-line--med" />
                  </div>
                </div>
                <div className="auth-preview-col">
                  <div className="auth-preview-label" />
                  <div className="auth-preview-card auth-preview-card--highlight">
                    <span className="auth-preview-tag auth-preview-tag--orange" />
                    <div className="auth-preview-line" />
                    <div className="auth-preview-line" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="auth-right">
          <div className="auth-card">
            {/* Icon */}
            <div className="auth-card-icon">
              <div className="auth-card-icon-pulse" />
              <div className="auth-card-icon-inner">
                {mode === "signup" ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="26" height="26">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <line x1="19" y1="8" x2="19" y2="14"/>
                    <line x1="22" y1="11" x2="16" y2="11"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="26" height="26">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                )}
              </div>
            </div>

            {/* Heading */}
            <h2 className="auth-card-title">
              {mode === "signup" ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="auth-card-sub">
              {mode === "signup"
                ? "Start managing your projects efficiently."
                : "Enter your credentials to access your workspace."}
            </p>

            {/* Form */}
            <form onSubmit={onSubmit} className="auth-form">
              {mode === "signup" && (
                <div className="auth-field">
                  <label htmlFor="auth-name">Full Name</label>
                  <div className="auth-input-wrap">
                    <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <input
                      id="auth-name"
                      placeholder="e.g. Alex Smith"
                      name="name"
                      value={form.name}
                      onChange={onChange}
                    />
                  </div>
                </div>
              )}

              <div className="auth-field">
                <label htmlFor="auth-email">Email</label>
                <div className="auth-input-wrap">
                  <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    id="auth-email"
                    placeholder="alex@company.com"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="auth-password">Password</label>
                <div className="auth-input-wrap">
                  <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    id="auth-password"
                    ref={passwordRef}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    onKeyDown={(e) => setCapsLockOn(e.getModifierState && e.getModifierState("CapsLock"))}
                    onKeyUp={(e) => setCapsLockOn(e.getModifierState && e.getModifierState("CapsLock"))}
                    onBlur={() => setCapsLockOn(false)}
                  />
                  <button
                    type="button"
                    className="auth-pass-toggle"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={(e) => {
                      e.preventDefault();
                      togglePasswordField(passwordRef, setShowPassword);
                    }}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 3l18 18" />
                        <path d="M10.58 10.58A3 3 0 0 0 13.42 13.42" />
                        <path d="M2.5 12s2.5-6 9.5-6c2.06 0 3.77.7 5.2 1.7" />
                        <path d="M21.5 12s-2.5 6-9.5 6c-2.06 0-3.77-.7-5.2-1.7" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {/* Password strength indicator */}
                <div className="pw-strength" aria-live="polite">
                  <div className="pw-checks">
                    <label className={form.password && form.password.length >= 8 ? 'ok' : ''}>8+ chars</label>
                    <label className={/[A-Z]/.test(form.password) ? 'ok' : ''}>Uppercase</label>
                    <label className={/[a-z]/.test(form.password) ? 'ok' : ''}>Lowercase</label>
                    <label className={/\d/.test(form.password) ? 'ok' : ''}>Number</label>
                    <label className={/[^A-Za-z0-9]/.test(form.password) ? 'ok' : ''}>Special</label>
                  </div>
                  <div className="pw-bar" aria-hidden>
                    <div className={`pw-fill ${strengthClass}`} style={{ width: `${strengthPercent}%` }} />
                  </div>
                  <div className="pw-strength-label">
                    {pwScore === 0 ? "" : pwScore <= 2 ? "Weak" : pwScore <= 4 ? "Medium" : "Strong"}
                  </div>
                </div>
                {capsLockOn && (
                  <div className="caps-warning" role="status" aria-live="polite">
                    Warning: Caps Lock is on
                  </div>
                )}
              </div>

              {mode === "signup" && (
                <div className="auth-field">
                  <label htmlFor="auth-confirm">Confirm Password</label>
                  <div className="auth-input-wrap">
                    <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                    </svg>
                    <input
                      id="auth-confirm"
                      ref={confirmRef}
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={onChange}
                      onKeyDown={(e) => setCapsLockOn(e.getModifierState && e.getModifierState("CapsLock"))}
                      onKeyUp={(e) => setCapsLockOn(e.getModifierState && e.getModifierState("CapsLock"))}
                      onBlur={() => setCapsLockOn(false)}
                    />
                    <button
                      type="button"
                      className="auth-pass-toggle"
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                      onClick={(e) => {
                        e.preventDefault();
                        togglePasswordField(confirmRef, setShowConfirm);
                      }}
                    >
                      {showConfirm ? (
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 3l18 18" />
                          <path d="M10.58 10.58A3 3 0 0 0 13.42 13.42" />
                          <path d="M2.5 12s2.5-6 9.5-6c2.06 0 3.77.7 5.2 1.7" />
                          <path d="M21.5 12s-2.5 6-9.5 6c-2.06 0-3.77-.7-5.2-1.7" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}
              {mode === "signup" && (
                <div className="auth-field" style={{ marginTop: 6 }}>
                  <label style={{ fontSize: 13 }}>
                    <input
                      type="checkbox"
                      name="acceptTos"
                      checked={!!form.acceptTos}
                      onChange={onChange}
                      style={{ marginRight: 10 }}
                    />
                    I agree to the <a href="/terms" target="_blank" rel="noreferrer">Terms & Conditions</a>
                  </label>
                </div>
              )}

              {error && (
                <div className="auth-error">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="auth-submit"
                disabled={mode === "signup" && !form.acceptTos}
              >
                {mode === "signup" ? "Create Account" : "Sign In"}
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                </svg>
              </button>
            </form>

            {/* Divider */}
            <div className="auth-divider">
              <span />
              <p>or continue with</p>
              <span />
            </div>

            {/* Social buttons (visual only) */}
            <div className="auth-socials">
              <button className="auth-social-btn" type="button">
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button className="auth-social-btn" type="button">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>

            {/* Switch mode */}
            <div className="auth-switch">
              {mode === "signup" ? (
                <span>
                  Already have an account?{" "}
                  <button type="button" onClick={() => setMode("login")}>Log in</button>
                </span>
              ) : (
                <span>
                  Don&apos;t have an account?{" "}
                  <button type="button" onClick={() => setMode("signup")}>Sign up</button>
                </span>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="auth-footer">
        © 2024 Orcas Inc. &nbsp;·&nbsp;
        <a href="#">Privacy Policy</a> &nbsp;·&nbsp;
        <a href="#">Terms of Service</a>
      </footer>
    </div>
  );
};

export default AuthPage;