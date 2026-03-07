import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const [TourComp, setTourComp] = useState(null);
  const [tourOpen, setTourOpen] = useState(false);

  const steps = useMemo(() => [
    {
      id: "welcome",
      text: "Welcome to Orcas — a quick guided tour. Use Next to continue or Skip to close.",
      buttons: [
        { text: "Skip", action() { return this.cancel(); } },
        { text: "Next", action() { return this.next(); }, classes: "shepherd-button-primary" }
      ]
    },
    {
      id: "hero-cta",
      text: "Start here — sign up or watch a short demo.",
      attachTo: { element: '[data-tour-id=\"hero-cta\"]', on: "bottom" }
    },
    {
      id: "features",
      text: "Key features live here — real-time sync, custom views, and analytics.",
      attachTo: { element: '[data-tour-id=\"features-card\"]', on: "left" }
    },
    {
      id: "analytics",
      text: "Insightful dashboards keep your team on track — explore analytics anytime.",
      attachTo: { element: '[data-tour-id=\"analytics-card\"]', on: "left" },
      buttons: [
        { text: "Finish", action() { return this.complete(); }, classes: "shepherd-button-primary" }
      ]
    }
  ], []);

  async function startTour() {
    if (!TourComp) {
      const mod = await import("../components/Tour");
      setTourComp(() => mod.default);
      // small delay to ensure dynamic component is set then open
      setTimeout(() => setTourOpen(true), 60);
      return;
    }
    setTourOpen(true);
  }

  return (
    <div className="lp">
      {/* Background decorations */}
      <div className="lp-bg-shapes" aria-hidden="true">
        <div className="lp-triangle-blue" />
        <div className="lp-triangle-green" />
      </div>

      {/* ── HEADER ── */}
      <header className="lp-nav">
        <div className="lp-logo">
          <div className="lp-logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          </div>
          <span className="lp-logo-name">Orcas</span>
        </div>

        <nav className="lp-links">
          <a href="#features">Features</a>
          <a href="#solutions">Solutions</a>
          <a href="#pricing">Pricing</a>
          <a href="#resources">Resources</a>
        </nav>

        <div className="lp-auth">
          <Link to="/auth" className="lp-link">Log in</Link>
          <Link to="/auth" className="lp-btn lp-btn-dark">Start Free Trial</Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="lp-hero">
        {/* dot-grid pattern */}
        <div className="lp-hero-pattern" aria-hidden="true" />
        {/* glow blob */}
        <div className="lp-hero-glow" aria-hidden="true" />

        <div className="lp-hero-inner">
          {/* pill badge */}
          <div className="lp-pill-badge">
            <span className="lp-ping-wrapper">
              <span className="lp-ping" />
              <span className="lp-ping-dot" />
            </span>
            NEW: KANBAN 2.0 RELEASED
          </div>

          <h1 className="lp-hero-title">
            Manage Projects at the <br />
            <span className="lp-gradient-text">Speed of Thought.</span>
          </h1>

          <p className="lp-hero-sub">
            The all-in-one workspace designed for agile teams. Streamline
            workflows, automate reporting, and ship faster—without the chaos.
          </p>

          <div className="lp-hero-actions">
            <Link to="/auth" className="lp-btn lp-btn-primary" data-tour-id="nav-signup">Get Started for Free</Link>
            <button className="lp-btn lp-btn-outline" data-tour-id="hero-cta" onClick={startTour}>
              <svg className="lp-play-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
              Watch Demo
            </button>
          </div>

          {/* mock browser */}
          <div className="lp-browser">
            <div className="lp-browser-bar">
              <span className="lp-dot lp-dot-red" />
              <span className="lp-dot lp-dot-yellow" />
              <span className="lp-dot lp-dot-green" />
              <div className="lp-browser-address" />
            </div>
            <div className="lp-browser-body">
              <div className="lp-sidebar">
                <div className="lp-sidebar-title" />
                <div className="lp-sidebar-items">
                  <div className="lp-sidebar-item" />
                  <div className="lp-sidebar-item lp-sidebar-item--short" />
                  <div className="lp-sidebar-item lp-sidebar-item--med" />
                </div>
                <div className="lp-sidebar-cta">New Project</div>
              </div>
              <div className="lp-main-panel">
                <div className="lp-panel-header">
                  <div className="lp-panel-title" />
                  <div className="lp-panel-avatars">
                    <div className="lp-avatar" />
                    <div className="lp-avatar" />
                  </div>
                </div>
                <div className="lp-kanban">
                  <div className="lp-kanban-col">
                    <div className="lp-col-label" />
                    <div className="lp-card">
                      <span className="lp-tag lp-tag-blue">DESIGN</span>
                      <div className="lp-card-bar" />
                      <div className="lp-card-bar lp-card-bar--short" />
                    </div>
                    <div className="lp-card">
                      <span className="lp-tag lp-tag-purple">RESEARCH</span>
                      <div className="lp-card-bar lp-card-bar--med" />
                    </div>
                  </div>
                  <div className="lp-kanban-col">
                    <div className="lp-col-label" />
                    <div className="lp-card lp-card--highlight">
                      <span className="lp-tag lp-tag-orange">DEV</span>
                      <div className="lp-card-bar" />
                      <div className="lp-card-bar" />
                      <div className="lp-card-footer">
                        <div className="lp-avatar-group">
                          <div className="lp-avatar lp-avatar--sm" />
                          <div className="lp-avatar lp-avatar--sm" />
                        </div>
                        <div className="lp-card-date" />
                      </div>
                    </div>
                  </div>
                  <div className="lp-kanban-col lp-kanban-col--faded">
                    <div className="lp-col-label" />
                    <div className="lp-card"><div className="lp-card-bar lp-card-bar--med" /></div>
                    <div className="lp-card"><div className="lp-card-bar" /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUSTED BRANDS ── */}
      <section className="lp-logos">
        <p className="lp-logos-label">Trusted by 20,000+ forward-thinking teams</p>
        <div className="lp-logo-row">
          <span className="lp-logo-item">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 1l3.09 6.26L22 8.27l-5 4.87 1.18 6.88L12 16.9l-6.18 3.12L7 13.14 2 8.27l6.91-1.01L12 1z"/></svg>
            TrustCorp
          </span>
          <span className="lp-logo-item">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
            GlobalNet
          </span>
          <span className="lp-logo-item">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2.5l2.5 5.07 5.6.81-4.05 3.95.96 5.57L12 15.27l-4.99 2.63.96-5.57L3.9 8.38l5.6-.81z"/></svg>
            Velocity
          </span>
          <span className="lp-logo-item">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z"/></svg>
            StackFlow
          </span>
          <span className="lp-logo-item">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>
            PowerSys
          </span>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="lp-features">
        <div className="lp-section-head">
          <h2>Powerful features for <span className="lp-text-primary">modern project management</span></h2>
          <p>Replace your scattered tools with one cohesive platform. Designed to handle complexity while keeping your team focused on what matters.</p>
        </div>
        <div className="lp-feature-grid">
          <div className="lp-feature-card" data-tour-id="features-card">
            <div className="lp-feature-icon lp-feature-icon--teal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="26" height="26"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
            </div>
            <h3>Real-time Sync</h3>
            <p>Changes happen instantly across all devices. Comment, attach files, and update statuses without refreshing.</p>
            <div className="lp-feature-demo">
              <div className="lp-sync-indicator">
                <span className="lp-sync-dot" />
                <span className="lp-sync-label">Syncing...</span>
              </div>
              <div className="lp-progress-track">
                <div className="lp-progress-fill" style={{width: "66%"}} />
              </div>
            </div>
          </div>

          <div className="lp-feature-card">
            <div className="lp-feature-icon lp-feature-icon--blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="26" height="26"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h3>Enterprise Security</h3>
            <p>Bank-grade encryption, SSO integration, and granular permission controls keep your intellectual property safe.</p>
            <div className="lp-feature-demo lp-feature-demo--center">
              <div className="lp-secure-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Encrypted
              </div>
            </div>
          </div>

          <div className="lp-feature-card">
            <div className="lp-feature-icon lp-feature-icon--purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="26" height="26"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </div>
            <h3>Custom Views</h3>
            <p>Work your way. Toggle between List, Kanban, Gantt, and Calendar views with a single click.</p>
            <div className="lp-feature-demo">
              <div className="lp-views-grid">
                <div className="lp-view-block" />
                <div className="lp-view-block" />
                <div className="lp-view-block" />
                <div className="lp-view-block" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ANALYTICS ── */}
      <section id="solutions" className="lp-analytics">
        <div className="lp-analytics-card" data-tour-id="analytics-card">
          <div className="lp-chart">
            <div className="lp-chart-bars">
              <div className="lp-bar" style={{height: "40%"}} />
              <div className="lp-bar" style={{height: "60%"}} />
              <div className="lp-bar" style={{height: "45%"}} />
              <div className="lp-bar lp-bar--primary" style={{height: "80%"}} />
              <div className="lp-bar" style={{height: "55%"}} />
            </div>
            <div className="lp-chart-footer">
              <div className="lp-chart-label">
                <span>Task Completion Rate</span>
                <span className="lp-chart-stat">+24%</span>
              </div>
              <div className="lp-progress-track">
                <div className="lp-progress-fill" style={{width: "80%"}} />
              </div>
            </div>
          </div>
        </div>

        <div className="lp-analytics-text">
          <span className="lp-pill lp-pill--blue">
            <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 17l1.5 1.49z"/></svg>
            Analytics
          </span>
          <h2>See the big picture,<br /><span className="lp-text-muted">down to the pixel.</span></h2>
          <p>Stop guessing where your project stands. Orcas provides automated dashboards that track progress, velocity, and team workload in real-time.</p>
          <ul className="lp-check-list">
            <li>
              <svg className="lp-check-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              Identify bottlenecks before they become blockers
            </li>
            <li>
              <svg className="lp-check-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              Automated weekly sprint reports
            </li>
            <li>
              <svg className="lp-check-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              Resource management &amp; capacity planning
            </li>
          </ul>
          <Link to="/auth" className="lp-arrow-link">
            Explore Analytics
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
          </Link>
        </div>
      </section>

      {TourComp && (
        <TourComp steps={steps} open={tourOpen} onClose={() => setTourOpen(false)} />
      )}

      {/* ── INVITE ── */}
      <section id="resources" className="lp-invite">
        <div className="lp-invite-icon-wrap">
          <div className="lp-invite-icon-pulse" />
          <div className="lp-invite-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="36" height="36"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          </div>
        </div>
        <h2>Received an invite?</h2>
        <p>Join your team's workspace instantly. Secure, fast, and ready for you to contribute.</p>
        <div className="lp-invite-box">
          <div className="lp-invite-input-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" width="18" height="18"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            <input placeholder="quicktask.link/join/..." />
          </div>
          <Link to="/auth" className="lp-btn lp-btn-dark">Join Now</Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-footer-brand">
          <div className="lp-footer-logo">
            <div className="lp-logo-icon lp-logo-icon--sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            </div>
            <span className="lp-logo-name">Orcas</span>
          </div>
          <p>Sync your team's momentum. The operating system for modern, high-performance product teams.</p>
          <div className="lp-social-links">
            <a href="#" className="lp-social-link" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </a>
            <a href="#" className="lp-social-link" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
        </div>

        <div className="lp-footer-cols">
          <div className="lp-footer-col">
            <h5>Product</h5>
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">Integrations</a>
            <a href="#">Updates</a>
          </div>
          <div className="lp-footer-col">
            <h5>Resources</h5>
            <a href="#">Documentation</a>
            <a href="#">API Reference</a>
            <a href="#">Community</a>
            <a href="#">Blog</a>
          </div>
          <div className="lp-footer-col">
            <h5>Company</h5>
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Legal</a>
            <a href="#">Contact</a>
          </div>
        </div>

        <div className="lp-footer-bottom">
          <span>© 2024 Orcas Inc. All rights reserved.</span>
          <div className="lp-footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;