import { useEffect, useMemo, useState } from 'react';
import { Card, PrimaryButton, GhostButton } from './Ui';
import { apiFetch } from '../services/api';

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join('') || 'U';
};

const CommentRow = ({ comment, onReply, canComment, replyingTo }) => {
  const authorName = comment.author?.name || 'Unknown';
  return (
    <div className="flex gap-3">
      <div className="h-10 w-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-semibold">
        {getInitials(authorName)}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-brand-deep">{authorName}</p>
          <p className="text-xs text-slate-500">
            {new Date(comment.createdAt).toLocaleString()}
          </p>
        </div>
        {replyingTo && (
          <p className="text-xs text-slate-500 mt-1">Replying to @{replyingTo}</p>
        )}
        <p className="text-slate-700 mt-1">{comment.body}</p>
        {canComment && (
          <button
            className="text-xs text-brand-blue font-semibold mt-2"
            onClick={() => onReply(comment._id)}
          >
            Reply
          </button>
        )}
      </div>
    </div>
  );
};

const TaskDetailModal = ({ task, onClose, canComment, refreshKey = 0 }) => {
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [openReplies, setOpenReplies] = useState({});

  const loadComments = async () => {
    if (!task) return;
    const data = await apiFetch(`/api/tasks/${task._id}/comments`);
    setComments(data);
  };

  useEffect(() => {
    loadComments();
    setReplyTo(null);
  }, [task?._id, refreshKey]);

  const { roots, childrenMap, byId } = useMemo(() => {
    const map = new Map();
    const idMap = new Map();
    comments.forEach((c) => {
      idMap.set(c._id, c);
      const parentId = c.parentComment || null;
      if (!map.has(parentId)) map.set(parentId, []);
      map.get(parentId).push(c);
    });
    return { roots: map.get(null) || [], childrenMap: map, byId: idMap };
  }, [comments]);

  const addComment = async () => {
    if (!commentBody.trim()) return;
    await apiFetch(`/api/tasks/${task._id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ body: commentBody, parentId: replyTo })
    });
    setCommentBody('');
    setReplyTo(null);
    loadComments();
  };

  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <Card className="w-full max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-heading text-2xl">{task.title}</h3>
            <p className="text-slate-600">Status: {task.status}</p>
            {task.description && <p className="text-slate-700 mt-3">{task.description}</p>}
          </div>
          <GhostButton onClick={onClose}>Close</GhostButton>
        </div>

        <div className="mt-6">
          <h4 className="font-heading text-lg">Comments</h4>
          <div className="space-y-6 mt-4 max-h-80 overflow-y-auto">
            {roots.map((c) => {
              const replies = childrenMap.get(c._id) || [];
              const replyCount = replies.length;
              const isOpen = openReplies[c._id] ?? false;
              return (
                <div key={c._id} className="border-b pb-4">
                  <div className="relative pl-4">
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-slate-200" />
                    <CommentRow comment={c} onReply={setReplyTo} canComment={canComment} />
                  </div>
                  {replyCount > 0 && (
                    <button
                      className="text-xs text-brand-blue font-semibold mt-3"
                      onClick={() =>
                        setOpenReplies((prev) => ({ ...prev, [c._id]: !isOpen }))
                      }
                    >
                      {replyCount} {replyCount === 1 ? 'reply' : 'replies'} {isOpen ? '▴' : '▾'}
                    </button>
                  )}
                  {replyCount > 0 && (
                    <div
                      className={`overflow-hidden transition-[max-height] duration-300 ${
                        isOpen ? 'max-h-[600px]' : 'max-h-0'
                      }`}
                    >
                      <div className="mt-3 space-y-4">
                        {replies.map((r) => {
                          const parent = r.parentComment ? byId.get(r.parentComment) : null;
                          return (
                            <div key={r._id} className="relative pl-4">
                              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-slate-100" />
                              <CommentRow
                                comment={r}
                                onReply={setReplyTo}
                                canComment={canComment}
                                replyingTo={parent?.author?.name}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {!comments.length && <p className="text-slate-500">No comments yet.</p>}
          </div>

          {canComment && (
            <div className="mt-4 border rounded-2xl p-3 bg-white">
              <div className="flex gap-3">
                <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-600">
                  B
                </div>
                <input
                  className="flex-1 px-2 py-2 outline-none"
                  placeholder={replyTo ? 'Reply...' : 'Add a comment...'}
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between mt-3 text-slate-500">
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-semibold">B</span>
                  <span className="italic">I</span>
                  <span className="underline">U</span>
                  <span className="line-through">S</span>
                  <span>&lt;/&gt;</span>
                </div>
                <PrimaryButton onClick={addComment}>
                  {replyTo ? 'Reply' : 'Send'}
                </PrimaryButton>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TaskDetailModal;
