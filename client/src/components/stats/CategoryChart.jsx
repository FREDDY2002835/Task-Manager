// src/components/stats/CategoryChart.jsx

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";
import { useLanguage } from "../../context/LanguageContext";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const COLORS = ["#22c55e", "#3b82f6", "#facc15", "#ef4444", "#a855f7", "#ec4899"];

function CategoryChart({ categories, loading }) {
  const { t } = useLanguage();
  const hasData = !loading && categories.length > 0;

  const data = {
    labels: hasData ? categories.map((c) => c.category) : ["No tasks yet"],

    datasets: [
      {
        data: hasData ? categories.map((c) => c.count) : [1],
        backgroundColor: hasData ? COLORS : ["#374151"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#ffffff",
        },
      },
    },
  };

  return (
    <div className="bg-[#162117] rounded-2xl p-5 lg:p-8" style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}>

      <h2 className="text-xl lg:text-2xl font-bold text-white mb-6">
        {t("stats.taskCategories")}
      </h2>

      <div className="h-72 lg:h-96">
        {loading ? (
          <p className="text-gray-400 text-sm">{t("stats.loading")}</p>
        ) : (
          <Doughnut data={data} options={options} />
        )}
      </div>

    </div>
  );
}

export default CategoryChart;
