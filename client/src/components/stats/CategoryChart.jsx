// src/components/stats/CategoryChart.jsx

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function CategoryChart() {
  const data = {
    labels: [
      "Frontend",
      "Backend",
      "UI/UX",
      "Database",
    ],

    datasets: [
      {
        data: [12, 9, 7, 5],

        backgroundColor: [
          "#22c55e",
          "#3b82f6",
          "#facc15",
          "#ef4444",
        ],
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
    <div className="bg-[#162117] border border-green-900 rounded-2xl p-5 lg:p-8">

      <h2 className="text-xl lg:text-2xl font-bold text-white mb-6">
        Task Categories
      </h2>

      <div className="h-72 lg:h-96">
        <Doughnut data={data} options={options} />
      </div>

    </div>
  );
}

export default CategoryChart;