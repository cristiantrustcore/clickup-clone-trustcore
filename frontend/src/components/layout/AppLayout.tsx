import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div>
      <header className="app-header">
        <Link to="/" className="app-header__brand">
          ClickUp Clone
        </Link>
        <div className="app-header__user">
          <span>{user?.displayName}</span>
          <button className="link-btn" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
