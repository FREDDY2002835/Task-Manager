// src/components/profile/StatsCards.jsx

import {
  FaTasks,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

function StatsCards() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <div className="bg-[#162117] border border-green-900 rounded-2xl p-5">

        <FaTasks className="text-3xl text-green-400 mb-4" />

        <p className="text-xs lg:text-sm text-gray-400">
          Total Tasks
        </p>

        <h2 className="text-2xl lg:text-5xl font-bold text-white mt-2">
          42
        </h2>

      </div>

      <div className="bg-[#162117] border border-green-900 rounded-2xl p-5">

        <FaCheckCircle className="text-3xl text-green-400 mb-4" />

        <p className="text-xs lg:text-sm text-gray-400">
          Completed
        </p>

        <h2 className="text-2xl lg:text-5xl font-bold text-green-400 mt-2">
          36
        </h2>

      </div>

      <div className="bg-[#162117] border border-green-900 rounded-2xl p-5">

        <FaClock className="text-3xl text-yellow-400 mb-4" />

        <p className="text-xs lg:text-sm text-gray-400">
          Pending
        </p>

        <h2 className="text-2xl lg:text-5xl font-bold text-yellow-400 mt-2">
          6
        </h2>

      </div>

    </section>
  );
}

export default StatsCards;