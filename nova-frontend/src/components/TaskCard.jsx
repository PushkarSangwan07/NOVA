const priorityColor = {
  low: "bg-ink-soft/10 text-ink-soft",
  medium: "bg-amber/10 text-amber",
  high: "bg-coral/10 text-coral",
};

const TaskCard = ({ task, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="card p-4 text-left w-full hover:border-primary transition-colors"
    >
      <p className="text-sm font-medium mb-2">{task.title}</p>
      <div className="flex items-center justify-between text-xs">
        <span className={`px-2 py-0.5 rounded-full font-medium ${priorityColor[task.priority]}`}>
          {task.priority}
        </span>
        {task.assignee ? (
          <span className="text-ink-soft font-mono">{task.assignee.name}</span>
        ) : (
          <span className="text-ink-soft/50 font-mono">unassigned</span>
        )}
      </div>
      {task.dueDate && (
        <p className="text-xs text-ink-soft font-mono mt-2">
          due {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}
    </button>
  );
};

export default TaskCard;
