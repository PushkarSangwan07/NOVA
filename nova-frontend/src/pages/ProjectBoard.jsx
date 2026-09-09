import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import ProgressBar from "../components/ProgressBar";
import TaskCard from "../components/TaskCard";
import NewTaskModal from "../components/NewTaskModal";
import TaskDetailModal from "../components/TaskDetailModal";
import InviteMemberModal from "../components/InviteMemberModal";

const columns = [
  { key: "todo", label: "To do", accent: "border-t-ink-soft" },
  { key: "in-progress", label: "In progress", accent: "border-t-amber" },
  { key: "done", label: "Done", accent: "border-t-teal" },
];

const ProjectBoard = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState({ counts: {}, percentComplete: 0 });
  const [selectedTask, setSelectedTask] = useState(null);
  const [showNewTask, setShowNewTask] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    const [projectRes, tasksRes, progressRes] = await Promise.all([
      api.get(`/projects/${projectId}`),
      api.get(`/projects/${projectId}/tasks`),
      api.get(`/projects/${projectId}/progress`),
    ]);
    setProject(projectRes.data);
    setTasks(tasksRes.data);
    setProgress(progressRes.data);
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const refreshProgress = async () => {
    const { data } = await api.get(`/projects/${projectId}/progress`);
    setProgress(data);
  };

  const handleCreateTask = async (form) => {
    const { data } = await api.post(`/projects/${projectId}/tasks`, form);
    setTasks((prev) => [data, ...prev]);
    setShowNewTask(false);
    refreshProgress();
  };

  const handleUpdateTask = async (taskId, updates) => {
    const { data } = await api.patch(`/projects/${projectId}/tasks/${taskId}`, updates);
    setTasks((prev) => prev.map((t) => (t._id === taskId ? data : t)));
    setSelectedTask(data);
    refreshProgress();
    return { data };
  };

  const handleDeleteTask = async (taskId) => {
    await api.delete(`/projects/${projectId}/tasks/${taskId}`);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    setSelectedTask(null);
    refreshProgress();
  };

  const handleInvite = async (email) => {
    const { data } = await api.post(`/projects/${projectId}/members`, { email });
    setProject(data);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base">
        <Navbar />
        <p className="text-ink-soft text-sm p-10">Loading project…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between mb-6 gap-6">
          <div>
            <h1 className="font-display text-3xl mb-1">{project.name}</h1>
            <p className="text-ink-soft text-sm">{project.description}</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button className="btn-secondary" onClick={() => setShowInvite(true)}>
              Invite
            </button>
            <button className="btn-primary" onClick={() => setShowNewTask(true)}>
              New task
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <div className="md:col-span-2">
            <ProgressBar counts={progress.counts} percentComplete={progress.percentComplete} />
          </div>
          <div className="card p-5">
            <span className="text-sm font-medium text-ink-soft block mb-3">Team</span>
            <div className="flex flex-wrap gap-2">
              {project.members.map((m) => (
                <span
                  key={m.user._id}
                  className="text-xs bg-base border border-border rounded-full px-2.5 py-1"
                >
                  {m.user.name}
                  {m.role === "owner" && <span className="text-ink-soft"> · owner</span>}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {columns.map((col) => (
            <div key={col.key}>
              <div className={`border-t-2 ${col.accent} pt-3 mb-3 flex items-baseline justify-between`}>
                <h2 className="font-medium text-sm">{col.label}</h2>
                <span className="text-xs text-ink-soft font-mono">
                  {tasks.filter((t) => t.status === col.key).length}
                </span>
              </div>
              <div className="space-y-3">
                {tasks
                  .filter((t) => t.status === col.key)
                  .map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onClick={() => setSelectedTask(task)}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {showNewTask && (
        <NewTaskModal
          members={project.members}
          onClose={() => setShowNewTask(false)}
          onCreate={handleCreateTask}
        />
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          projectId={projectId}
          members={project.members}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
        />
      )}

      {showInvite && (
        <InviteMemberModal onClose={() => setShowInvite(false)} onInvite={handleInvite} />
      )}
    </div>
  );
};

export default ProjectBoard;
