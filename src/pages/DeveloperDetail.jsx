// import { useEffect, useMemo, useState } from 'react';
// import { DndContext, closestCenter, useDroppable } from '@dnd-kit/core';
// import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { apiFetch } from '../services/api';
// import InlineComments from '../components/InlineComments';
// import './DeveloperDetail.css';

// const ChatIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path
//       d="M5 4h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
//       stroke="currentColor"
//       strokeWidth="1.5"
//       strokeLinejoin="round"
//     />
//   </svg>
// );

// const DroppableColumn = ({ id, children }) => {
//   const { setNodeRef } = useDroppable({ id });
//   return (
//     <div ref={setNodeRef} className="dev-cards">
//       {children}
//     </div>
//   );
// };

// const SortableDevTask = ({ task, onToggleComments, isOpen, onPosted }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task._id });
//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition
//   };

//   return (
//     <div ref={setNodeRef} style={style} className="dev-task">
//       <div className="dev-task-actions">
//         <button onClick={() => onToggleComments(task)} aria-label="Open comments">
//           <ChatIcon />
//         </button>
//         <button
//           className="dev-drag"
//           {...attributes}
//           {...listeners}
//           onClick={(e) => e.stopPropagation()}
//           title="Drag"
//           type="button"
//         >
//           Drag
//         </button>
//       </div>
//       <div className="dev-task-title">{task.title}</div>
//       {task.description && <p>{task.description}</p>}
//       <div className="dev-task-meta">
//         <span>Status: {task.status}</span>
//         {task.unreadCount > 0 && <span className="dev-dot" />}
//       </div>
//       <InlineComments
//         task={task}
//         isOpen={isOpen}
//         onClose={() => onToggleComments(null)}
//         onPosted={onPosted}
//       />
//     </div>
//   );
// };

// const DeveloperDetail = () => {
//   const { id, devId } = useParams();
//   const navigate = useNavigate();
//   const [workspace, setWorkspace] = useState(null);
//   const [tasks, setTasks] = useState([]);
//   const [openTaskId, setOpenTaskId] = useState(null);
//   const [filter, setFilter] = useState('all');

//   const load = async () => {
//     const ws = await apiFetch(`/api/workspaces/${id}`);
//     setWorkspace(ws);
//     const taskData = await apiFetch(`/api/tasks?workspaceId=${id}`);
//     setTasks(taskData);
//   };

//   useEffect(() => {
//     load();
//   }, [id]);

//   const dev = useMemo(
//     () => workspace?.developers?.find((d) => d._id === devId),
//     [workspace, devId]
//   );

//   const devTasks = useMemo(
//     () => tasks.filter((t) => t.assignee?._id === devId),
//     [tasks, devId]
//   );

//   const filteredTasks = useMemo(() => {
//     if (filter === 'all') return devTasks;
//     return devTasks.filter((t) => t.status === filter);
//   }, [devTasks, filter]);

//   const tasksByStatus = useMemo(() => {
//     const map = { todo: [], in_progress: [], completed: [] };
//     filteredTasks.forEach((t) => map[t.status].push(t));
//     return map;
//   }, [filteredTasks]);

//   const onDragEnd = async (event) => {
//     const { active, over } = event;
//     if (!over) return;

//     const activeTask = devTasks.find((t) => t._id === active.id);
//     if (!activeTask) return;

//     const overTask = devTasks.find((t) => t._id === over.id);
//     const newStatus = overTask ? overTask.status : over.id;

//     if (activeTask.status === newStatus) return;

//     setTasks((prev) =>
//       prev.map((t) => (t._id === activeTask._id ? { ...t, status: newStatus } : t))
//     );

//     await apiFetch(`/api/tasks/${activeTask._id}`, {
//       method: 'PATCH',
//       body: JSON.stringify({ status: newStatus })
//     });
//     await load();
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
//       await load();
//     }
//   };

//   const initials = dev?.name?.trim()?.[0]?.toUpperCase() || 'U';

//   return (
//     <div className="dev">
//       <header className="dev-top">
//         <div className="dev-breadcrumb">
//           <Link to="/dashboard">Dashboard</Link>
//           <span>�</span>
//           <Link to={`/workspace/${id}`}>Workspace</Link>
//           <span>�</span>
//           <span>{dev?.name || 'Developer'}</span>
//         </div>
//         <button className="dev-back" onClick={() => navigate(`/workspace/${id}`)}>
//           Back to Workspace
//         </button>
//       </header>

//       <section className="dev-header">
//         <div className="dev-profile">
//           <div className="dev-avatar">{initials}</div>
//           <div>
//             <h2>{dev?.name || 'Developer'}</h2>
//             <p>{dev?.email}</p>
//           </div>
//         </div>
//         <div className="dev-actions">
//           <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
//             Board
//           </button>
//           <button className={filter === 'todo' ? 'active' : ''} onClick={() => setFilter('todo')}>
//             Todo
//           </button>
//           <button
//             className={filter === 'in_progress' ? 'active' : ''}
//             onClick={() => setFilter('in_progress')}
//           >
//             In Progress
//           </button>
//           <button
//             className={filter === 'completed' ? 'active' : ''}
//             onClick={() => setFilter('completed')}
//           >
//             Completed
//           </button>
//         </div>
//       </section>

//       <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
//         <section className="dev-board">
//           {['todo', 'in_progress', 'completed'].map((status) => (
//             <div key={status} className="dev-column">
//               <div className="dev-column-title">
//                 <h3>
//                   {status === 'todo'
//                     ? 'To Do'
//                     : status === 'in_progress'
//                     ? 'In Progress'
//                     : 'Completed'}
//                 </h3>
//                 <span>{tasksByStatus[status].length}</span>
//               </div>
//               <SortableContext
//                 items={tasksByStatus[status].map((t) => t._id)}
//                 strategy={verticalListSortingStrategy}
//               >
//                 <DroppableColumn id={status}>
//                   {tasksByStatus[status].map((task) => (
//                     <SortableDevTask
//                       key={task._id}
//                       task={task}
//                       onToggleComments={toggleComments}
//                       isOpen={openTaskId === task._id}
//                       onPosted={load}
//                     />
//                   ))}
//                 </DroppableColumn>
//               </SortableContext>
//             </div>
//           ))}
//         </section>
//       </DndContext>
//     </div>
//   );
// };

// export default DeveloperDetail;


import { useEffect, useMemo, useState } from 'react';
import { DndContext, closestCenter, useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import InlineComments from '../components/InlineComments';
import './DeveloperDetail.css';
import { io } from 'socket.io-client';
import { useRef } from 'react';

const ChatIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 4h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const DragIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="5" r="1" fill="currentColor" stroke="none"/>
    <circle cx="15" cy="5" r="1" fill="currentColor" stroke="none"/>
    <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none"/>
    <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none"/>
    <circle cx="9" cy="19" r="1" fill="currentColor" stroke="none"/>
    <circle cx="15" cy="19" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

const statusMeta = {
  todo:        { label: 'To Do',       dot: '#94a3b8', accent: '#64748b', bg: 'rgba(100,116,139,0.08)' },
  in_progress: { label: 'In Progress', dot: '#f97316', accent: '#f97316', bg: 'rgba(249,115,22,0.08)'  },
  completed:   { label: 'Completed',   dot: '#008a75', accent: '#008a75', bg: 'rgba(0,138,117,0.08)'   },
};

const DroppableColumn = ({ id, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`dev-cards${isOver ? ' dev-cards--over' : ''}`}>
      {children}
    </div>
  );
};

const SortableDevTask = ({ task, onToggleComments, isOpen, onPosted }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
  };
  const meta = statusMeta[task.status] || statusMeta.todo;

  return (
    <div ref={setNodeRef} style={style} className={`dev-task${isDragging ? ' dev-task--dragging' : ''}`}>
      <div className="dev-task-top">
        <span className="dev-task-status-dot" style={{ background: meta.dot }} />
        <div className="dev-task-controls">
          {task.unreadCount > 0 && <span className="dev-unread-badge">{task.unreadCount}</span>}
          <button
            className="dev-ctrl-btn dev-ctrl-btn--comment"
            onClick={() => onToggleComments(task)}
            aria-label="Open comments"
            title="Comments"
          >
            <ChatIcon />
          </button>
          <button
            className="dev-ctrl-btn dev-ctrl-btn--drag"
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            title="Drag to reorder"
            type="button"
          >
            <DragIcon />
          </button>
        </div>
      </div>

      <div className="dev-task-title">{task.title}</div>
      {task.description && <p className="dev-task-desc">{task.description}</p>}

      <div className="dev-task-footer">
        {task.priority && (
          <span className={`priority-badge priority-badge--${task.priority}`}>{task.priority}</span>
        )}
        <span className="dev-task-status-chip" style={{ background: meta.bg, color: meta.accent }}>
          {meta.label}
        </span>
      </div>

      <InlineComments
        task={task}
        isOpen={isOpen}
        onClose={() => onToggleComments(null)}
        onPosted={onPosted}
      />
    </div>
  );
};

const DeveloperDetail = () => {
  const { id, devId } = useParams();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [openTaskId, setOpenTaskId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const load = async () => {
    const ws = await apiFetch(`/api/workspaces/${id}`);
    setWorkspace(ws);
    const taskData = await apiFetch(`/api/tasks?workspaceId=${id}`);
    setTasks(taskData);
  };

  useEffect(() => { load(); }, [id]);
  // keep ref to latest load to use inside socket handlers without re-subscribing
  const loadRef = useRef(load);
  useEffect(() => {
    loadRef.current = load;
  }, [load]);

  // Socket.IO: join workspace room and listen for task events to refresh UI in real-time
  useEffect(() => {
    if (!id) return;
    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const socket = io(socketUrl, { withCredentials: true });
    socket.emit('join:workspace', id);

    const onTaskChange = () => {
      // call latest load function
      try { loadRef.current(); } catch (e) { /* ignore */ }
    };

    socket.on('task:created', onTaskChange);
    socket.on('task:updated', onTaskChange);
    socket.on('task:deleted', onTaskChange);

    return () => {
      socket.off('task:created', onTaskChange);
      socket.off('task:updated', onTaskChange);
      socket.off('task:deleted', onTaskChange);
      socket.disconnect();
    };
  }, [id]);

  const dev = useMemo(
    () => workspace?.developers?.find((d) => d._id === devId),
    [workspace, devId]
  );

  const devTasks = useMemo(
    () => tasks.filter((t) => t.assignee?._id === devId),
    [tasks, devId]
  );

  const filteredTasks = useMemo(() => {
    let result = devTasks;
    if (filter !== 'all') result = result.filter((t) => t.status === filter);
    if (priorityFilter !== 'all') result = result.filter((t) => t.priority === priorityFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q));
    }
    return result;
  }, [devTasks, filter, priorityFilter, searchQuery]);

  const tasksByStatus = useMemo(() => {
    const map = { todo: [], in_progress: [], completed: [] };
    filteredTasks.forEach((t) => map[t.status].push(t));
    return map;
  }, [filteredTasks]);

  const onDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;
    const activeTask = devTasks.find((t) => t._id === active.id);
    if (!activeTask) return;
    const overTask = devTasks.find((t) => t._id === over.id);
    const newStatus = overTask ? overTask.status : over.id;
    if (activeTask.status === newStatus) return;
    setTasks((prev) =>
      prev.map((t) => (t._id === activeTask._id ? { ...t, status: newStatus } : t))
    );
    await apiFetch(`/api/tasks/${activeTask._id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus })
    });
    await load();
  };

  const toggleComments = async (task) => {
    if (!task) { setOpenTaskId(null); return; }
    const nextId = openTaskId === task._id ? null : task._id;
    setOpenTaskId(nextId);
    if (nextId) {
      await apiFetch(`/api/tasks/${task._id}/read`, { method: 'POST' });
      await load();
    }
  };

  const initials = dev?.name?.trim()?.[0]?.toUpperCase() || 'U';
  const devColors = ['#6BB8FF', '#0FB087', '#F59E0B', '#8B5CF6', '#EF4444'];
  const avatarColor = devColors[(dev?.name?.length || 0) % devColors.length];

  const total = devTasks.length;
  const completed = devTasks.filter(t => t.status === 'completed').length;
  const inProgress = devTasks.filter(t => t.status === 'in_progress').length;
  const todo = devTasks.filter(t => t.status === 'todo').length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  const filters = [
    { key: 'all',         label: 'All Tasks' },
    { key: 'todo',        label: 'To Do' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'completed',   label: 'Completed' },
  ];

  return (
    <div className="dev">
      {/* Background shapes */}
      <div className="dev-bg-shapes" aria-hidden="true">
        <div className="dev-triangle-blue" />
        <div className="dev-triangle-green" />
      </div>

      {/* ── TOPBAR ── */}
      <header className="dev-topbar">
        <div className="dev-breadcrumb">
          <Link to="/dashboard">Dashboard</Link>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><path d="M9 18l6-6-6-6"/></svg>
          <Link to={`/workspace/${id}`}>Workspace</Link>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><path d="M9 18l6-6-6-6"/></svg>
          <span>{dev?.name || 'Developer'}</span>
        </div>
        <button className="dev-back-btn" onClick={() => navigate(`/workspace/${id}`)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
            <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
          </svg>
          Back to Workspace
        </button>
      </header>

      <div className="dev-body">

        {/* ── PROFILE CARD ── */}
        <section className="dev-profile-card">
          <div className="dev-profile-left">
            <div className="dev-avatar" style={{ background: avatarColor }}>{initials}</div>
            <div className="dev-profile-info">
              <h2>{dev?.name || 'Developer'}</h2>
              <p>{dev?.email}</p>
              <span className="dev-role-badge">Developer</span>
            </div>
          </div>

          <div className="dev-profile-stats">
            <div className="dev-pstat">
              <strong>{todo}</strong>
              <span>To Do</span>
            </div>
            <div className="dev-pstat-div"/>
            <div className="dev-pstat">
              <strong style={{color:'#f97316'}}>{inProgress}</strong>
              <span>In Progress</span>
            </div>
            <div className="dev-pstat-div"/>
            <div className="dev-pstat">
              <strong style={{color:'#008a75'}}>{completed}</strong>
              <span>Completed</span>
            </div>
            <div className="dev-pstat-div"/>
            <div className="dev-pstat">
              <strong>{pct}%</strong>
              <span>Progress</span>
            </div>
          </div>
        </section>

        {/* Progress bar */}
        <div className="dev-progress-bar-wrap">
          <div className="dev-progress-meta">
            <span>Sprint Progress</span>
            <span>{completed} of {total} tasks completed</span>
          </div>
          <div className="dev-progress-track">
            <div className="dev-progress-fill" style={{width: `${pct}%`}}/>
          </div>
        </div>

        {/* ── FILTER TABS ── */}
        <div className="dev-filter-row">
          <div className="dev-filters">
            {filters.map(f => (
              <button
                key={f.key}
                className={`dev-filter-btn${filter === f.key ? ' dev-filter-btn--active' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
                <span className="dev-filter-count">
                  {f.key === 'all' ? devTasks.length : devTasks.filter(t => t.status === f.key).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── SEARCH & PRIORITY FILTER ── */}
        <div className="dev-search-bar">
          <div className="dev-search-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="dev-search-input"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="dev-priority-filter"
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

        {/* ── KANBAN BOARD ── */}
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <section className="dev-board">
            {['todo', 'in_progress', 'completed'].map((status) => {
              const meta = statusMeta[status];
              const count = tasksByStatus[status].length;
              return (
                <div key={status} className="dev-column">
                  <div className="dev-column-head">
                    <div className="dev-column-title">
                      <span className="dev-col-dot" style={{background: meta.dot}}/>
                      <h3>{meta.label}</h3>
                    </div>
                    <span className="dev-col-count">{count}</span>
                  </div>

                  <SortableContext
                    items={tasksByStatus[status].map((t) => t._id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <DroppableColumn id={status}>
                      {tasksByStatus[status].map((task) => (
                        <SortableDevTask
                          key={task._id}
                          task={task}
                          onToggleComments={toggleComments}
                          isOpen={openTaskId === task._id}
                          onPosted={load}
                        />
                      ))}
                      {tasksByStatus[status].length === 0 && (
                        <div className="dev-col-empty">
                          Drop tasks here
                        </div>
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

export default DeveloperDetail;