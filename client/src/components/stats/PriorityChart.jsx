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
        data: [19, 15, 8],

        backgroundColor: [
          "#22C55E", // High - Green
          "#EAB308", // Medium - Yellow
          "#EF4444", // Low - Red
        ],

        borderColor: [
          "#22C55E",
          "#EAB308",
          "#EF4444",
        ],

        borderWidth: 1,
        borderRadius: 8,
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

      tooltip: {
        backgroundColor: "#162117",
        titleColor: "#ffffff",
        bodyColor: "#d1d5db",
        borderColor: "#22C55E",
        borderWidth: 1,
      },
    },

    scales: {
      x: {
        ticks: {
          color: "#9CA3AF",
          font: {
            size: 14,
          },
        },

        grid: {
          color: "#1f2937",
        },
      },

      y: {
        beginAtZero: true,

        ticks: {
          color: "#9CA3AF",
          font: {
            size: 14,
          },
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