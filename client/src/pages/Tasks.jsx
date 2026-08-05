import { useEffect, useState, useCallback } from "react";
import MainLayout from "../layouts/MainLayout";
import PageTransition from "../components/PageTransition";
import TaskCard from "../components/tasks/TaskCard";
import TaskForm from "../components/tasks/TaskForm";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask as deleteTaskApi,
} from "../services/api";
import { FaSearch, FaPlus } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";


function Tasks() {
  const { t } = useLanguage();

  const FILTERS = [
    { label: t("tasks.all"), value: "" },
    { label: t("tasks.pending"), value: "Pending" },
    { label: t("tasks.done"), value: "Done" },
  ];

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(() => {
    setLoading(true);
    getTasks({ search: search || undefined, status: statusFilter || undefined })
      .then((res) => setTasks(res.data))
      .catch((err) => {
        console.error("Failed to load tasks:", err);
        setError("Could not load tasks. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [search, statusFilter]);

  useEffect(() => {
    // Debounce search slightly so we don't hit the API on every keystroke
    const timeout = setTimeout(fetchTasks, 300);
    return () => clearTimeout(timeout);
  }, [fetchTasks]);

  const handleCreateOrUpdate = async (data) => {
    try {
      setSubmitting(true);
      if (editingTask) {
        await updateTask(editingTask._id, data);
      } else {
        await createTask(data);
      }
      setShowForm(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      console.error("Failed to save task:", err);
      setError(err.response?.data?.message || "Failed to save task.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTaskApi(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Failed to delete task:", err);
      setError("Failed to delete task.");
    }
  };

  const handleToggleStatus = async (task) => {
    const nextStatus =
      task.status === "Pending"
        ? "In Progress"
        : task.status === "In Progress"
        ? "Done"
        : "Pending";

    try {
      const res = await updateTask(task._id, { status: nextStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? res.data : t))
      );
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  return (
     <PageTransition>
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ================= HEADER ================= */}

        <section className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-r from-[#08110A] via-[#102417] to-[#18452A] p-5 sm:p-8 lg:p-10" style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}>

          <div className="absolute -top-10 -right-10 w-48 h-48 lg:w-72 lg:h-72 rounded-full opacity-20 blur-3xl" style={{ background: "var(--primary)" }}></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>

              <h1 className="text-2xl lg:text-5xl font-bold text-white">
                {t("tasks.title")}
              </h1>

              <p className="mt-2 text-sm lg:text-base text-gray-300">
                {t("tasks.subtitle")}
              </p>

            </div>

            <button
              onClick={() => {
                setEditingTask(null);
                setShowForm(true);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 transition px-5 py-3 rounded-xl font-semibold text-sm lg:text-base"
              style={{ background: "var(--primary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary-dark)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary)")}
            >

              <FaPlus />

              {t("tasks.newTask")}

            </button>

          </div>

        </section>

        {/* ================= SEARCH ================= */}

        <section className="flex flex-col lg:flex-row gap-4">

          <div className="flex items-center flex-1 bg-[#162117] rounded-xl px-4 py-3" style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}>

            <FaSearch className="text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("tasks.searchPlaceholder")}
              className="ml-3 w-full bg-transparent outline-none text-sm lg:text-base text-white placeholder:text-gray-500"
            />

          </div>

          <div className="grid grid-cols-3 gap-2 lg:flex">

            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`rounded-xl px-4 py-3 text-sm transition ${
                  statusFilter === f.value
                    ? "text-white"
                    : "bg-[#162117] text-gray-300 hover:bg-[#1D2C20]"
                }`}
                style={
                  statusFilter === f.value
                    ? { background: "var(--primary)" }
                    : { borderWidth: 1, borderColor: "var(--primary-dark)" }
                }
              >
                {f.label}
              </button>
            ))}

          </div>

        </section>

        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-900 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        {/* ================= TASKS ================= */}

        <section className="space-y-5">

          {loading && (
            <p className="text-center text-gray-400 py-10">{t("tasks.loading")}</p>
          )}

          {!loading && tasks.length === 0 && (
            <p className="text-center text-gray-400 py-10">
              {t("tasks.noTasks")}
            </p>
          )}

          {!loading &&
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={(t) => {
                  setEditingTask(t);
                  setShowForm(true);
                }}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            ))}

        </section>

      </div>

      {showForm && (
        <TaskForm
          initialData={editingTask}
          submitting={submitting}
          onSubmit={handleCreateOrUpdate}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}

    </MainLayout>
    </PageTransition>
  );
}

export default Tasks;
