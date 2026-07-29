import { useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { useSpace } from "../hooks/useSpaces";
import { useCreateList, useDeleteList, useListsForSpace } from "../hooks/useLists";

export default function SpaceDetailPage() {
  const { spaceId } = useParams<{ spaceId: string }>();
  const { data: spaceData } = useSpace(spaceId);
  const { data, isLoading, isError } = useListsForSpace(spaceId);
  const createList = useCreateList(spaceId!);
  const deleteList = useDeleteList(spaceId!);
  const [name, setName] = useState("");

  function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    createList.mutate({ name: name.trim() }, { onSuccess: () => setName("") });
  }

  return (
    <div className="page">
      <Link to="/" className="link-btn">
        ← Espacios
      </Link>
      <h1>{spaceData?.space.name ?? "Espacio"}</h1>

      <form className="inline-form" onSubmit={handleCreate}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre de la nueva lista"
        />
        <button className="primary" type="submit" disabled={createList.isPending}>
          Crear lista
        </button>
      </form>

      {isLoading && <p>Cargando...</p>}
      {isError && <p className="error-text">No se pudieron cargar las listas.</p>}

      <div className="card-grid">
        {data?.lists.map((list) => (
          <div key={list.id} className="card">
            <Link to={`/lists/${list.id}`} className="card__title">
              {list.name}
            </Link>
            <p className="card__meta">{list.statuses.length} estados</p>
            <button
              className="link-btn"
              onClick={() => {
                if (confirm(`¿Eliminar la lista "${list.name}" y todas sus tareas?`)) {
                  deleteList.mutate(list.id);
                }
              }}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      {data && data.lists.length === 0 && <p>Todavía no hay listas en este espacio.</p>}
    </div>
  );
}
