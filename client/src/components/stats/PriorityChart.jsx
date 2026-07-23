// src/components/stats/PriorityChart.jsx

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function PriorityChart() {
  const data = {
    labels: ["High", "Medium", "Low"],

    datasets: [
      {
        label: "Tasks",
        data: [8, 15, 19],
        backgroundColor: [
          "#ef4444",
          "#facc15",
          "#22c55e",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
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
        ticks: {
          color: "#9CA3AF",
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
        Tasks by Priority
      </h2>

      <div className="h-72 lg:h-96">
        <Bar data={data} options={options} />
      </div>

    </div>
  );
}

export default PriorityChart;