// src/components/stats/WeeklyChart.jsx

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { useLanguage } from "../../context/LanguageContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

function WeeklyChart({ weekly, loading }) {
  const { t } = useLanguage();
  const data = {
    labels: loading ? [] : weekly.map((d) => d.day),

    datasets: [
      {
        label: "Completed Tasks",
        data: loading ? [] : weekly.map((d) => d.completed),
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        labels: {
          color: "#ffffff",
        },
      },
    },

    scales: {
      x: {
        ticks: {
          color: "#9CA3AF",
        },
        grid: {
          color: "#1f2937",
        },
      },

      y: {
        beginAtZero: true,
        ticks: {
          color: "#9CA3AF",
          precision: 0,
        },
        grid: {
          color: "#1f2937",
        },
      },
    },
  };

  return (
    <div className="bg-[#162117] border border-green-900 rounded-2xl p-5 lg:p-8">

      <h2 className="text-xl lg:text-2xl font-bold text-white mb-6">
        {t("stats.weeklyProgress")}
      </h2>

      <div className="h-72 lg:h-96">
        {loading ? (
          <p className="text-gray-400 text-sm">{t("stats.loading")}</p>
        ) : (
          <Line data={data} options={options} />
        )}
      </div>

    </div>
  );
}

export default WeeklyChart;
