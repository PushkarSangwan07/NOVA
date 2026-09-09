import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create your account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between bg-primary text-white p-12">
        <span className="font-display text-2xl">NOVA</span>
        <div>
          <h1 className="font-display text-5xl leading-tight mb-4">
            Plan.
            <br />
            Collaborate.
            <br />
            Deliver.
          </h1>
          <p className="text-white/70 max-w-sm">
            Set up a workspace for your team in under a minute.
          </p>
        </div>
        <span className="text-white/40 text-sm">Team Productivity Platform</span>
      </div>

      <div className="flex items-center justify-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h2 className="font-display text-2xl mb-1">Create your account</h2>
          <p className="text-ink-soft text-sm mb-6">Start planning with your team.</p>

          {error && (
            <div className="mb-4 text-sm text-coral bg-coral/10 border border-coral/30 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            required
            className="input-field mb-4"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="input-field mb-4"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            className="input-field mb-6"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button type="submit" disabled={submitting} className="btn-primary w-full mb-4">
            {submitting ? "Creating account…" : "Create account"}
          </button>

          <p className="text-sm text-ink-soft text-center">
            Already on NOVA?{" "}
            <Link to="/login" className="text-primary font-medium">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
