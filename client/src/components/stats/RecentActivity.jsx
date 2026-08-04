// src/components/stats/RecentActivity.jsx

import {
  FaCheckCircle,
  FaPlusCircle,
  FaEdit,
} from "react-icons/fa";

const ICONS = {
  completed: <FaCheckCircle className="text-green-400" />,
  created: <FaPlusCircle className="text-blue-400" />,
  updated: <FaEdit className="text-yellow-400" />,
};

import { useLanguage } from "../../context/LanguageContext";

function timeAgo(dateStr) {
  const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);

  const units = [
    { label: "year", secs: 31536000 },
    { label: "month", secs: 2592000 },
    { label: "day", secs: 86400 },
    { label: "hour", secs: 3600 },
    { label: "minute", secs: 60 },
  ];

  for (const unit of units) {
    const value = Math.floor(seconds / unit.secs);
    if (value >= 1) {
      return `${value} ${unit.label}${value > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
}

function RecentActivity({ activity, loading }) {
  const { t } = useLanguage();

  const LABELS = {
    completed: t("stats.activityCompleted"),
    created: t("stats.activityCreated"),
    updated: t("stats.activityUpdated"),
  };

  return (
    <div className="bg-[#162117] border border-green-900 rounded-2xl p-5 lg:p-8">

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
              className="flex items-center gap-4 border-b border-green-900 pb-4 last:border-none"
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
