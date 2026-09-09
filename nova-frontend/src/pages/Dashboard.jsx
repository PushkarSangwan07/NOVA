import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import NewProjectModal from "../components/NewProjectModal";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const loadProjects = async () => {
    const { data } = await api.get("/projects");
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = async ({ name, description }) => {
    const { data } = await api.post("/projects", { name, description });
    setProjects((prev) => [data, ...prev]);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-base">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl">Your projects</h1>
            <p className="text-ink-soft text-sm mt-1">
              Everything your team is working on, in one place.
            </p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            New project
          </button>
        </div>

        {loading ? (
          <p className="text-ink-soft text-sm">Loading projects…</p>
        ) : projects.length === 0 ? (
          <div className="card p-10 text-center">
            <h2 className="font-display text-xl mb-2">No projects yet</h2>
            <p className="text-ink-soft text-sm mb-5">
              Create your first project to start assigning tasks and tracking progress.
            </p>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              Create a project
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <NewProjectModal onClose={() => setShowModal(false)} onCreate={handleCreate} />
      )}
    </div>
  );
};

export default Dashboard;
