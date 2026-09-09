import { useEffect, useState } from "react";
import api from "../api/axios";

const statusLabel = { todo: "To do", "in-progress": "In progress", done: "Done" };

const TaskDetailModal = ({ task, projectId, members, onClose, onUpdate, onDelete }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    const loadComments = async () => {
      const { data } = await api.get(
        `/projects/${projectId}/tasks/${task._id}/comments`
      );
      setComments(data);
      setLoadingComments(false);
    };
    loadComments();
  }, [task._id, projectId]);

  const handleStatusChange = async (status) => {
    const { data } = await onUpdate(task._id, { status });
    // Re-fetch comments so the auto-logged activity entry shows up
    const { data: freshComments } = await api.get(
      `/projects/${projectId}/tasks/${task._id}/comments`
    );
    setComments(freshComments);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const { data } = await api.post(
      `/projects/${projectId}/tasks/${task._id}/comments`,
      { text: newComment }
    );
    setComments((prev) => [...prev, data]);
    setNewComment("");
  };

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-4 z-50">
      <div className="card w-full max-w-lg p-6 bg-surface max-h-[85vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <h2 className="font-display text-xl pr-4">{task.title}</h2>
          <button
            onClick={() => onDelete(task._id)}
            className="text-xs text-coral hover:underline flex-shrink-0"
          >
            Delete
          </button>
        </div>

        {task.description && (
          <p className="text-sm text-ink-soft mb-4">{task.description}</p>
        )}

        <div className="flex gap-2 mb-6">
          {Object.entries(statusLabel).map(([value, label]) => (
            <button
              key={value}
              onClick={() => handleStatusChange(value)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
                task.status === value
                  ? "bg-primary text-white border-primary"
                  : "border-border text-ink-soft hover:border-primary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <h3 className="text-sm font-medium mb-2">Activity</h3>
        <div className="space-y-3 mb-4">
          {loadingComments ? (
            <p className="text-xs text-ink-soft">Loading…</p>
          ) : comments.length === 0 ? (
            <p className="text-xs text-ink-soft">No comments yet.</p>
          ) : (
            comments.map((c) => (
              <div key={c._id} className="text-sm">
                <span className="font-medium">{c.author.name}</span>{" "}
                <span className={c.type === "activity" ? "text-ink-soft italic" : ""}>
                  {c.text}
                </span>
                <span className="text-xs text-ink-soft font-mono ml-2">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleAddComment} className="flex gap-2">
          <input
            className="input-field"
            placeholder="Add a comment…"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit" className="btn-primary flex-shrink-0">
            Post
          </button>
        </form>

        <button onClick={onClose} className="btn-secondary w-full mt-6">
          Close
        </button>
      </div>
    </div>
  );
};

export default TaskDetailModal;
