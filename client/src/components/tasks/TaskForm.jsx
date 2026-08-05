import { useState } from "react";
import { FaTimes } from "react-icons/fa";

const PRIORITIES = ["Low", "Medium", "High"];
const STATUSES = ["Pending", "In Progress", "Done"];

// Modal form used to create (or edit) a task.
// onSubmit receives the plain task data object.
function TaskForm({ initialData = null, onSubmit, onClose, submitting }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [priority, setPriority] = useState(initialData?.priority || "Medium");
  const [status, setStatus] = useState(initialData?.status || "Pending");
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate ? initialData.dueDate.slice(0, 10) : ""
  );
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setError("");

    onSubmit({
      title,
      description,
      category,
      priority,
      status,
      dueDate: dueDate || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg bg-[#162117] rounded-2xl shadow-2xl p-5 sm:p-8 max-h-[90vh] overflow-y-auto" style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {initialData ? "Edit Task" : "New Task"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400"
          >
            <FaTimes />
          </button>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-900 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block mb-1 text-xs sm:text-sm text-gray-300">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build Authentication System"
              className="w-full rounded-xl bg-[#1D2C20] px-4 py-3 outline-none text-sm text-white placeholder:text-gray-500" style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}
            />
          </div>

          <div>
            <label className="block mb-1 text-xs sm:text-sm text-gray-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details..."
              rows={3}
              className="w-full rounded-xl bg-[#1D2C20] px-4 py-3 outline-none text-sm text-white placeholder:text-gray-500" style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-xs sm:text-sm text-gray-300">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Development"
                className="w-full rounded-xl bg-[#1D2C20] px-4 py-3 outline-none text-sm text-white placeholder:text-gray-500" style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}
              />
            </div>

            <div>
              <label className="block mb-1 text-xs sm:text-sm text-gray-300">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-xl bg-[#1D2C20] px-4 py-3 outline-none text-sm text-white" style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-xs sm:text-sm text-gray-300">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-xl bg-[#1D2C20] px-4 py-3 outline-none text-sm text-white" style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-xs sm:text-sm text-gray-300">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl bg-[#1D2C20] px-4 py-3 outline-none text-sm text-white" style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl py-3 text-sm text-gray-300 hover:bg-[#1D2C20] transition"
              style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl transition py-3 text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: "var(--primary)" }}
              onMouseEnter={(e) => !submitting && (e.currentTarget.style.background = "var(--primary-dark)")}
              onMouseLeave={(e) => !submitting && (e.currentTarget.style.background = "var(--primary)")}
            >
              {submitting ? "Saving..." : initialData ? "Save Changes" : "Create Task"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default TaskForm;
