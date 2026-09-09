import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
  return (
    <Link
      to={`/projects/${project._id}`}
      className="card p-5 hover:border-primary transition-colors block"
    >
      <h3 className="font-display text-lg mb-1 truncate">{project.name}</h3>
      <p className="text-sm text-ink-soft line-clamp-2 mb-4 min-h-[2.5rem]">
        {project.description || "No description yet."}
      </p>
      <div className="flex items-center justify-between text-xs text-ink-soft">
        <span>
          {project.members?.length || 1} member{project.members?.length === 1 ? "" : "s"}
        </span>
        <span className="font-mono">
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </div>
    </Link>
  );
};

export default ProjectCard;
