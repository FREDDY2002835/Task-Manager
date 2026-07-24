import MainLayout from "../layouts/MainLayout";
import PageTransition from "../components/PageTransition";
import {
  FaSearch,
  FaPlus,
  FaCalendarAlt,
  FaFlag,
  FaCheckCircle,
} from "react-icons/fa";

function Tasks() {
  return (
     <PageTransition>
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ================= HEADER ================= */}

        <section className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-r from-[#08110A] via-[#102417] to-[#18452A] border border-green-900 p-5 sm:p-8 lg:p-10">

          <div className="absolute -top-10 -right-10 w-48 h-48 lg:w-72 lg:h-72 rounded-full bg-green-500 opacity-20 blur-3xl"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>

              <h1 className="text-2xl lg:text-5xl font-bold text-white">
                My Tasks
              </h1>

              <p className="mt-2 text-sm lg:text-base text-gray-300">
                Stay organized and manage your daily work efficiently.
              </p>

            </div>

            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 transition px-5 py-3 rounded-xl font-semibold text-sm lg:text-base">

              <FaPlus />

              New Task

            </button>

          </div>

        </section>

        {/* ================= SEARCH ================= */}

        <section className="flex flex-col lg:flex-row gap-4">

          <div className="flex items-center flex-1 bg-[#162117] border border-green-900 rounded-xl px-4 py-3">

            <FaSearch className="text-gray-400" />

            <input
              type="text"
              placeholder="Search tasks..."
              className="ml-3 w-full bg-transparent outline-none text-sm lg:text-base text-white placeholder:text-gray-500"
            />

          </div>

          <div className="grid grid-cols-3 gap-2 lg:flex">

            <button className="rounded-xl bg-green-500 px-4 py-3 text-sm">
              All
            </button>

            <button className="rounded-xl border border-green-900 bg-[#162117] px-4 py-3 text-sm text-gray-300 hover:bg-[#1D2C20]">
              Pending
            </button>

            <button className="rounded-xl border border-green-900 bg-[#162117] px-4 py-3 text-sm text-gray-300 hover:bg-[#1D2C20]">
              Done
            </button>

          </div>

        </section>

        {/* ================= TASKS ================= */}

        <section className="space-y-5">

          {/* Task Card */}

          <div className="rounded-2xl border border-green-900 bg-[#162117] p-5 hover:border-green-500 transition">

            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">

              <div className="flex-1">

                <h2 className="text-lg lg:text-2xl font-semibold text-white">
                  Build Authentication System
                </h2>

                <p className="mt-2 text-sm text-gray-400">
                  Implement JWT authentication and protect private routes.
                </p>

              </div>

              <span className="self-start rounded-full bg-red-500 px-3 py-1 text-xs font-semibold">
                LOW
              </span>

            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs lg:text-sm text-gray-400">

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

          {/* Task Card */}

          <div className="rounded-2xl border border-green-900 bg-[#162117] p-5 hover:border-green-500 transition">

            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">

              <div className="flex-1">

                <h2 className="text-lg lg:text-2xl font-semibold text-white">
                  Design Dashboard UI
                </h2>

                <p className="mt-2 text-sm text-gray-400">
                  Finish responsive dashboard and improve accessibility.
                </p>

              </div>

              <span className="self-start rounded-full bg-yellow-500 text-black px-3 py-1 text-xs font-semibold">
                MEDIUM
              </span>

            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs lg:text-sm text-gray-400">

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

          {/* Task Card */}

          <div className="rounded-2xl border border-green-900 bg-[#162117] p-5 hover:border-green-500 transition">

            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">

              <div className="flex-1">

                <h2 className="text-lg lg:text-2xl font-semibold text-white">
                  Connect MongoDB
                </h2>

                <p className="mt-2 text-sm text-gray-400">
                  Connect backend with MongoDB Atlas and test APIs.
                </p>

              </div>

              <span className="self-start rounded-full bg-green-500 text-black px-3 py-1 text-xs font-semibold">
                HIGH
              </span>

            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs lg:text-sm text-gray-400">

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

        </section>

      </div>
    </MainLayout>
    </PageTransition>
  );
}

export default Tasks;