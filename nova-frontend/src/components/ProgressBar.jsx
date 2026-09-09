const ProgressBar = ({ counts, percentComplete }) => {
  const total = (counts?.todo || 0) + (counts?.["in-progress"] || 0) + (counts?.done || 0);

  return (
    <div className="card p-5">
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-sm font-medium text-ink-soft">Progress</span>
        <span className="font-display text-2xl">{percentComplete || 0}%</span>
      </div>
      <div className="h-2 rounded-full bg-border overflow-hidden flex">
        {total > 0 && (
          <>
            <div
              className="h-full bg-ink-soft/40"
              style={{ width: `${(counts.todo / total) * 100}%` }}
            />
            <div
              className="h-full bg-amber"
              style={{ width: `${(counts["in-progress"] / total) * 100}%` }}
            />
            <div
              className="h-full bg-teal"
              style={{ width: `${(counts.done / total) * 100}%` }}
            />
          </>
        )}
      </div>
      <div className="flex gap-4 mt-3 text-xs text-ink-soft">
        <span>{counts?.todo || 0} to do</span>
        <span>{counts?.["in-progress"] || 0} in progress</span>
        <span>{counts?.done || 0} done</span>
      </div>
    </div>
  );
};

export default ProgressBar;
