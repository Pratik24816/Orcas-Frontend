// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { apiFetch } from "../services/api";
// import { useAuth } from "../context/AuthContext";
// import "./TeamLeadDashboard.css";

// const TeamLeadDashboard = () => {
//   const { user, setUser } = useAuth();
//   const navigate = useNavigate();
//   const [workspaces, setWorkspaces] = useState([]);
//   const [name, setName] = useState("");

//   const load = async () => {
//     const data = await apiFetch("/api/workspaces");
//     setWorkspaces(data);
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   const createWorkspace = async () => {
//     if (!name.trim()) return;
//     await apiFetch("/api/workspaces", {
//       method: "POST",
//       body: JSON.stringify({ name }),
//     });
//     setName("");
//     load();
//   };

//   const logout = async () => {
//     await apiFetch("/api/auth/logout", { method: "POST" });
//     setUser(null);
//     navigate("/");
//   };

//   return (
//     <div className="tl">
//       <aside className="tl-sidebar">
//         <div className="tl-brand">
//           <span className="tl-logo" />
//           Orcas
//         </div>
//         <div className="tl-section">Workspace</div>
//         <nav className="tl-nav">
//           <button className="tl-nav-item active">Dashboard</button>
//         </nav>
//         <div className="tl-section">Team</div>
//         <nav className="tl-nav">
//           <button className="tl-nav-item">
//             Members <span className="tl-pill">{workspaces.length}</span>
//           </button>
//         </nav>
//       </aside>

//       <main className="tl-main">
//         <header className="tl-topbar">
//           <div className="tl-breadcrumb">
//             Workspace <span>💼</span> Team Overview
//           </div>
//           <div className="tl-top-right">
//             <input
//               className="tl-search"
//               placeholder="Search tasks, teammates..."
//             />
//             {/* <button className="tl-icon">??</button>
//             <button className="tl-icon">?</button> */}
//             <button className="tl-logout" onClick={logout}>
//               Log out
//             </button>
//           </div>
//         </header>

//         <section className="tl-content">
//           <div className="tl-empty">
//             <div className="tl-hero" />
//             <span className="tl-cta">GET STARTED</span>
//             <h2>It&apos;s quiet in here... too quiet</h2>
//             <p>
//               Your dashboard is ready, but a team lead needs a team. Add your
//               developers to start tracking progress, assigning tasks, and
//               measuring velocity.
//             </p>
//           </div>

//           <div className="tl-panels">
//             <div className="tl-card">
//               <h3>Create Workspace</h3>
//               <div className="tl-form">
//                 <input
//                   placeholder="Workspace name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                 />
//                 <button onClick={createWorkspace}>Create</button>
//               </div>
//             </div>
//             <div className="tl-card">
//               <h3>Profile</h3>
//               <p>{user?.email}</p>
//               <p className="muted">Role: {user?.role}</p>
//             </div>
//           </div>

//           <div className="tl-workspaces">
//             {workspaces.map((ws) => (
//               <div key={ws._id} className="tl-workspace-card">
//                 <div>
//                   <h4>{ws.name}</h4>
//                   <span className="muted">Workspace</span>
//                 </div>
//                 <Link to={`/workspace/${ws._id}`}>Open</Link>
//               </div>
//             ))}
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default TeamLeadDashboard;


import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./TeamLeadDashboard.css";

const TeamLeadDashboard = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState([]);
  const [name, setName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const load = async () => {
    const data = await apiFetch("/api/workspaces");
    setWorkspaces(data);
  };

  useEffect(() => {
    load();
  }, []);

  const createWorkspace = async () => {
    if (!name.trim()) return;
    await apiFetch("/api/workspaces", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    setName("");
    load();
  };

  const logout = async () => {
    await apiFetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    navigate("/");
  };

  return (
    <div className="tl">
      {/* ── SIDEBAR ── */}
      <aside className="tl-sidebar">
        <div className="tl-brand">
          <div className="tl-logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <span className="tl-brand-name">Orcas</span>
        </div>

        <div className="tl-section-label">Workspace</div>
        <nav className="tl-nav">
          <button className="tl-nav-item tl-nav-item--active">
            <span className="tl-nav-item-inner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
              Dashboard
            </span>
          </button>
        </nav>

        <div className="tl-section-label">Team</div>
        <nav className="tl-nav">
          <button className="tl-nav-item">
            <span className="tl-nav-item-inner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Members
            </span>
            <span className="tl-pill">{workspaces.length}</span>
          </button>
        </nav>

        <div className="tl-section-label">Settings</div>
        <nav className="tl-nav">
          <button className="tl-nav-item">
            <span className="tl-nav-item-inner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
              </svg>
              Preferences
            </span>
          </button>
        </nav>

        {/* Sidebar footer */}
        <div className="tl-sidebar-footer">
          <div className="tl-user-chip">
            <div className="tl-user-avatar">
              {user?.email?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="tl-user-info">
              <span className="tl-user-email">{user?.email}</span>
              <span className="tl-user-role">{user?.role}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="tl-main">
        {/* Topbar */}
        <header className="tl-topbar">
          <div className="tl-breadcrumb">
            <span className="tl-breadcrumb-root">Workspace</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <path d="M9 18l6-6-6-6"/>
            </svg>
            <span className="tl-breadcrumb-current">Team Overview</span>
          </div>

          <div className="tl-top-right">
            <div className="tl-search-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                className="tl-search"
                placeholder="Search workspaces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button className="tl-icon-btn" title="Notifications">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>

            <button className="tl-logout" onClick={logout}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Log out
            </button>
          </div>
        </header>

        {/* Content */}
        <section className="tl-content">

          {/* Welcome banner */}
          <div className="tl-welcome">
            <div className="tl-welcome-text">
              <div className="tl-welcome-badge">
                <span className="tl-ping-wrapper">
                  <span className="tl-ping" />
                  <span className="tl-ping-dot" />
                </span>
                Team Lead Dashboard
              </div>
              <h1>
                {workspaces.length === 0
                  ? "It's quiet in here… too quiet"
                  : `Welcome back${user?.email ? ", " + user.email.split("@")[0] : ""}!`}
              </h1>
              <p>
                {workspaces.length === 0
                  ? "Your dashboard is ready, but a team lead needs a team. Create a workspace and invite your developers."
                  : "Here's an overview of your workspaces and team activity."}
              </p>
            </div>
            <div className="tl-welcome-visual" aria-hidden="true">
              <div className="tl-mini-chart">
                <div className="tl-chart-bars">
                  <div className="tl-bar" style={{height: "40%"}} />
                  <div className="tl-bar" style={{height: "65%"}} />
                  <div className="tl-bar" style={{height: "45%"}} />
                  <div className="tl-bar tl-bar--primary" style={{height: "80%"}} />
                  <div className="tl-bar" style={{height: "55%"}} />
                </div>
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="tl-stats-row">
            <div className="tl-stat-card">
              <div className="tl-stat-icon tl-stat-icon--teal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div>
                <div className="tl-stat-value">{workspaces.length}</div>
                <div className="tl-stat-label">Workspaces</div>
              </div>
            </div>
            <div className="tl-stat-card">
              <div className="tl-stat-icon tl-stat-icon--blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <div className="tl-stat-value">—</div>
                <div className="tl-stat-label">Members</div>
              </div>
            </div>
            <div className="tl-stat-card">
              <div className="tl-stat-icon tl-stat-icon--purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <polyline points="9 11 12 14 22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </div>
              <div>
                <div className="tl-stat-value">—</div>
                <div className="tl-stat-label">Tasks Done</div>
              </div>
            </div>
            <div className="tl-stat-card">
              <div className="tl-stat-icon tl-stat-icon--orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <div className="tl-stat-value">—</div>
                <div className="tl-stat-label">In Progress</div>
              </div>
            </div>
          </div>

          {/* Panels */}
          <div className="tl-panels">
            {/* Create workspace */}
            <div className="tl-card">
              <div className="tl-card-header">
                <div className="tl-card-icon-wrap tl-card-icon-wrap--teal">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                  </svg>
                </div>
                <h3>Create Workspace</h3>
              </div>
              <p className="tl-card-sub">Give your team a dedicated space to collaborate and ship.</p>
              <div className="tl-form">
                <div className="tl-input-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  </svg>
                  <input
                    placeholder="e.g. Frontend Squad"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && createWorkspace()}
                  />
                </div>
                <button className="tl-create-btn" onClick={createWorkspace}>
                  Create
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Profile */}
            <div className="tl-card">
              <div className="tl-card-header">
                <div className="tl-card-icon-wrap tl-card-icon-wrap--blue">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <h3>Profile</h3>
              </div>
              <div className="tl-profile-row">
                <div className="tl-profile-avatar">
                  {user?.email?.[0]?.toUpperCase() ?? "U"}
                </div>
                <div>
                  <p className="tl-profile-email">{user?.email}</p>
                  <span className="tl-role-badge">{user?.role}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Workspaces grid */}
          {workspaces.length > 0 && (() => {
            const filtered = searchQuery.trim()
              ? workspaces.filter((ws) => ws.name.toLowerCase().includes(searchQuery.toLowerCase()))
              : workspaces;
            return (
            <div className="tl-workspaces-section">
              <div className="tl-section-header">
                <h3>Your Workspaces</h3>
                <span className="tl-count-badge">{filtered.length}</span>
              </div>
              <div className="tl-workspaces">
                {filtered.map((ws) => (
                  <div key={ws._id} className="tl-workspace-card">
                    <div className="tl-ws-icon">
                      {ws.name?.[0]?.toUpperCase() ?? "W"}
                    </div>
                    <div className="tl-ws-info">
                      <h4>{ws.name}</h4>
                      <span className="tl-ws-meta">Workspace</span>
                    </div>
                    <Link to={`/workspace/${ws._id}`} className="tl-ws-open">
                      Open
                      <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                      </svg>
                    </Link>
                  </div>
                ))}
                {filtered.length === 0 && searchQuery.trim() && (
                  <div className="tl-no-results">
                    <p>No workspaces match "<strong>{searchQuery}</strong>"</p>
                  </div>
                )}
              </div>
            </div>
            );
          })()}

          {/* Empty state */}
          {workspaces.length === 0 && (
            <div className="tl-empty-state">
              <div className="tl-empty-visual" aria-hidden="true">
                <div className="tl-empty-icon-ring" />
                <div className="tl-empty-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="36" height="36">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
              </div>
              <h4>No workspaces yet</h4>
              <p>Create your first workspace above to get started with your team.</p>
            </div>
          )}

        </section>
      </main>
    </div>
  );
};

export default TeamLeadDashboard;