import { useState, type FormEvent } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Status } from "../../types/spaces";
import type { Task } from "../../types/tasks";
import TaskCard from "./TaskCard";

interface Props {
  status: Status;
  tasks: Task[];
  onCreateTask: (statusId: string, title: string) => void;
  onDeleteTask: (id: string) => void;
}

export default function StatusColumn({ status, tasks, onCreateTask, onDeleteTask }: Props) {
  const { setNodeRef } = useDroppable({ id: `column:${status.id}` });
  const [title, setTitle] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onCreateTask(status.id, title.trim());
    setTitle("");
  }

  return (
    <div className="status-column">
      <div className="status-column__header" style={{ borderColor: status.color ?? "#ccc" }}>
        <span>{status.name}</span>
        <span className="status-column__count">{tasks.length}</span>
      </div>

      <div ref={setNodeRef} className="status-column__body">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
          ))}
        </SortableContext>
      </div>

      <form className="status-column__add" onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="+ Nueva tarea"
        />
      </form>
    </div>
  );
}
