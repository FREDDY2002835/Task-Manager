// src/components/stats/RecentActivity.jsx

import {
  FaCheckCircle,
  FaPlusCircle,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";
import { timeAgo } from "../../utils/timeAgo";

const ICONS = {
  completed: <FaCheckCircle className="text-green-400" />,
  created: <FaPlusCircle className="text-blue-400" />,
  updated: <FaEdit className="text-yellow-400" />,
  deleted: <FaTrash className="text-red-400" />,
};

function RecentActivity({ activity, loading }) {
  const { t } = useLanguage();

  const LABELS = {
    completed: t("stats.activityCompleted"),
    created: t("stats.activityCreated"),
    updated: t("stats.activityUpdated"),
    deleted: t("stats.activityDeleted"),
  };

  return (
    <div className="bg-[#162117] rounded-2xl p-5 lg:p-8" style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}>

      <h2 className="text-xl lg:text-2xl font-bold text-white mb-6">
        {t("stats.recentActivity")}
      </h2>

      <div className="space-y-5">

        {loading && (
          <p className="text-gray-400 text-sm">{t("stats.loading")}</p>
        )}

        {!loading && activity.length === 0 && (
          <p className="text-gray-400 text-sm">{t("stats.noActivity")}</p>
        )}

        {!loading &&
          activity.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border-b pb-4 last:border-none"
              style={{ borderColor: "var(--primary-dark)" }}
            >
              <div className="text-2xl">
                {ICONS[item.type]}
              </div>

              <div className="flex-1">
                <p className="text-sm lg:text-base text-white">
                  {LABELS[item.type]} "{item.title}"
                </p>

                <span className="text-xs text-gray-400">
                  {timeAgo(item.timestamp)}
                </span>
              </div>
            </div>
          ))}

      </div>

    </div>
  );
}

export default RecentActivity;
