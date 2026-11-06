import {
  FaCalendarAlt,
  FaFlag,
  FaCheckCircle,
  FaTrash,
  FaEdit,
  FaComments,
} from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";
import Avatar from "../common/Avatar";
import { resolveAssetUrl } from "../../services/api";

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
  }) + " · " + date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function isOverdue(task) {
  return task.dueDate && task.status !== "Done" && new Date(task.dueDate) < new Date();
}

// For group tasks, `task.group` is set and `task.assignedTo` / `task.user`
// arrive populated (name, avatar). `canDelete` lets the group page hide the
// delete button from people who aren't allowed to use it.
// `onDiscuss` (group pages only) adds a button that opens the group chat about this task.
function TaskCard({ task, onEdit, onDelete, onToggleStatus, onDiscuss, canDelete = true }) {
  const { t } = useLanguage();
  const isGroupTask = Boolean(task.group);

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

        <div className={`flex items-center gap-2 ${isOverdue(task) ? "text-red-400 font-medium" : ""}`}>
          <FaCalendarAlt />
          {formatDate(task.dueDate)}
          {isOverdue(task) && <span className="text-[10px] uppercase tracking-wide">Overdue</span>}
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

      {isGroupTask && (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Avatar
              src={resolveAssetUrl(task.assignedTo?.avatar)}
              alt={task.assignedTo?.name || ""}
              sizeClass="w-6 h-6"
            />
            <span>
              {task.assignedTo ? (
                <>
                  {t("groups.assignedTo")}{" "}
                  <span className="text-white font-medium">{task.assignedTo.name}</span>
                </>
              ) : (
                t("groups.unassigned")
              )}
            </span>
          </div>

          {task.user?.name && (
            <span>
              {t("groups.createdBy")} {task.user.name}
            </span>
          )}
        </div>
      )}

      <div className="mt-4 flex gap-3 justify-end">

        {onDiscuss && (
          <button
            onClick={() => onDiscuss(task)}
            className="flex items-center gap-2 text-xs transition hover:text-white"
            style={{ color: "var(--primary-light)" }}
          >
            <FaComments /> {t("chat.discuss")}
          </button>
        )}

        <button
          onClick={() => onEdit(task)}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition"
        >
          <FaEdit /> {t("tasks.edit")}
        </button>

        {canDelete && (
          <button
            onClick={() => onDelete(task._id)}
            className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition"
          >
            <FaTrash /> {t("tasks.delete")}
          </button>
        )}

      </div>

    </div>
  );
}

export default TaskCard;
