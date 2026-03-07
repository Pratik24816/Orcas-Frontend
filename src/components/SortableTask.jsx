import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import InlineComments from './InlineComments';

const ChatIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 4h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const SortableTask = ({ task, onToggleComments, isOpen, onPosted }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task._id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border rounded-xl p-3 shadow-sm"
    >
      <div className="flex items-center justify-between gap-2">
        <h5 className="font-semibold text-brand-deep">{task.title}</h5>
        {task.unreadCount > 0 && (
          <span className="h-2 w-2 rounded-full bg-red-500" />
        )}
      </div>
      {task.priority && (
        <span className={`priority-badge priority-badge--${task.priority}`}>{task.priority}</span>
      )}
      {task.description && <p className="text-sm text-slate-600 mt-1">{task.description}</p>}
      <div className="mt-3 flex items-center justify-between">
        <button
          className="text-xs text-brand-blue font-semibold"
          onClick={(e) => {
            e.stopPropagation();
            onToggleComments(task);
          }}
          aria-label="Open comments"
        >
          <ChatIcon />
        </button>
        <div
          className="text-xs text-slate-500 cursor-grab"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          title="Drag"
        >
          Drag
        </div>
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

export default SortableTask;
