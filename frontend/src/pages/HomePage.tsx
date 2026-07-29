import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Hola, {user?.displayName}</h1>
      <p>Sesión iniciada como @{user?.username}.</p>
      <p>Los espacios, listas y tareas llegan en el siguiente milestone.</p>
      <button className="primary" style={{ width: "auto", padding: "0.5rem 1rem" }} onClick={logout}>
        Cerrar sesión
      </button>
    </div>
  );
}
