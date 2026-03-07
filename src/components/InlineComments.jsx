import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../services/api';
import './InlineComments.css';

const InlineComments = ({ task, isOpen, onClose, onPosted }) => {
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState('');
  const [replyTo, setReplyTo] = useState(null);

  const load = async () => {
    if (!task) return;
    const data = await apiFetch(`/api/tasks/${task._id}/comments`);
    setComments(data);
  };

  useEffect(() => {
    if (isOpen) load();
  }, [isOpen, task?._id]);

  const byId = useMemo(() => {
    const map = new Map();
    comments.forEach((c) => map.set(c._id, c));
    return map;
  }, [comments]);

  const addComment = async () => {
    if (!commentBody.trim() || !task) return;
    await apiFetch(`/api/tasks/${task._id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ body: commentBody, parentId: replyTo })
    });
    setCommentBody('');
    setReplyTo(null);
    await load();
    onPosted?.();
  };

  if (!isOpen || !task) return null;

  return (
    <div className="ic-panel">
      <div className="ic-header">
        <span>Comments</span>
        <button onClick={onClose}>Close</button>
      </div>
      <div className="ic-list">
        {comments.map((c) => {
          const parent = c.parentComment ? byId.get(c.parentComment) : null;
          return (
            <div key={c._id} className="ic-item">
              <div className="ic-meta">
                <span className="ic-author">{c.author?.name || 'Unknown'}</span>
                <span className="ic-time">{new Date(c.createdAt).toLocaleString()}</span>
              </div>
              {parent && (
                <div className="ic-replying">Replying to @{parent.author?.name || 'Unknown'}</div>
              )}
              <div className="ic-body">{c.body}</div>
              <button className="ic-reply" onClick={() => setReplyTo(c._id)}>Reply</button>
            </div>
          );
        })}
        {!comments.length && <div className="ic-empty">No comments yet.</div>}
      </div>
      <div className="ic-input">
        {replyTo && (
          <div className="ic-replying">Replying...</div>
        )}
        <input
          placeholder="Write a comment..."
          value={commentBody}
          onChange={(e) => setCommentBody(e.target.value)}
        />
        <button onClick={addComment}>Send</button>
      </div>
    </div>
  );
};

export default InlineComments;
