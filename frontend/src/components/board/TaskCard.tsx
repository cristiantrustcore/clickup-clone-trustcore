import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../../types/tasks";

const PRIORITY_LABEL: Record<Task["priority"], string> = {
  LOW: "Baja",
  MEDIUM: "Media",
  HIGH: "Alta",
  URGENT: "Urgente",
};

const PRIORITY_COLOR: Record<Task["priority"], string> = {
  LOW: "#94a3b8",
  MEDIUM: "#3b82f6",
  HIGH: "#f97316",
  URGENT: "#ef4444",
};

interface Props {
  task: Task;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="task-card">
      <p className="task-card__title">{task.title}</p>
      <div className="task-card__footer">
        <span className="task-card__badge" style={{ background: PRIORITY_COLOR[task.priority] }}>
          {PRIORITY_LABEL[task.priority]}
        </span>
        {task.dueDate && (
          <span className="task-card__due">{new Date(task.dueDate).toLocaleDateString()}</span>
        )}
        <button
          type="button"
          className="task-card__delete"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onDelete(task.id)}
        >
          ×
        </button>
      </div>
    </div>
  );
}
