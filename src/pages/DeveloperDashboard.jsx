// import { useEffect, useMemo, useState } from 'react';
// import { DndContext, closestCenter, useDroppable } from '@dnd-kit/core';
// import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
// import { apiFetch } from '../services/api';
// import { Card, PrimaryButton } from '../components/Ui';
// import SortableTask from '../components/SortableTask';
// import { useAuth } from '../context/AuthContext';
// import { io } from 'socket.io-client';

// const columns = [
//   { id: 'todo', label: 'Todo' },
//   { id: 'in_progress', label: 'In Progress' },
//   { id: 'completed', label: 'Completed' }
// ];

// const DroppableColumn = ({ id, children }) => {
//   const { setNodeRef } = useDroppable({ id });
//   return (
//     <div ref={setNodeRef} className="space-y-3 min-h-[200px]">
//       {children}
//     </div>
//   );
// };

// const DeveloperDashboard = () => {
//   const { user } = useAuth();
//   const [tasks, setTasks] = useState([]);
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [openTaskId, setOpenTaskId] = useState(null);

//   const workspaceId = user?.workspaceId;
//   const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

//   const loadTasks = async () => {
//     if (!workspaceId) return;
//     const data = await apiFetch(`/api/tasks?workspaceId=${workspaceId}`);
//     setTasks(data);
//   };

//   useEffect(() => {
//     loadTasks();
//   }, [workspaceId]);

//   useEffect(() => {
//     if (!workspaceId) return;
//     const socket = io(socketUrl, { withCredentials: true });
//     socket.emit('join:workspace', workspaceId);
//     socket.on('task:created', loadTasks);
//     socket.on('task:updated', loadTasks);
//     socket.on('comment:created', () => {
//       loadTasks();
//     });
//     return () => socket.disconnect();
//   }, [workspaceId]);

//   const createTask = async () => {
//     if (!title.trim()) return;
//     await apiFetch('/api/tasks', {
//       method: 'POST',
//       body: JSON.stringify({ title, description, workspaceId })
//     });
//     setTitle('');
//     setDescription('');
//     loadTasks();
//   };

//   const tasksByStatus = useMemo(() => {
//     const map = { todo: [], in_progress: [], completed: [] };
//     tasks.forEach((t) => map[t.status].push(t));
//     return map;
//   }, [tasks]);

//   const onDragEnd = async (event) => {
//     const { active, over } = event;
//     if (!over) return;

//     const activeTask = tasks.find((t) => t._id === active.id);
//     if (!activeTask) return;

//     const overTask = tasks.find((t) => t._id === over.id);
//     const newStatus = overTask ? overTask.status : over.id;

//     if (activeTask.status === newStatus && overTask) {
//       const list = tasksByStatus[newStatus];
//       const oldIndex = list.findIndex((t) => t._id === activeTask._id);
//       const newIndex = list.findIndex((t) => t._id === overTask._id);
//       const updatedList = arrayMove(list, oldIndex, newIndex).map((t, idx) => ({ ...t, order: idx }));
//       const updatedTasks = tasks.map((t) =>
//         t.status === newStatus ? updatedList.find((u) => u._id === t._id) : t
//       );
//       setTasks(updatedTasks);
//       await apiFetch(`/api/tasks/${activeTask._id}`, {
//         method: 'PATCH',
//         body: JSON.stringify({ order: newIndex })
//       });
//       return;
//     }

//     const updated = tasks.map((t) => (t._id === activeTask._id ? { ...t, status: newStatus } : t));
//     setTasks(updated);
//     await apiFetch(`/api/tasks/${activeTask._id}`, {
//       method: 'PATCH',
//       body: JSON.stringify({ status: newStatus })
//     });
//   };

//   const toggleComments = async (task) => {
//     if (!task) {
//       setOpenTaskId(null);
//       return;
//     }
//     const nextId = openTaskId === task._id ? null : task._id;
//     setOpenTaskId(nextId);
//     if (nextId) {
//       await apiFetch(`/api/tasks/${task._id}/read`, { method: 'POST' });
//       await loadTasks();
//     }
//   };

//   return (
//     <div className="min-h-screen px-6 py-10">
//       <div className="max-w-6xl mx-auto space-y-8">
//         <Card>
//           <h2 className="font-heading text-2xl">Developer Dashboard</h2>
//           <p className="text-slate-600">Manage your tasks and move them across stages.</p>
//         </Card>

//         <Card>
//           <h3 className="font-heading text-xl mb-4">Add Task</h3>
//           <div className="grid md:grid-cols-3 gap-3">
//             <input
//               className="border rounded-xl px-4 py-3"
//               placeholder="Task title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />
//             <input
//               className="border rounded-xl px-4 py-3"
//               placeholder="Description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//             <PrimaryButton onClick={createTask}>Add</PrimaryButton>
//           </div>
//         </Card>

//         <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
//           <div className="grid md:grid-cols-3 gap-6">
//             {columns.map((col) => (
//               <Card key={col.id}>
//                 <h4 className="font-heading text-lg mb-3">{col.label}</h4>
//                 <SortableContext
//                   items={tasksByStatus[col.id].map((t) => t._id)}
//                   strategy={verticalListSortingStrategy}
//                 >
//                   <DroppableColumn id={col.id}>
//                     {tasksByStatus[col.id].map((task) => (
//                       <div key={task._id}>
//                         <SortableTask
//                           task={task}
//                           onToggleComments={toggleComments}
//                           isOpen={openTaskId === task._id}
//                           onPosted={loadTasks}
//                         />
//                       </div>
//                     ))}
//                   </DroppableColumn>
//                 </SortableContext>
//               </Card>
//             ))}
//           </div>
//         </DndContext>
//       </div>
//     </div>
//   );
// };

// export default DeveloperDashboard;


import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, closestCenter, useDroppable } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { apiFetch } from '../services/api';
import SortableTask from '../components/SortableTask';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import './DeveloperDashboard.css';

const columns = [
  { id: 'todo',        label: 'To Do',       dot: '#94a3b8' },
  { id: 'in_progress', label: 'In Progress',  dot: '#f97316' },
  { id: 'completed',   label: 'Completed',    dot: '#008a75' },
];

const DroppableColumn = ({ id, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`dd-cards${isOver ? ' dd-cards--over' : ''}`}>
      {children}
    </div>
  );
};

const DeveloperDashboard = () => {
  const { user, setUser, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [becomeLeadOpen, setBecomeLeadOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [becomeLeadError, setBecomeLeadError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [openTaskId, setOpenTaskId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const workspaceId = user?.workspaceId;
  const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const loadTasks = async () => {
    if (!workspaceId) return;
    const data = await apiFetch(`/api/tasks?workspaceId=${workspaceId}`);
    setTasks(data);
  };

  useEffect(() => { loadTasks(); }, [workspaceId]);

  useEffect(() => {
    if (!workspaceId) return;
    const socket = io(socketUrl, { withCredentials: true });
    socket.emit('join:workspace', workspaceId);
    socket.on('task:created', loadTasks);
    socket.on('task:updated', loadTasks);
    socket.on('comment:created', () => { loadTasks(); });
    return () => socket.disconnect();
  }, [workspaceId]);

  const createTask = async () => {
    if (!title.trim()) return;
    await apiFetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title, description, workspaceId, priority })
    });
    setTitle('');
    setDescription('');
    setPriority('medium');
    loadTasks();
  };

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q));
    }
    if (priorityFilter !== 'all') {
      result = result.filter((t) => t.priority === priorityFilter);
    }
    return result;
  }, [tasks, searchQuery, priorityFilter]);

  const tasksByStatus = useMemo(() => {
    const map = { todo: [], in_progress: [], completed: [] };
    filteredTasks.forEach((t) => map[t.status].push(t));
    return map;
  }, [filteredTasks]);

  const onDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;
    const activeTask = tasks.find((t) => t._id === active.id);
    if (!activeTask) return;
    const overTask = tasks.find((t) => t._id === over.id);
    const newStatus = overTask ? overTask.status : over.id;

    if (activeTask.status === newStatus && overTask) {
      const list = tasksByStatus[newStatus];
      const oldIndex = list.findIndex((t) => t._id === activeTask._id);
      const newIndex = list.findIndex((t) => t._id === overTask._id);
      const updatedList = arrayMove(list, oldIndex, newIndex).map((t, idx) => ({ ...t, order: idx }));
      const updatedTasks = tasks.map((t) =>
        t.status === newStatus ? updatedList.find((u) => u._id === t._id) : t
      );
      setTasks(updatedTasks);
      await apiFetch(`/api/tasks/${activeTask._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ order: newIndex })
      });
      return;
    }

    const updated = tasks.map((t) => (t._id === activeTask._id ? { ...t, status: newStatus } : t));
    setTasks(updated);
    await apiFetch(`/api/tasks/${activeTask._id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus })
    });
  };

  const toggleComments = async (task) => {
    if (!task) { setOpenTaskId(null); return; }
    const nextId = openTaskId === task._id ? null : task._id;
    setOpenTaskId(nextId);
    if (nextId) {
      await apiFetch(`/api/tasks/${task._id}/read`, { method: 'POST' });
      await loadTasks();
    }
  };

  const handleBecomeTeamLead = async (e) => {
    e?.preventDefault();
    if (!newWorkspaceName.trim()) {
      setBecomeLeadError('Enter a workspace name');
      return;
    }
    setBecomeLeadError('');
    try {
      const res = await apiFetch('/api/auth/become-team-lead', {
        method: 'POST',
        body: JSON.stringify({ name: newWorkspaceName.trim() }),
      });
      setUser(res.user);
      refreshUser();
      setBecomeLeadOpen(false);
      setNewWorkspaceName('');
      navigate('/dashboard');
    } catch (err) {
      setBecomeLeadError(err.message || 'Failed to create workspace');
    }
  };

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const todo = tasks.filter(t => t.status === 'todo').length;
  const pct = total ? Math.round((completed / total) * 100) : 0;
  const initials = user?.name?.trim()?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'D';

  return (
    <div className="dd">
      {/* Background shapes */}
      <div className="dd-bg-shapes" aria-hidden="true">
        <div className="dd-triangle-blue" />
        <div className="dd-triangle-green" />
        <div className="dd-dot-grid" />
      </div>

      {/* ── TOPBAR ── */}
      <header className="dd-topbar">
        <div className="dd-logo">
          <div className="dd-logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <span className="dd-logo-name">Orcas</span>
        </div>

        <div className="dd-topbar-right">
          <button
            type="button"
            className="dd-become-lead-btn"
            onClick={() => setBecomeLeadOpen(true)}
            title="Create your own workspace"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            Create workspace
          </button>
          <div className="dd-live-badge">
            <span className="dd-ping-wrap">
              <span className="dd-ping" />
              <span className="dd-ping-dot" />
            </span>
            Live
          </div>
          <div className="dd-user-chip">
            <div className="dd-user-avatar">{initials}</div>
            <span className="dd-user-label">{user?.email}</span>
          </div>
        </div>
      </header>

      {/* Become team lead modal */}
      {becomeLeadOpen && (
        <div className="dd-modal-backdrop" onClick={() => { setBecomeLeadOpen(false); setBecomeLeadError(''); }}>
          <div className="dd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dd-modal-head">
              <h3>Create your own workspace</h3>
              <button type="button" className="dd-modal-close" onClick={() => { setBecomeLeadOpen(false); setBecomeLeadError(''); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <p className="dd-modal-sub">Become a team lead and create your own workspace to invite developers.</p>
            <form onSubmit={handleBecomeTeamLead}>
              <div className="dd-input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                </svg>
                <input
                  placeholder="e.g. My Squad"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  autoFocus
                />
              </div>
              {becomeLeadError && <p className="dd-modal-error">{becomeLeadError}</p>}
              <button type="submit" className="dd-add-btn">Create workspace</button>
            </form>
          </div>
        </div>
      )}

      <div className="dd-body">

        {/* ── WELCOME BANNER ── */}
        <section className="dd-banner">
          <div className="dd-banner-text">
            <div className="dd-banner-badge">
              <span className="dd-ping-wrap">
                <span className="dd-ping" />
                <span className="dd-ping-dot" />
              </span>
              Developer Dashboard
            </div>
            <h1>Hey {user?.name?.split(' ')[0] || 'Developer'} 👋</h1>
            <p>Manage your tasks and move them across stages. Drag cards between columns to update status.</p>
          </div>
          <div className="dd-banner-visual" aria-hidden="true">
            <div className="dd-mini-chart">
              <div className="dd-chart-bars">
                <div className="dd-bar" style={{height: `${Math.max(20, todo * 20)}%`}} />
                <div className="dd-bar dd-bar--orange" style={{height: `${Math.max(20, inProgress * 20)}%`}} />
                <div className="dd-bar dd-bar--primary" style={{height: `${Math.max(20, completed * 20)}%`}} />
              </div>
              <div className="dd-chart-label">{pct}% done</div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <div className="dd-stats-row">
          <div className="dd-stat-card">
            <div className="dd-stat-icon dd-stat-icon--slate">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
            </div>
            <div><div className="dd-stat-value">{total}</div><div className="dd-stat-label">Total Tasks</div></div>
          </div>
          <div className="dd-stat-card">
            <div className="dd-stat-icon dd-stat-icon--slate">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div><div className="dd-stat-value">{todo}</div><div className="dd-stat-label">To Do</div></div>
          </div>
          <div className="dd-stat-card">
            <div className="dd-stat-icon dd-stat-icon--orange">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <div><div className="dd-stat-value dd-stat-value--orange">{inProgress}</div><div className="dd-stat-label">In Progress</div></div>
          </div>
          <div className="dd-stat-card">
            <div className="dd-stat-icon dd-stat-icon--teal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </div>
            <div><div className="dd-stat-value dd-stat-value--teal">{completed}</div><div className="dd-stat-label">Completed</div></div>
          </div>
        </div>

        {/* ── PROGRESS BAR ── */}
        {total > 0 && (
          <div className="dd-progress-card">
            <div className="dd-progress-meta">
              <span>Sprint Progress</span>
              <span>{completed} of {total} completed · {pct}%</span>
            </div>
            <div className="dd-progress-track">
              <div className="dd-progress-fill" style={{width: `${pct}%`}} />
            </div>
          </div>
        )}

        {/* ── SEARCH & FILTER ── */}
        <div className="dd-filter-bar">
          <div className="dd-search-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="dd-search"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="dd-priority-filter"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        {/* ── ADD TASK ── */}
        <div className="dd-add-card">
          <div className="dd-add-header">
            <div className="dd-add-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <h3>Add New Task</h3>
          </div>
          <div className="dd-add-form">
            <div className="dd-input-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <line x1="21" y1="6" x2="3" y2="6"/><line x1="15" y1="12" x2="3" y2="12"/><line x1="17" y1="18" x2="3" y2="18"/>
              </svg>
              <input
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createTask()}
              />
            </div>
            <div className="dd-input-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <input
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createTask()}
              />
            </div>
            <select
              className="dd-priority-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <button className="dd-add-btn" onClick={createTask} disabled={!title.trim()}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Task
            </button>
          </div>
        </div>

        {/* ── KANBAN BOARD ── */}
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <section className="dd-board">
            {columns.map((col) => {
              const count = tasksByStatus[col.id].length;
              return (
                <div key={col.id} className="dd-column">
                  <div className="dd-col-head">
                    <div className="dd-col-title">
                      <span className="dd-col-dot" style={{background: col.dot}} />
                      <h4>{col.label}</h4>
                    </div>
                    <span className="dd-col-count">{count}</span>
                  </div>

                  <SortableContext
                    items={tasksByStatus[col.id].map((t) => t._id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <DroppableColumn id={col.id}>
                      {tasksByStatus[col.id].map((task) => (
                        <div key={task._id}>
                          <SortableTask
                            task={task}
                            onToggleComments={toggleComments}
                            isOpen={openTaskId === task._id}
                            onPosted={loadTasks}
                          />
                        </div>
                      ))}
                      {count === 0 && (
                        <div className="dd-col-empty">Drop tasks here</div>
                      )}
                    </DroppableColumn>
                  </SortableContext>
                </div>
              );
            })}
          </section>
        </DndContext>

      </div>
    </div>
  );
};

export default DeveloperDashboard;