import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

// Modal used to create a group, or to edit its name/description.
function GroupForm({ initialData = null, onSubmit, onClose, submitting }) {
  const { t } = useLanguage();
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(t("groups.nameRequired"));
      return;
    }

    setError("");
    onSubmit({ name: name.trim(), description: description.trim() });
  };

  const inputClass =
    "w-full rounded-xl bg-[#1D2C20] px-4 py-3 outline-none text-sm text-white placeholder:text-gray-500";
  const inputStyle = { borderWidth: 1, borderColor: "var(--primary-dark)" };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4">
      <div
        className="w-full max-w-lg bg-[#162117] rounded-2xl shadow-2xl p-5 sm:p-8 max-h-[90vh] overflow-y-auto"
        style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {initialData ? t("groups.editGroup") : t("groups.newGroup")}
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
            <label className="block mb-1 text-xs sm:text-sm text-gray-300">
              {t("groups.groupName")}
            </label>
            <input
              type="text"
              value={name}
              maxLength={60}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("groups.groupNamePlaceholder")}
              className={inputClass}
              style={inputStyle}
              autoFocus
            />
          </div>

          <div>
            <label className="block mb-1 text-xs sm:text-sm text-gray-300">
              {t("groups.description")}
            </label>
            <textarea
              value={description}
              maxLength={300}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl py-3 text-sm text-gray-300 hover:bg-[#1D2C20] transition"
              style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}
            >
              {t("groups.cancel")}
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl transition py-3 text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: "var(--primary)" }}
            >
              {submitting
                ? t("groups.saving")
                : initialData
                ? t("groups.save")
                : t("groups.create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GroupForm;
