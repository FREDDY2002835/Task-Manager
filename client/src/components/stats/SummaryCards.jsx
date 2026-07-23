// src/components/stats/SummaryCards.jsx

import {
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaBolt,
} from "react-icons/fa";

const cards = [
  {
    icon: <FaTasks className="text-3xl text-green-400" />,
    title: "Total Tasks",
    value: 42,
    color: "text-white",
  },
  {
    icon: <FaCheckCircle className="text-3xl text-green-400" />,
    title: "Completed",
    value: 36,
    color: "text-green-400",
  },
  {
    icon: <FaClock className="text-3xl text-yellow-400" />,
    title: "Pending",
    value: 6,
    color: "text-yellow-400",
  },
  {
    icon: <FaBolt className="text-3xl text-blue-400" />,
    title: "Productivity",
    value: "92%",
    color: "text-blue-400",
  },
];

function SummaryCards() {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">

      {cards.map((card) => (

        <div
          key={card.title}
          className="bg-[#162117] border border-green-900 rounded-2xl p-5 hover:border-green-500 transition"
        >

          {card.icon}

          <p className="mt-4 text-xs lg:text-sm text-gray-400">
            {card.title}
          </p>

          <h2 className={`mt-2 text-2xl lg:text-5xl font-bold ${card.color}`}>
            {card.value}
          </h2>

        </div>

      ))}

    </section>
  );
}

export default SummaryCards;