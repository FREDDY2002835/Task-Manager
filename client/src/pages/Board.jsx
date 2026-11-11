import { useEffect, useState, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";
import PageTransition from "../components/PageTransition";
import KanbanBoard from "../components/board/KanbanBoard";
import ViewToggle from "../components/board/ViewToggle";
import TaskForm from "../components/tasks/TaskForm";
import { getTasks, createTask, updateTask } from "../services/api";
import { useLanguage } from "../context/LanguageContext";

// Personal Kanban board: drag tasks between To Do / In Progress / Completed.
function Board() {
  const { t } = useLanguage();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = useCallback(() => {
    return getTasks()
      .then((res) => setTasks(res.data))
      .catch((err) => {
        console.error("Failed to load tasks:", err);
        setError(t("kanban.loadError"));
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // The card jumps to its new column immediately; if the server says no, it jumps back
  const handleMove = async (task, status) => {
    const previous = task.status;
    setError("");
    setTasks((prev) => prev.map((x) => (x._id === task._id ? { ...x, status } : x)));

    try {
      await updateTask(task._id, { status });
    } catch (err) {
      console.error("Failed to move task:", err);
      setTasks((prev) => prev.map((x) => (x._id === task._id ? { ...x, status: previous } : x)));
      setError(err.response?.data?.message || t("kanban.moveError"));
    }
  };

  const handleSave = async (data) => {
    try {
      setSubmitting(true);
      if (editingTask) await updateTask(editingTask._id, data);
      else await createTask(data);
      setShowForm(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      console.error("Failed to save task:", err);
      setError(err.response?.data?.message || t("kanban.moveError"));
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <MainLayout>
        <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
          <section
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#08110A] via-[#102417] to-[#18452A] p-4 sm:p-8 lg:rounded-3xl lg:p-10"
            style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}
          >
            <div
              className="absolute -right-10 -top-10 h-48 w-48 rounded-full opacity-20 blur-3xl lg:h-72 lg:w-72"
              style={{ background: "var(--primary)" }}
            ></div>

            <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-xl font-bold text-white sm:text-2xl lg:text-5xl">{t("kanban.title")}</h1>
                <p className="mt-1 text-sm text-gray-300 lg:text-base">{t("kanban.subtitle")}</p>
              </div>

              <button
                onClick={() => {
                  setEditingTask(null);
                  setShowForm(true);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition sm:w-auto lg:text-base"
                style={{ background: "var(--primary)" }}
              >
                <FaPlus /> {t("tasks.newTask")}
              </button>
            </div>
          </section>

          <ViewToggle active="board" />

          {error && (
            <p className="rounded-xl border border-red-900 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>
          )}

          {loading ? (
            <p className="py-10 text-center text-gray-400">{t("tasks.loading")}</p>
          ) : (
            <KanbanBoard
              tasks={tasks}
              onMove={handleMove}
              onEdit={(task) => {
                setEditingTask(task);
                setShowForm(true);
              }}
            />
          )}
        </div>

        {showForm && (
          <TaskForm
            initialData={editingTask}
            submitting={submitting}
            onSubmit={handleSave}
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

export default Board;
