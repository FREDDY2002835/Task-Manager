// src/components/stats/SummaryCards.jsx

import {
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaBolt,
} from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

function SummaryCards({ taskStats, productivity, loading }) {
  const { t } = useLanguage();

  const cards = [
    {
      icon: <FaTasks className="text-3xl" style={{ color: "var(--primary-light)" }} />,
      title: t("stats.totalTasks"),
      value: loading ? "-" : taskStats.total,
      color: "text-white",
    },
    {
      icon: <FaCheckCircle className="text-3xl" style={{ color: "var(--primary-light)" }} />,
      title: t("stats.completed"),
      value: loading ? "-" : taskStats.completed,
      color: "",
      style: { color: "var(--primary-light)" },
    },
    {
      icon: <FaClock className="text-3xl text-yellow-400" />,
      title: t("stats.pending"),
      value: loading ? "-" : taskStats.pending,
      color: "text-yellow-400",
    },
    {
      icon: <FaBolt className="text-3xl text-blue-400" />,
      title: t("stats.productivity"),
      value: loading ? "-" : `${productivity.productivityScore}%`,
      color: "text-blue-400",
    },
  ];

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">

      {cards.map((card) => (

        <div
          key={card.title}
          className="bg-[#162117] rounded-2xl p-5 transition"
          style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--primary-dark)")}
        >

          {card.icon}

          <p className="mt-4 text-xs lg:text-sm text-gray-400">
            {card.title}
          </p>

          <h2 className={`mt-2 text-2xl lg:text-5xl font-bold ${card.color}`} style={card.style}>
            {card.value}
          </h2>

        </div>

      ))}

    </section>
  );
}

export default SummaryCards;
