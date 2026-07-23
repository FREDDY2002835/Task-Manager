// src/components/stats/RecentActivity.jsx

import {
  FaCheckCircle,
  FaPlusCircle,
  FaEdit,
} from "react-icons/fa";

const activities = [
  {
    icon: <FaCheckCircle className="text-green-400" />,
    text: "Completed Dashboard UI",
    time: "2 hours ago",
  },
  {
    icon: <FaPlusCircle className="text-blue-400" />,
    text: "Created Authentication API",
    time: "Yesterday",
  },
  {
    icon: <FaEdit className="text-yellow-400" />,
    text: "Updated MongoDB Models",
    time: "2 days ago",
  },
];

function RecentActivity() {
  return (
    <div className="bg-[#162117] border border-green-900 rounded-2xl p-5 lg:p-8">

      <h2 className="text-xl lg:text-2xl font-bold text-white mb-6">
        Recent Activity
      </h2>

      <div className="space-y-5">

        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b border-green-900 pb-4 last:border-none"
          >
            <div className="text-2xl">
              {activity.icon}
            </div>

            <div className="flex-1">
              <p className="text-sm lg:text-base text-white">
                {activity.text}
              </p>

              <span className="text-xs text-gray-400">
                {activity.time}
              </span>
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}

export default RecentActivity;