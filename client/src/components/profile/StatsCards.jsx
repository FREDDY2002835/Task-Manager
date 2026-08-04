// src/components/profile/StatsCards.jsx

import {
  FaTasks,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

function StatsCards({ stats, loading }) {
  const { t } = useLanguage();

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <div
        className="rounded-2xl p-5 border"
        style={{
          background: "#162117",
          borderColor: "var(--primary-dark)",
        }}
      >

        <FaTasks
          className="text-3xl mb-4"
          style={{
            color: "var(--primary-light)",
          }}
        />

        <p className="text-xs lg:text-sm text-gray-400">
          {t("profile.totalTasks")}
        </p>

        <h2 className="text-2xl lg:text-5xl font-bold text-white mt-2">
          {loading ? "-" : stats.total}
        </h2>

      </div>


      <div
        className="rounded-2xl p-5 border"
        style={{
          background: "#162117",
          borderColor: "var(--primary-dark)",
        }}
      >

        <FaCheckCircle
          className="text-3xl mb-4"
          style={{
            color: "var(--primary-light)",
          }}
        />

        <p className="text-xs lg:text-sm text-gray-400">
          {t("profile.completed")}
        </p>

        <h2
          className="text-2xl lg:text-5xl font-bold mt-2"
          style={{
            color: "var(--primary-light)",
          }}
        >
          {loading ? "-" : stats.completed}
        </h2>

      </div>


      <div
        className="rounded-2xl p-5 border"
        style={{
          background: "#162117",
          borderColor: "var(--primary-dark)",
        }}
      >

        <FaClock
          className="text-3xl mb-4"
          style={{
            color: "var(--primary-light)",
          }}
        />

        <p className="text-xs lg:text-sm text-gray-400">
          {t("profile.pending")}
        </p>

        <h2
          className="text-2xl lg:text-5xl font-bold mt-2"
          style={{
            color: "var(--primary-light)",
          }}
        >
          {loading ? "-" : stats.pending}
        </h2>

      </div>


    </section>
  );
}

export default StatsCards;
