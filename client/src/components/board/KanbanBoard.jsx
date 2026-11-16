import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  pointerWithin,
} from "@dnd-kit/core";
import { FaChevronLeft, FaChevronRight, FaEdit, FaCalendarAlt } from "react-icons/fa";
import Avatar from "../common/Avatar";
import { resolveAssetUrl } from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";
import { PRIORITY_STYLES } from "../../utils/priority";
import { useMediaQuery } from "../../utils/useMediaQuery";

// The three columns, mapped to the task statuses stored in the database
const COLUMNS = [
  { status: "Pending", labelKey: "kanban.todo", dot: "bg-gray-400" },
  { status: "In Progress", labelKey: "kanban.inProgress", dot: "bg-yellow-400" },
  { status: "Done", labelKey: "kanban.completed", dot: "bg-green-400" },
];

const cardBorder = { borderWidth: 1, borderColor: "var(--primary-dark)" };

function dueInfo(task) {
  if (!task.dueDate) return { label: "", overdue: false };
  const due = new Date(task.dueDate);
  return {
    label: due.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    overdue: task.status !== "Done" && due.getTime() < new Date().getTime(),
  };
}

// What a card looks like (also used for the floating copy while dragging)
function CardBody({ task, onMove, onEdit }) {
  const { t } = useLanguage();
  const index = COLUMNS.findIndex((c) => c.status === task.status);
  const { label, overdue } = dueInfo(task);

  // Buttons must not start a drag when pressed
  const stop = (e) => e.stopPropagation();

  return (
    <div
      className="select-none rounded-xl bg-[#1D2C20] p-3"
      style={{ borderWidth: 1, borderColor: overdue ? "#7f1d1d" : "var(--primary-dark)" }}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className={`break-words text-sm font-semibold ${
            task.status === "Done" ? "text-gray-400 line-through" : "text-white"
          }`}
        >
          {task.title}
        </p>

        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.Medium
          }`}
        >
          {t(`priority.${task.priority}`)}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-400">
        {label && (
          <span className={`flex items-center gap-1 ${overdue ? "font-medium text-red-400" : ""}`}>
            <FaCalendarAlt />
            {label}
            {overdue && ` · ${t("kanban.overdue")}`}
          </span>
        )}

        {task.category && <span>{task.category}</span>}

        {task.assignedTo && (
          <span className="flex items-center gap-1">
            <Avatar
              src={resolveAssetUrl(task.assignedTo.avatar)}
              alt={task.assignedTo.name}
              sizeClass="w-4 h-4"
            />
            {task.assignedTo.name}
          </span>
        )}
      </div>

      {(onMove || onEdit) && (
        <div className="mt-2 flex items-center justify-between">
          <div className="flex gap-1">
            {/* Arrows: the easy way to move a card on a phone */}
            <button
              type="button"
              disabled={index <= 0}
              onClick={() => onMove(task, COLUMNS[index - 1].status)}
              onMouseDown={stop}
              onTouchStart={stop}
              title={t("kanban.movePrev")}
              className="flex items-center justify-center rounded-lg bg-black/25 p-3 text-sm text-gray-300 hover:text-white disabled:opacity-30"
            >
              <FaChevronLeft />
            </button>
            <button
              type="button"
              disabled={index >= COLUMNS.length - 1}
              onClick={() => onMove(task, COLUMNS[index + 1].status)}
              onMouseDown={stop}
              onTouchStart={stop}
              title={t("kanban.moveNext")}
              className="flex items-center justify-center rounded-lg bg-black/25 p-3 text-sm text-gray-300 hover:text-white disabled:opacity-30"
            >
              <FaChevronRight />
            </button>
          </div>

          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(task)}
              onMouseDown={stop}
              onTouchStart={stop}
              title={t("tasks.edit")}
              className="flex items-center gap-1.5 rounded-lg px-3 py-3 text-xs text-gray-300 hover:text-white"
            >
              <FaEdit /> {t("tasks.edit")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function DraggableCard({ task, onMove, onEdit }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: task._id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cursor-grab touch-manipulation active:cursor-grabbing"
      style={{ opacity: isDragging ? 0.35 : 1 }}
    >
      <CardBody task={task} onMove={onMove} onEdit={onEdit} />
    </div>
  );
}

// Phone tab: shows the column name + how many cards. You can also drop a
// dragged card onto a tab to move it there.
function TabButton({ column, count, active, onSelect }) {
  const { t } = useLanguage();
  const { setNodeRef, isOver } = useDroppable({ id: `tab:${column.status}` });

  return (
    <button
      ref={setNodeRef}
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onSelect}
      className={`flex min-w-0 flex-col items-center gap-0.5 rounded-lg px-1 py-2 transition ${
        active ? "text-white" : "text-gray-300"
      }`}
      style={{
        background: active ? "var(--primary)" : isOver ? "var(--primary-dark)" : "transparent",
        boxShadow: isOver ? "0 0 0 2px var(--primary)" : undefined,
      }}
    >
      <span className="max-w-full truncate text-xs font-semibold">{t(column.labelKey)}</span>
      <span className="flex items-center gap-1 text-xs opacity-90">
        <span className={`h-2 w-2 rounded-full ${column.dot}`} />
        {count}
      </span>
    </button>
  );
}

function Column({ column, tasks, onMove, onEdit }) {
  const { t } = useLanguage();
  const { setNodeRef, isOver } = useDroppable({ id: column.status });

  return (
    <div className="w-full min-w-0">
      <div
        ref={setNodeRef}
        data-column={column.status}
        className="rounded-2xl bg-[#162117] p-2.5 transition"
        style={{
          ...cardBorder,
          boxShadow: isOver ? "0 0 0 2px var(--primary)" : undefined,
        }}
      >
        <header className="mb-2 flex items-center justify-between px-1">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <span className={`h-2.5 w-2.5 rounded-full ${column.dot}`} />
            {t(column.labelKey)}
          </h3>
          <span className="rounded-full bg-[#1D2C20] px-2 py-0.5 text-[11px] text-gray-300">
            {tasks.length}
          </span>
        </header>

        <div className="min-h-[6rem] space-y-2">
          {tasks.map((task) => (
            <DraggableCard key={task._id} task={task} onMove={onMove} onEdit={onEdit} />
          ))}

          {tasks.length === 0 && (
            <p className="py-6 text-center text-xs text-gray-500">{t("kanban.empty")}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Kanban board: To Do / In Progress / Completed.
//   tasks   -> array of tasks (status: Pending | In Progress | Done)
//   onMove  -> (task, newStatus) called when a card is dropped in another
//              column (or moved with its arrows)
//   onEdit  -> (task) optional, shows an Edit button on each card
// Mouse: drag a card. Touch: press and hold, then drag. Or use the arrows.
function KanbanBoard({ tasks, onMove, onEdit }) {
  const { t } = useLanguage();
  const [activeId, setActiveId] = useState(null);
  const [tab, setTab] = useState("Pending"); // phones: which column is showing
  const isWide = useMediaQuery("(min-width: 768px)");

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } })
  );

  const activeTask = tasks.find((task) => task._id === activeId);

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    const task = tasks.find((x) => x._id === active.id);
    // A card can be dropped on a column, or on a phone tab ("tab:<status>")
    const target = over ? String(over.id).replace(/^tab:/, "") : null;
    if (task && target && target !== task.status) onMove(task, target);
  };

  const inColumn = (status) => tasks.filter((task) => task.status === status);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      {isWide ? (
        // Tablets and computers: all three columns side by side
        <div className="grid grid-cols-3 gap-3">
          {COLUMNS.map((column) => (
            <Column key={column.status} column={column} tasks={inColumn(column.status)} onMove={onMove} onEdit={onEdit} />
          ))}
        </div>
      ) : (
        // Phones: one full-width column at a time, picked with tabs
        <div className="space-y-3">
          <div
            role="tablist"
            className="grid grid-cols-3 gap-1 rounded-xl bg-[#162117] p-1"
            style={cardBorder}
          >
            {COLUMNS.map((column) => (
              <TabButton
                key={column.status}
                column={column}
                count={inColumn(column.status).length}
                active={tab === column.status}
                onSelect={() => setTab(column.status)}
              />
            ))}
          </div>

          <Column
            column={COLUMNS.find((c) => c.status === tab)}
            tasks={inColumn(tab)}
            onMove={onMove}
            onEdit={onEdit}
          />

          <p className="text-center text-xs text-gray-500">{t("kanban.hint")}</p>
        </div>
      )}

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-2 shadow-2xl">
            <CardBody task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default KanbanBoard;
