import { useState } from "react";

const InviteMemberModal = ({ onClose, onInvite }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onInvite(email);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't add that member.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-4 z-50">
      <div className="card w-full max-w-sm p-6 bg-surface">
        <h2 className="font-display text-xl mb-4">Invite a member</h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 text-sm text-coral bg-coral/10 border border-coral/30 rounded-md px-3 py-2">
              {error}
            </div>
          )}
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            autoFocus
            className="input-field mb-6"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teammate@example.com"
          />
          <div className="flex justify-end gap-3">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? "Adding…" : "Add to project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteMemberModal;
