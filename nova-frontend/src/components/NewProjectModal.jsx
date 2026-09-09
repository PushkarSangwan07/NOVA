import { useState } from "react";

const NewProjectModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onCreate({ name, description });
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-4 z-50">
      <div className="card w-full max-w-md p-6 bg-surface">
        <h2 className="font-display text-xl mb-4">New project</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium mb-1" htmlFor="pname">
            Project name
          </label>
          <input
            id="pname"
            required
            autoFocus
            className="input-field mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Website Redesign"
          />

          <label className="block text-sm font-medium mb-1" htmlFor="pdesc">
            Description
          </label>
          <textarea
            id="pdesc"
            className="input-field mb-6"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this project about?"
          />

          <div className="flex justify-end gap-3">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? "Creating…" : "Create project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectModal;
