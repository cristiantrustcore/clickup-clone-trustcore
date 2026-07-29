import { Link, useParams } from "react-router-dom";
import { DndContext, PointerSensor, closestCorners, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { useList } from "../hooks/useLists";
import { useCreateTask, useDeleteTask, useMoveTask, useTasksForList } from "../hooks/useTasks";
import StatusColumn from "../components/board/StatusColumn";
import type { Task } from "../types/tasks";

function tasksForStatus(tasks: Task[], statusId: string) {
  return tasks.filter((t) => t.statusId === statusId).sort((a, b) => a.order - b.order);
}

export default function ListBoardPage() {
  const { listId } = useParams<{ listId: string }>();
  const { data: listData } = useList(listId);
  const { data: tasksData, isLoading } = useTasksForList(listId);
  const createTask = useCreateTask(listId!);
  const deleteTask = useDeleteTask(listId!);
  const moveTask = useMoveTask(listId!);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const tasks = tasksData?.tasks ?? [];

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    let targetStatusId: string;
    let targetIndex: number;

    const overId = String(over.id);
    if (overId.startsWith("column:")) {
      targetStatusId = overId.replace("column:", "");
      targetIndex = tasksForStatus(tasks, targetStatusId).filter((t) => t.id !== activeTask.id).length;
    } else {
      const overTask = tasks.find((t) => t.id === over.id);
      if (!overTask) return;
      targetStatusId = overTask.statusId;
      targetIndex = tasksForStatus(tasks, targetStatusId)
        .filter((t) => t.id !== activeTask.id)
        .findIndex((t) => t.id === overTask.id);
      if (targetIndex < 0) targetIndex = 0;
    }

    if (targetStatusId === activeTask.statusId && targetIndex === activeTask.order) return;

    moveTask.mutate({ id: activeTask.id, statusId: targetStatusId, order: targetIndex });
  }

  return (
    <div className="page page--wide">
      {listData && (
        <Link to={`/spaces/${listData.list.spaceId}`} className="link-btn">
          ← Volver al espacio
        </Link>
      )}
      <h1>{listData?.list.name ?? "Lista"}</h1>

      {isLoading && <p>Cargando...</p>}

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="board">
          {listData?.list.statuses.map((status) => (
            <StatusColumn
              key={status.id}
              status={status}
              tasks={tasksForStatus(tasks, status.id)}
              onCreateTask={(statusId, title) => createTask.mutate({ title, statusId })}
              onDeleteTask={(id) => deleteTask.mutate(id)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
