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
import { useTheme, themes } from "../../context/ThemeContext";

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
  const { theme } = useTheme();
  const primaryColor = themes[theme]?.primary || themes.emerald.primary;

  // Convert the theme's hex color to an rgba string for the fill,
  // since Chart.js renders to canvas and can't resolve CSS variables.
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  const data = {
    labels: loading ? [] : weekly.map((d) => d.day),

    datasets: [
      {
        label: "Completed Tasks",
        data: loading ? [] : weekly.map((d) => d.completed),
        borderColor: primaryColor,
        backgroundColor: hexToRgba(primaryColor, 0.2),
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
    <div className="bg-[#162117] rounded-2xl p-5 lg:p-8" style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}>

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
