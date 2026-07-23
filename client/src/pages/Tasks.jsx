import MainLayout from "../layouts/MainLayout";
import {
  FaSearch,
  FaPlus,
  FaCalendarAlt,
  FaFlag,
  FaCheckCircle,
} from "react-icons/fa";

function Tasks() {
  return (
    <MainLayout>
      <div className="space-y-8">

        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#08110A] via-[#102417] to-[#18452A] border border-green-900 p-10">

          <div className="absolute -right-20 -top-20 w-72 h-72 bg-green-500 opacity-20 blur-3xl rounded-full"></div>

          <div className="relative flex flex-col md:flex-row justify-between items-center gap-6">

            <div>

              <h1 className="text-5xl font-bold text-white">
                My Tasks
              </h1>

              <p className="text-gray-300 mt-3">
                Stay organized and manage your daily work efficiently.
              </p>

            </div>

            <button className="flex items-center gap-3 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold transition">

              <FaPlus />

              New Task

            </button>

          </div>

        </div>

        {/* Search + Filters */}

        <div className="flex flex-col lg:flex-row gap-5 justify-between">

          <div className="flex items-center bg-[#162117] border border-green-900 rounded-xl px-5 py-3 flex-1">

            <FaSearch className="text-gray-400" />

            <input
              type="text"
              placeholder="Search tasks..."
              className="ml-4 bg-transparent outline-none w-full text-white placeholder:text-gray-500"
            />

          </div>

          <div className="flex gap-3">

            <button className="px-5 py-3 rounded-xl bg-green-500 text-white">
              All
            </button>

            <button className="px-5 py-3 rounded-xl bg-[#162117] border border-green-900 text-gray-300 hover:bg-[#1d2c20]">
              Pending
            </button>

            <button className="px-5 py-3 rounded-xl bg-[#162117] border border-green-900 text-gray-300 hover:bg-[#1d2c20]">
              Completed
            </button>

          </div>

        </div>

        {/* Tasks */}

        <div className="space-y-6">

          {/* Task */}

          <div className="bg-[#162117] border border-green-900 rounded-2xl p-6 hover:border-green-500 transition">

            <div className="flex justify-between items-start">

              <div>

                <h2 className="text-2xl font-semibold text-white">
                  Build Authentication System
                </h2>

                <p className="text-gray-400 mt-3">
                  Implement JWT authentication and protect private routes.
                </p>

              </div>

              <span className="bg-red-500 px-4 py-2 rounded-full text-sm font-semibold">
                HIGH
              </span>

            </div>

            <div className="flex flex-wrap gap-8 mt-8 text-gray-400">

              <div className="flex items-center gap-2">

                <FaCalendarAlt />

                Tomorrow

              </div>

              <div className="flex items-center gap-2">

                <FaFlag />

                Development

              </div>

              <div className="flex items-center gap-2 text-green-400">

                <FaCheckCircle />

                Pending

              </div>

            </div>

          </div>

          {/* Task */}

          <div className="bg-[#162117] border border-green-900 rounded-2xl p-6 hover:border-green-500 transition">

            <div className="flex justify-between items-start">

              <div>

                <h2 className="text-2xl font-semibold text-white">
                  Design Dashboard UI
                </h2>

                <p className="text-gray-400 mt-3">
                  Finish responsive dashboard and improve accessibility.
                </p>

              </div>

              <span className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold">
                MEDIUM
              </span>

            </div>

            <div className="flex flex-wrap gap-8 mt-8 text-gray-400">

              <div className="flex items-center gap-2">

                <FaCalendarAlt />

                Friday

              </div>

              <div className="flex items-center gap-2">

                <FaFlag />

                UI / UX

              </div>

              <div className="flex items-center gap-2 text-green-400">

                <FaCheckCircle />

                In Progress

              </div>

            </div>

          </div>

          {/* Task */}

          <div className="bg-[#162117] border border-green-900 rounded-2xl p-6 hover:border-green-500 transition">

            <div className="flex justify-between items-start">

              <div>

                <h2 className="text-2xl font-semibold text-white">
                  Connect MongoDB
                </h2>

                <p className="text-gray-400 mt-3">
                  Connect backend with MongoDB Atlas and test APIs.
                </p>

              </div>

              <span className="bg-green-500 text-black px-4 py-2 rounded-full text-sm font-semibold">
                LOW
              </span>

            </div>

            <div className="flex flex-wrap gap-8 mt-8 text-gray-400">

              <div className="flex items-center gap-2">

                <FaCalendarAlt />

                Next Week

              </div>

              <div className="flex items-center gap-2">

                <FaFlag />

                Backend

              </div>

              <div className="flex items-center gap-2 text-green-400">

                <FaCheckCircle />

                Pending

              </div>

            </div>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default Tasks;