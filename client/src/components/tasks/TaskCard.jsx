import {
  FaCalendarAlt,
  FaFlag,
  FaCheckCircle,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

const PRIORITY_STYLES = {
  Low: "bg-red-500 text-white",
  Medium: "bg-yellow-500 text-black",
  High: "bg-green-500 text-black",
};

function formatDate(dateStr) {
  if (!dateStr) return "No due date";
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function TaskCard({ task, onEdit, onDelete, onToggleStatus }) {
  const { t } = useLanguage();

  return (
    <div
      className="rounded-2xl bg-[#162117] p-5 transition"
      style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--primary-dark)")}
    >

      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">

        <div className="flex-1">

          <h2 className="text-lg lg:text-2xl font-semibold text-white">
            {task.title}
          </h2>

          {task.description && (
            <p className="mt-2 text-sm text-gray-400">
              {task.description}
            </p>
          )}

        </div>

        <span
          className={`self-start rounded-full px-3 py-1 text-xs font-semibold ${
            PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.Medium
          }`}
        >
          {task.priority?.toUpperCase()}
        </span>

      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs lg:text-sm text-gray-400">

        <div className="flex items-center gap-2">
          <FaCalendarAlt />
          {formatDate(task.dueDate)}
        </div>

        <div className="flex items-center gap-2">
          <FaFlag />
          {task.category || "General"}
        </div>

        <button
          onClick={() => onToggleStatus(task)}
          className="flex items-center gap-2 text-left"
          style={{ color: "var(--primary-light)" }}
        >
          <FaCheckCircle />
          {task.status}
        </button>

      </div>

      <div className="mt-4 flex gap-3 justify-end">

        <button
          onClick={() => onEdit(task)}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition"
        >
          <FaEdit /> {t("tasks.edit")}
        </button>

        <button
          onClick={() => onDelete(task._id)}
          className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition"
        >
          <FaTrash /> {t("tasks.delete")}
        </button>

      </div>

    </div>
  );
}

export default TaskCard;
