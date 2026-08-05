import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageTransition from "../components/PageTransition";
import { useLanguage } from "../context/LanguageContext";
import { getActivityHistory } from "../services/api";
import { timeAgo } from "../utils/timeAgo";
import {
  FaHistory,
  FaCheckCircle,
  FaPlusCircle,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

function getIcon(item) {
  if (item.action === "created") return <FaPlusCircle className="text-blue-400" />;
  if (item.action === "deleted") return <FaTrash className="text-red-400" />;
  if (item.action === "statusChanged" && item.details.endsWith("to Done")) {
    return <FaCheckCircle className="text-green-400" />;
  }
  return <FaEdit className="text-yellow-400" />;
}

function History() {
  const { t } = useLanguage();

  const [activity, setActivity] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getActivityHistory({ page, limit: 15 })
      .then((res) => {
        setActivity(res.data.activity);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => console.error("Failed to load history:", err))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <PageTransition>
      <MainLayout>
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Header */}
          <section className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-r from-[#08110A] via-[#102417] to-[#18452A] border border-green-900 p-5 sm:p-8 lg:p-10">

            <div className="absolute -top-10 -right-10 h-48 w-48 lg:h-72 lg:w-72 rounded-full bg-green-500 opacity-20 blur-3xl"></div>

            <div className="relative z-10 flex items-center gap-3">

              <FaHistory className="text-2xl lg:text-4xl text-green-400" />

              <div>
                <h1 className="text-2xl lg:text-5xl font-bold text-white">
                  {t("history.title")}
                </h1>

                <p className="mt-2 text-sm lg:text-base text-gray-300">
                  {t("history.subtitle")}
                </p>
              </div>

            </div>

          </section>

          {/* List */}
          <section className="bg-[#162117] border border-green-900 rounded-2xl p-5 lg:p-8">

            {loading && (
              <p className="text-center text-gray-400 py-10">{t("history.loading")}</p>
            )}

            {!loading && activity.length === 0 && (
              <p className="text-center text-gray-400 py-10">{t("history.noHistory")}</p>
            )}

            {!loading && activity.length > 0 && (
              <div className="space-y-5">
                {activity.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 border-b border-green-900 pb-4 last:border-none"
                  >
                    <div className="text-2xl mt-0.5">
                      {getIcon(item)}
                    </div>

                    <div className="flex-1">
                      <p className="text-sm lg:text-base text-white">
                        {item.details}
                      </p>

                      <span className="text-xs text-gray-400">
                        {timeAgo(item.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-between mt-8 pt-5 border-t border-green-900">

                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-green-900 text-sm text-gray-300 hover:bg-[#1D2C20] transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft className="text-xs" />
                  {t("history.previous")}
                </button>

                <span className="text-sm text-gray-400">
                  {page} / {totalPages}
                </span>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-green-900 text-sm text-gray-300 hover:bg-[#1D2C20] transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {t("history.next")}
                  <FaChevronRight className="text-xs" />
                </button>

              </div>
            )}

          </section>

        </div>
      </MainLayout>
    </PageTransition>
  );
}

export default History;
