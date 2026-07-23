// src/components/profile/StatsCards.jsx

import {
  FaTasks,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

function StatsCards() {
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
          Total Tasks
        </p>

        <h2 className="text-2xl lg:text-5xl font-bold text-white mt-2">
          42
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
          Completed
        </p>

        <h2
          className="text-2xl lg:text-5xl font-bold mt-2"
          style={{
            color: "var(--primary-light)",
          }}
        >
          36
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
          Pending
        </p>

        <h2
          className="text-2xl lg:text-5xl font-bold mt-2"
          style={{
            color: "var(--primary-light)",
          }}
        >
          6
        </h2>

      </div>


    </section>
  );
}

export default StatsCards;