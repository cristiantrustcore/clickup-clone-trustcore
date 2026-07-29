import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useCreateSpace, useDeleteSpace, useSpaces } from "../hooks/useSpaces";

export default function SpacesPage() {
  const { data, isLoading, isError } = useSpaces();
  const createSpace = useCreateSpace();
  const deleteSpace = useDeleteSpace();
  const [name, setName] = useState("");

  function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    createSpace.mutate({ name: name.trim() }, { onSuccess: () => setName("") });
  }

  return (
    <div className="page">
      <h1>Espacios</h1>

      <form className="inline-form" onSubmit={handleCreate}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del nuevo espacio"
        />
        <button className="primary" type="submit" disabled={createSpace.isPending}>
          Crear espacio
        </button>
      </form>

      {isLoading && <p>Cargando...</p>}
      {isError && <p className="error-text">No se pudieron cargar los espacios.</p>}

      <div className="card-grid">
        {data?.spaces.map((space) => (
          <div key={space.id} className="card">
            <Link to={`/spaces/${space.id}`} className="card__title">
              {space.name}
            </Link>
            <p className="card__meta">{space._count?.lists ?? 0} listas</p>
            <button
              className="link-btn"
              onClick={() => {
                if (confirm(`¿Eliminar el espacio "${space.name}" y todo su contenido?`)) {
                  deleteSpace.mutate(space.id);
                }
              }}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      {data && data.spaces.length === 0 && <p>Todavía no hay espacios. Crea el primero arriba.</p>}
    </div>
  );
}
