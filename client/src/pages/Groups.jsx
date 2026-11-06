import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaUsers, FaUserShield } from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";
import PageTransition from "../components/PageTransition";
import GroupForm from "../components/groups/GroupForm";
import { getGroups, createGroup } from "../services/api";
import { useLanguage } from "../context/LanguageContext";

function Groups() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getGroups()
      .then((res) => setGroups(res.data))
      .catch((err) => {
        console.error("Failed to load groups:", err);
        setError(t("groups.loadError"));
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (data) => {
    try {
      setSubmitting(true);
      const res = await createGroup(data);
      // Jump straight into the new group so the user can add people
      navigate(`/groups/${res.data._id}`);
    } catch (err) {
      console.error("Failed to create group:", err);
      setError(err.response?.data?.message || t("groups.saveError"));
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  const memberLabel = (n) =>
    n === 1 ? t("groups.memberCountOne") : t("groups.memberCount").replace("{n}", n);

  return (
    <PageTransition>
      <MainLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* ================= HEADER ================= */}
          <section
            className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-r from-[#08110A] via-[#102417] to-[#18452A] p-5 sm:p-8 lg:p-10"
            style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}
          >
            <div
              className="absolute -top-10 -right-10 w-48 h-48 lg:w-72 lg:h-72 rounded-full opacity-20 blur-3xl"
              style={{ background: "var(--primary)" }}
            ></div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-2xl lg:text-5xl font-bold text-white">
                  {t("groups.title")}
                </h1>
                <p className="mt-2 text-sm lg:text-base text-gray-300">
                  {t("groups.subtitle")}
                </p>
              </div>

              <button
                onClick={() => setShowForm(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 transition px-5 py-3 rounded-xl font-semibold text-sm lg:text-base text-white"
                style={{ background: "var(--primary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary-dark)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary)")}
              >
                <FaPlus />
                {t("groups.newGroup")}
              </button>
            </div>
          </section>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-900 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          {/* ================= GROUP LIST ================= */}
          {loading && (
            <p className="text-center text-gray-400 py-10">{t("groups.loading")}</p>
          )}

          {!loading && groups.length === 0 && !error && (
            <p className="text-center text-gray-400 py-10">{t("groups.noGroups")}</p>
          )}

          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {groups.map((g) => {
              const percent =
                g.taskCount > 0 ? Math.round((g.doneCount / g.taskCount) * 100) : 0;

              return (
                <Link
                  key={g._id}
                  to={`/groups/${g._id}`}
                  className="block rounded-2xl bg-[#162117] p-5 transition"
                  style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--primary-dark)")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg lg:text-xl font-semibold text-white break-words">
                      {g.name}
                    </h2>

                    {g.myRole === "admin" && (
                      <span
                        className="shrink-0 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold uppercase"
                        style={{ background: "var(--primary-dark)", color: "var(--primary-light)" }}
                      >
                        <FaUserShield /> {t("groups.admin")}
                      </span>
                    )}
                  </div>

                  {g.description && (
                    <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                      {g.description}
                    </p>
                  )}

                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                    <FaUsers /> {memberLabel(g.memberCount)}
                  </div>

                  <div className="mt-4">
                    <div className="h-2 rounded-full bg-[#1D2C20] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${percent}%`, background: "var(--primary)" }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-400">
                      {g.taskCount === 0
                        ? t("groups.noTasksYet")
                        : t("groups.tasksDone")
                            .replace("{done}", g.doneCount)
                            .replace("{total}", g.taskCount)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </section>
        </div>

        {showForm && (
          <GroupForm
            submitting={submitting}
            onSubmit={handleCreate}
            onClose={() => setShowForm(false)}
          />
        )}
      </MainLayout>
    </PageTransition>
  );
}

export default Groups;
