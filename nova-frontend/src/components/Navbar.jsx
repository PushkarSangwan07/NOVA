import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-border bg-surface">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-medium text-ink">
          NOVA
        </Link>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-ink-soft">{user.name}</span>
            <button onClick={handleLogout} className="btn-secondary">
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
