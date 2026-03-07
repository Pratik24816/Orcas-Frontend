// import { useEffect, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { apiFetch } from '../services/api';
// import TaskDetailModal from '../components/TaskDetailModal';
// import './WorkplaceDashboard.css';
// import { io } from 'socket.io-client';

// const WorkplaceDashboard = () => {
//   const { id } = useParams();
//   const [workspace, setWorkspace] = useState(null);
//   const [inviteLink, setInviteLink] = useState('');
//   const [inviteError, setInviteError] = useState('');
//   const [isInviteOpen, setIsInviteOpen] = useState(false);
//   const [inviteForm, setInviteForm] = useState({ name: '', email: '' });
//   const [pendingInvites, setPendingInvites] = useState([]);
//   const [tasks, setTasks] = useState([]);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [commentRefreshKey, setCommentRefreshKey] = useState(0);

//   const load = async () => {
//     const data = await apiFetch(`/api/workspaces/${id}`);
//     setWorkspace(data);
//     setPendingInvites(data.pendingInvites || []);
//     const taskData = await apiFetch(`/api/tasks?workspaceId=${id}`);
//     setTasks(taskData);
//   };

//   useEffect(() => {
//     load();
//   }, [id]);

//   useEffect(() => {
//     if (!id) return;
//     const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
//     const socket = io(socketUrl, { withCredentials: true });
//     socket.emit('join:workspace', id);

//     const onInviteAccepted = (payload) => {
//       // remove pending invite if present
//       setPendingInvites((prev) => prev.filter((inv) => inv._id.toString() !== payload.inviteId.toString()));

//       // add developer to workspace UI if not present
//       setWorkspace((prev) => {
//         if (!prev) return prev;
//         const exists = prev.developers?.some((d) => d._id.toString() === payload.userId.toString());
//         if (exists) return { ...prev };
//         const newDev = {
//           _id: payload.userId,
//           name: payload.name,
//           email: payload.email,
//           counts: { todo: 0, in_progress: 0, completed: 0 }
//         };
//         return { ...prev, developers: [...(prev.developers || []), newDev] };
//       });
//     };

//     socket.on('invite:accepted', onInviteAccepted);
//     return () => {
//       socket.off('invite:accepted', onInviteAccepted);
//       socket.disconnect();
//     };
//   }, [id]);

//   const invite = async () => {
//     if (!inviteForm.name.trim() || !inviteForm.email.trim()) return;
//     setInviteError('');
//     try {
//       const res = await apiFetch('/api/invitations', {
//         method: 'POST',
//         body: JSON.stringify({
//           workspaceId: id,
//           name: inviteForm.name.trim(),
//           email: inviteForm.email.trim()
//         })
//       });
//       setInviteLink(res.inviteLink);
//       setInviteForm({ name: '', email: '' });
//       await load();
//     } catch (err) {
//       setInviteError(err.message);
//     }
//   };

//   const openInviteModal = () => {
//     setInviteLink('');
//     setInviteError('');
//     setInviteForm({ name: '', email: '' });
//     setIsInviteOpen(true);
//   };

//   const shareText = inviteLink
//     ? encodeURIComponent(`You're invited to join our workspace. Use this link: ${inviteLink}`)
//     : '';

//   const shareViaSlack = () => {
//     if (!inviteLink) return;
//     window.open(`https://slack.com/share?text=${shareText}`, '_blank', 'noopener');
//   };

//   const shareViaWhatsApp = () => {
//     if (!inviteLink) return;
//     window.open(`https://wa.me/?text=${shareText}`, '_blank', 'noopener');
//   };

//   const openComments = async (task) => {
//     await apiFetch(`/api/tasks/${task._id}/read`, { method: 'POST' });
//     await load();
//     setSelectedTask(task);
//   };

//   return (
//     <div className="wp">
//       <div className="wp-container">
//         <div className="wp-hero">
//           <div>
//             <h2>{workspace?.name || 'Workspace'}</h2>
//             <p>Invite developers and track their task progress.</p>
//           </div>
//           <div className="wp-actions">
//             <button className="wp-primary-btn" onClick={openInviteModal}>
//               Add Developer
//             </button>
//             <Link to="/dashboard" className="wp-link">Back to Dashboard</Link>
//           </div>
//         </div>

//         {isInviteOpen && (
//           <div className="wp-modal-backdrop" onClick={() => setIsInviteOpen(false)}>
//             <div className="wp-modal" onClick={(e) => e.stopPropagation()}>
//               <div className="wp-modal-header">
//                 <h3>Add Developer</h3>
//                 <button className="wp-modal-close" onClick={() => setIsInviteOpen(false)}>
//                   x
//                 </button>
//               </div>
//               <div className="wp-modal-body">
//                 <label>
//                   Developer Name
//                   <input
//                     placeholder="e.g. Taylor Reed"
//                     value={inviteForm.name}
//                     onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
//                   />
//                 </label>
//                 <label>
//                   Developer Email
//                   <input
//                     placeholder="taylor@company.com"
//                     value={inviteForm.email}
//                     onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
//                   />
//                 </label>
//                 {inviteError && <p className="wp-error">{inviteError}</p>}
//                 <button className="wp-primary-btn" onClick={invite}>
//                   Generate Invite
//                 </button>
//                 {inviteLink && (
//                   <div className="wp-share">
//                     <p className="wp-note">Invite ready. Choose a sharing option:</p>
//                     <div className="wp-share-actions">
//                       <button className="wp-share-btn" onClick={shareViaSlack}>
//                         Share via Slack
//                       </button>
//                       <button className="wp-share-btn" onClick={shareViaWhatsApp}>
//                         Share via WhatsApp
//                       </button>
//                     </div>
//                     <div className="wp-share-link">
//                       <span>Invite link:</span>
//                       <span className="wp-share-url">{inviteLink}</span>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="wp-grid">
//           <div className="wp-card">
//             <h4>All Developers</h4>
//             <p className="muted">View all tasks</p>
//           </div>
//           {pendingInvites.map((invite) => {
//             const initials = invite.name?.trim()?.[0]?.toUpperCase() || 'U';
//             return (
//               <div key={`pending-${invite._id}`} className="wp-card wp-dev-card wp-pending-card">
//                 <div className="wp-pending-overlay">Pending</div>
//                 <div className="wp-pending-content">
//                   <div className="wp-dev-header">
//                     <div className="wp-avatar wp-avatar-pending">
//                       {initials}
//                     </div>
//                     <div className="wp-dev-info">
//                       <h4>{invite.name}</h4>
//                       <p className="muted wp-email">{invite.email}</p>
//                     </div>
//                   </div>
//                   <div className="wp-progress">
//                     <div className="wp-progress-label">
//                       <span>Sprint Progress</span>
//                       <span>0%</span>
//                     </div>
//                     <div className="wp-progress-bar">
//                       <div className="wp-progress-fill" style={{ width: '0%' }} />
//                     </div>
//                     <p className="muted">0 of 0 tasks completed</p>
//                   </div>
//                   <div className="wp-counts">
//                     <span>Todo: 0</span>
//                     <span>In Progress: 0</span>
//                     <span>Completed: 0</span>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//           {workspace?.developers?.map((dev) => {
//             const total =
//               (dev.counts?.todo || 0) +
//               (dev.counts?.in_progress || 0) +
//               (dev.counts?.completed || 0);
//             const pct = total ? Math.round(((dev.counts?.completed || 0) / total) * 100) : 0;
//             const initials = dev.name?.trim()?.[0]?.toUpperCase() || 'U';
//             const colors = ['#6BB8FF', '#0FB087', '#F59E0B', '#8B5CF6', '#EF4444'];
//             const color = colors[(dev.name?.length || 0) % colors.length];
//             return (
//               <Link
//                 key={dev._id}
//                 to={`/workspace/${id}/developer/${dev._id}`}
//                 className="wp-card wp-dev-card"
//               >
//                 <div className="wp-dev-header">
//                   <div className="wp-avatar" style={{ background: color }}>
//                     {initials}
//                   </div>
//                   <div className="wp-dev-info">
//                     <h4>{dev.name}</h4>
//                     <p className="muted wp-email">{dev.email}</p>
//                   </div>
//                 </div>
//                 <div className="wp-progress">
//                   <div className="wp-progress-label">
//                     <span>Sprint Progress</span>
//                     <span>{pct}%</span>
//                   </div>
//                   <div className="wp-progress-bar">
//                     <div className="wp-progress-fill" style={{ width: `${pct}%`, background: color }} />
//                   </div>
//                   <p className="muted">
//                     {dev.counts?.completed || 0} of {total} tasks completed
//                   </p>
//                 </div>
//                 <div className="wp-counts">
//                   <span>Todo: {dev.counts?.todo || 0}</span>
//                   <span>In Progress: {dev.counts?.in_progress || 0}</span>
//                   <span>Completed: {dev.counts?.completed || 0}</span>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>

//         <TaskDetailModal
//           task={selectedTask}
//           onClose={() => setSelectedTask(null)}
//           canComment
//           refreshKey={commentRefreshKey}
//         />
//       </div>
//     </div>
//   );
// };

// export default WorkplaceDashboard;


import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import TaskDetailModal from '../components/TaskDetailModal';
import './WorkplaceDashboard.css';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const WorkplaceDashboard = () => {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();
  const [workspace, setWorkspace] = useState(null);
  const [inviteLink, setInviteLink] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '' });
  const [pendingInvites, setPendingInvites] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [commentRefreshKey, setCommentRefreshKey] = useState(0);
  const [TourComp, setTourComp] = useState(null);
  const [tourOpen, setTourOpen] = useState(false);

  const steps = useMemo(() => [
    {
      id: 'welcome',
      text: 'Welcome to your workspace. This quick tour will show how to invite and manage developers.',
      buttons: [
        { text: 'Skip', action() { return this.cancel(); } },
        { text: 'Next', action() { return this.next(); }, classes: 'shepherd-button-primary' }
      ]
    },
    {
      id: 'add-dev',
      text: 'Click here to invite a developer to your workspace.',
      attachTo: { element: '[data-tour-id=\"add-developer\"]', on: 'right' }
    },
    {
      id: 'pending',
      text: 'Pending invites appear here so you can follow up.',
      attachTo: { element: '[data-tour-id=\"pending-invites\"]', on: 'left' }
    },
    {
      id: 'dev-cards',
      text: 'Developer cards show progress and quick stats for each team member.',
      attachTo: { element: '[data-tour-id=\"dev-cards\"]', on: 'top' },
      buttons: [
        { text: 'Finish', action() { return this.complete(); }, classes: 'shepherd-button-primary' }
      ]
    }
  ], []);

  // Auto-start onboarding tour for first-time team leads
  useEffect(() => {
    if (!user || tourOpen) return;
    if (user.role === 'team_lead' && user.onboardCompleted === false) {
      (async () => {
        try {
          const mod = await import('../components/Tour');
          setTourComp(() => mod.default);
          // small delay then open
          setTimeout(() => setTourOpen(true), 60);
        } catch (e) {
          // ignore
        }
      })();
    }
  }, [user, tourOpen]);

  const load = async () => {
    const data = await apiFetch(`/api/workspaces/${id}`);
    setWorkspace(data);
    setPendingInvites(data.pendingInvites || []);
    const taskData = await apiFetch(`/api/tasks?workspaceId=${id}`);
    setTasks(taskData);
  };

  useEffect(() => {
    load();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const socket = io(socketUrl, { withCredentials: true });
    socket.emit('join:workspace', id);

    const onInviteAccepted = (payload) => {
      setPendingInvites((prev) => prev.filter((inv) => inv._id.toString() !== payload.inviteId.toString()));
      setWorkspace((prev) => {
        if (!prev) return prev;
        const exists = prev.developers?.some((d) => d._id.toString() === payload.userId.toString());
        if (exists) return { ...prev };
        const newDev = {
          _id: payload.userId,
          name: payload.name,
          email: payload.email,
          counts: { todo: 0, in_progress: 0, completed: 0 }
        };
        return { ...prev, developers: [...(prev.developers || []), newDev] };
      });
    };

    // keep ref to latest load to call from socket handlers
    const loadRef = { current: load };
    // update ref on every render (so handlers call latest)
    loadRef.current = load;

    const onTaskChange = () => {
      try {
        // call the latest load function to refresh workspace & tasks
        loadRef.current();
      } catch (e) {
        // ignore
      }
    };

    socket.on('invite:accepted', onInviteAccepted);
    socket.on('task:created', onTaskChange);
    socket.on('task:updated', onTaskChange);
    socket.on('task:deleted', onTaskChange);
    return () => {
      socket.off('invite:accepted', onInviteAccepted);
      socket.off('task:created', onTaskChange);
      socket.off('task:updated', onTaskChange);
      socket.off('task:deleted', onTaskChange);
      socket.disconnect();
    };
  }, [id]);

  const invite = async () => {
    if (!inviteForm.name.trim() || !inviteForm.email.trim()) return;
    setInviteError('');
    try {
      const res = await apiFetch('/api/invitations', {
        method: 'POST',
        body: JSON.stringify({
          workspaceId: id,
          name: inviteForm.name.trim(),
          email: inviteForm.email.trim()
        })
      });
      setInviteLink(res.inviteLink);
      setInviteForm({ name: '', email: '' });
      await load();
    } catch (err) {
      setInviteError(err.message);
    }
  };

  const openInviteModal = () => {
    setInviteLink('');
    setInviteError('');
    setInviteForm({ name: '', email: '' });
    setIsInviteOpen(true);
  };

  const shareText = inviteLink
    ? encodeURIComponent(`You're invited to join our workspace. Use this link: ${inviteLink}`)
    : '';

  const shareViaSlack = () => {
    if (!inviteLink) return;
    window.open(`https://slack.com/share?text=${shareText}`, '_blank', 'noopener');
  };

  const shareViaWhatsApp = () => {
    if (!inviteLink) return;
    window.open(`https://wa.me/?text=${shareText}`, '_blank', 'noopener');
  };

  const openComments = async (task) => {
    await apiFetch(`/api/tasks/${task._id}/read`, { method: 'POST' });
    await load();
    setSelectedTask(task);
  };

  const totalDevs = (workspace?.developers?.length || 0) + pendingInvites.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;

  const devColors = ['#6BB8FF', '#0FB087', '#F59E0B', '#8B5CF6', '#EF4444'];

  return (
    <div className="wp">
      {/* Background shapes */}
      <div className="wp-bg-shapes" aria-hidden="true">
        <div className="wp-triangle-blue" />
        <div className="wp-triangle-green" />
      </div>

      {/* ── SIDEBAR ── */}
      <aside className="wp-sidebar">
        <div className="wp-brand">
          <div className="wp-logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <span className="wp-brand-name">Orcas</span>
        </div>

        <div className="wp-section-label">Navigation</div>
        <nav className="wp-nav">
          <Link to="/dashboard" className="wp-nav-item">
            <span className="wp-nav-inner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
              All Workspaces
            </span>
          </Link>
          <button className="wp-nav-item wp-nav-item--active">
            <span className="wp-nav-inner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              {workspace?.name || 'Workspace'}
            </span>
          </button>
        </nav>

        <div className="wp-section-label">Team</div>
        <nav className="wp-nav">
          <button className="wp-nav-item">
            <span className="wp-nav-inner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Developers
            </span>
            <span className="wp-pill">{workspace?.developers?.length || 0}</span>
          </button>
          <button className="wp-nav-item" data-tour-id="pending-invites">
            <span className="wp-nav-inner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              Pending Invites
            </span>
            {pendingInvites.length > 0 && (
              <span className="wp-pill wp-pill--orange">{pendingInvites.length}</span>
            )}
          </button>
        </nav>

        <div className="wp-section-label">Workspace</div>
        <nav className="wp-nav">
          <button className="wp-nav-item">
            <span className="wp-nav-inner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
              Tasks
            </span>
            <span className="wp-pill">{totalTasks}</span>
          </button>
        </nav>
      </aside>

      {/* ── MAIN ── */}
      <main className="wp-main">
        {/* Topbar */}
        <header className="wp-topbar">
          <div className="wp-breadcrumb">
            <Link to="/dashboard" className="wp-breadcrumb-root">Dashboard</Link>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
              <path d="M9 18l6-6-6-6"/>
            </svg>
            <span className="wp-breadcrumb-current">{workspace?.name || 'Workspace'}</span>
          </div>
          <div className="wp-top-actions">
            <button className="wp-invite-btn" data-tour-id="add-developer" onClick={openInviteModal}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
              Add Developer
            </button>
            <Link to="/dashboard" className="wp-back-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
              </svg>
              Back
            </Link>
          </div>
        </header>

        {/* Content */}
        <section className="wp-content">

          {/* Hero banner */}
          <div className="wp-hero-banner">
            <div className="wp-hero-text">
              <div className="wp-hero-badge">
                <span className="wp-ping-wrap"><span className="wp-ping"/><span className="wp-ping-dot"/></span>
                Live Workspace
              </div>
              <h1>{workspace?.name || 'Workspace'}</h1>
              <p>Invite developers and track their task progress in real-time.</p>
            </div>
            <div className="wp-hero-stats" aria-hidden="true">
              <div className="wp-hero-stat">
                <strong>{workspace?.developers?.length || 0}</strong>
                <span>Developers</span>
              </div>
              <div className="wp-hero-stat-div"/>
              <div className="wp-hero-stat">
                <strong>{pendingInvites.length}</strong>
                <span>Pending</span>
              </div>
              <div className="wp-hero-stat-div"/>
              <div className="wp-hero-stat">
                <strong>{totalTasks}</strong>
                <span>Tasks</span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="wp-stats-row">
            <div className="wp-stat-card">
              <div className="wp-stat-icon wp-stat-icon--teal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <div className="wp-stat-value">{workspace?.developers?.length || 0}</div>
                <div className="wp-stat-label">Active Devs</div>
              </div>
            </div>
            <div className="wp-stat-card">
              <div className="wp-stat-icon wp-stat-icon--orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <div className="wp-stat-value">{pendingInvites.length}</div>
                <div className="wp-stat-label">Pending Invites</div>
              </div>
            </div>
            <div className="wp-stat-card">
              <div className="wp-stat-icon wp-stat-icon--blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
              </div>
              <div>
                <div className="wp-stat-value">{totalTasks}</div>
                <div className="wp-stat-label">Total Tasks</div>
              </div>
            </div>
            <div className="wp-stat-card">
              <div className="wp-stat-icon wp-stat-icon--purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <polyline points="9 11 12 14 22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </div>
              <div>
                <div className="wp-stat-value">{completedTasks}</div>
                <div className="wp-stat-label">Completed</div>
              </div>
            </div>
          </div>

          {/* Developer cards section */}
          <div className="wp-devs-section">
            <div className="wp-section-header">
              <h3>Team Members</h3>
            <button className="wp-invite-btn wp-invite-btn--sm" data-tour-id="dev-cards" onClick={openInviteModal}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Invite
              </button>
            </div>

            <div className="wp-dev-grid">
              {/* All developers card */}
              <div className="wp-dev-card wp-dev-card--all">
                <div className="wp-dev-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                  </svg>
                </div>
                <h4>All Developers</h4>
                <p>View all tasks across team</p>
                <div className="wp-dev-card-footer">
                  <span className="wp-dev-count">{workspace?.developers?.length || 0} members</span>
                </div>
              </div>

              {/* Pending invites */}
              {pendingInvites.map((inv) => {
                const initials = inv.name?.trim()?.[0]?.toUpperCase() || 'U';
                return (
                  <div key={`pending-${inv._id}`} className="wp-dev-card wp-dev-card--pending">
                    <div className="wp-pending-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      Pending
                    </div>
                    <div className="wp-dev-header">
                      <div className="wp-avatar wp-avatar--pending">{initials}</div>
                      <div className="wp-dev-info">
                        <h4>{inv.name}</h4>
                        <p className="wp-dev-email">{inv.email}</p>
                      </div>
                    </div>
                    <div className="wp-progress-wrap">
                      <div className="wp-progress-meta">
                        <span>Sprint Progress</span>
                        <span className="wp-pct">0%</span>
                      </div>
                      <div className="wp-progress-track">
                        <div className="wp-progress-fill" style={{ width: '0%' }} />
                      </div>
                      <p className="wp-progress-note">Invite not yet accepted</p>
                    </div>
                    <div className="wp-task-counts">
                      <div className="wp-task-count">
                        <span className="wp-task-dot wp-task-dot--todo"/>
                        <span>0</span>
                        <span>Todo</span>
                      </div>
                      <div className="wp-task-count">
                        <span className="wp-task-dot wp-task-dot--progress"/>
                        <span>0</span>
                        <span>In Progress</span>
                      </div>
                      <div className="wp-task-count">
                        <span className="wp-task-dot wp-task-dot--done"/>
                        <span>0</span>
                        <span>Done</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Active developers */}
              {workspace?.developers?.map((dev) => {
                const total = (dev.counts?.todo || 0) + (dev.counts?.in_progress || 0) + (dev.counts?.completed || 0);
                const pct = total ? Math.round(((dev.counts?.completed || 0) / total) * 100) : 0;
                const initials = dev.name?.trim()?.[0]?.toUpperCase() || 'U';
                const color = devColors[(dev.name?.length || 0) % devColors.length];
                return (
                  <Link key={dev._id} to={`/workspace/${id}/developer/${dev._id}`} className="wp-dev-card wp-dev-card--active">
                    <div className="wp-dev-header">
                      <div className="wp-avatar" style={{ background: color }}>{initials}</div>
                      <div className="wp-dev-info">
                        <h4>{dev.name}</h4>
                        <p className="wp-dev-email">{dev.email}</p>
                      </div>
                      <svg className="wp-dev-arrow" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                      </svg>
                    </div>
                    <div className="wp-progress-wrap">
                      <div className="wp-progress-meta">
                        <span>Sprint Progress</span>
                        <span className="wp-pct">{pct}%</span>
                      </div>
                      <div className="wp-progress-track">
                        <div className="wp-progress-fill" style={{ width: `${pct}%`, background: color }} />
                      </div>
                      <p className="wp-progress-note">{dev.counts?.completed || 0} of {total} tasks completed</p>
                    </div>
                    <div className="wp-task-counts">
                      <div className="wp-task-count">
                        <span className="wp-task-dot wp-task-dot--todo"/>
                        <span>{dev.counts?.todo || 0}</span>
                        <span>Todo</span>
                      </div>
                      <div className="wp-task-count">
                        <span className="wp-task-dot wp-task-dot--progress"/>
                        <span>{dev.counts?.in_progress || 0}</span>
                        <span>In Progress</span>
                      </div>
                      <div className="wp-task-count">
                        <span className="wp-task-dot wp-task-dot--done"/>
                        <span>{dev.counts?.completed || 0}</span>
                        <span>Done</span>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {/* Empty state if no developers at all */}
              {!workspace?.developers?.length && !pendingInvites.length && (
                <div className="wp-empty-state">
                  <div className="wp-empty-icon-wrap">
                    <div className="wp-empty-pulse"/>
                    <div className="wp-empty-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <line x1="19" y1="8" x2="19" y2="14"/>
                        <line x1="22" y1="11" x2="16" y2="11"/>
                      </svg>
                    </div>
                  </div>
                  <h4>No developers yet</h4>
                  <p>Click "Add Developer" to invite your first team member.</p>
                  <button className="wp-invite-btn" onClick={openInviteModal} style={{marginTop:'16px'}}>
                    Add First Developer
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {TourComp && (
        <TourComp
          steps={steps}
          open={tourOpen}
          onClose={async () => {
            setTourOpen(false);
            try {
              await apiFetch('/api/auth/onboard/complete', { method: 'POST' });
              refreshUser && refreshUser();
            } catch (e) {
              // ignore
            }
          }}
        />
      )}

      {/* ── INVITE MODAL ── */}
      {isInviteOpen && (
        <div className="wp-modal-backdrop" onClick={() => setIsInviteOpen(false)}>
          <div className="wp-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal header */}
            <div className="wp-modal-head">
              <div className="wp-modal-title-wrap">
                <div className="wp-modal-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <line x1="19" y1="8" x2="19" y2="14"/>
                    <line x1="22" y1="11" x2="16" y2="11"/>
                  </svg>
                </div>
                <div>
                  <h3>Add Developer</h3>
                  <p>Send a secure invite link to your teammate.</p>
                </div>
              </div>
              <button className="wp-modal-close" onClick={() => setIsInviteOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="wp-modal-body">
              <div className="wp-modal-field">
                <label>Developer Name</label>
                <div className="wp-modal-input-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input
                    placeholder="e.g. Taylor Reed"
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  />
                </div>
              </div>
              <div className="wp-modal-field">
                <label>Developer Email</label>
                <div className="wp-modal-input-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    placeholder="taylor@company.com"
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  />
                </div>
              </div>

              {inviteError && (
                <div className="wp-error">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  {inviteError}
                </div>
              )}

              <button className="wp-generate-btn" onClick={invite}>
                Generate Invite Link
                <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
              </button>

              {inviteLink && (
                <div className="wp-share-panel">
                  <p className="wp-share-note">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13" style={{color:'#22c55e'}}>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Invite link generated! Share via:
                  </p>
                  <div className="wp-share-btns">
                    <button className="wp-share-btn wp-share-btn--slack" onClick={shareViaSlack}>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
                      </svg>
                      Slack
                    </button>
                    <button className="wp-share-btn wp-share-btn--whatsapp" onClick={shareViaWhatsApp}>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </button>
                  </div>
                  <div className="wp-link-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" style={{color:'#94a3b8',flexShrink:0}}>
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                    </svg>
                    <span className="wp-link-url">{inviteLink}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <TaskDetailModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        canComment
        refreshKey={commentRefreshKey}
      />
    </div>
  );
};

export default WorkplaceDashboard;