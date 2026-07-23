import MainLayout from "../layouts/MainLayout";
import {
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaPlus,
} from "react-icons/fa";

function Dashboard() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-r from-[#08110A] via-[#0D1F10] to-[#12351A] p-5 sm:p-8 lg:p-12">

          {/* Glow Effects */}
          <div className="absolute -right-10 -top-10 h-48 w-48 md:h-72 md:w-72 lg:h-96 lg:w-96 rounded-full bg-green-500 opacity-20 blur-3xl"></div>

          <div className="absolute right-5 bottom-0 h-40 w-40 md:h-60 md:w-60 lg:h-72 lg:w-72 rounded-full bg-emerald-400 opacity-20 blur-3xl"></div>

          <div className="relative z-10 max-w-2xl">

            <div className="w-16 sm:w-20 h-1 bg-green-500 rounded mb-6"></div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
              Organize.
              <br />
              Focus.
              <br />
              Deliver.
            </h1>

            <p className="mt-6 text-sm sm:text-base lg:text-lg text-gray-300 leading-6 lg:leading-8">
              Welcome back 👋
              <br />
              Stay productive and keep track of everything in one place.
            </p>

            <button className="mt-8 w-full sm:w-fit flex items-center justify-center gap-3 border border-green-500 px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-white hover:bg-green-500 transition duration-300">

              <FaPlus />

              Create Task

            </button>

          </div>

        </section>

        {/* ================= STATS ================= */}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-[#162117] border border-green-900 rounded-2xl p-6 hover:-translate-y-1 transition duration-300">

            <FaTasks className="text-4xl text-green-400 mb-5" />

            <p className="text-gray-400 text-sm">
              Total Tasks
            </p>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-2">
              12
            </h2>

          </div>

          <div className="bg-[#162117] border border-green-900 rounded-2xl p-6 hover:-translate-y-1 transition duration-300">

            <FaCheckCircle className="text-4xl text-green-400 mb-5" />

            <p className="text-gray-400 text-sm">
              Completed
            </p>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-400 mt-2">
              7
            </h2>

          </div>

          <div className="bg-[#162117] border border-green-900 rounded-2xl p-6 hover:-translate-y-1 transition duration-300">

            <FaClock className="text-4xl text-yellow-400 mb-5" />

            <p className="text-gray-400 text-sm">
              Pending
            </p>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400 mt-2">
              5
            </h2>

          </div>

        </section>

        {/* ================= RECENT TASKS ================= */}

        <section>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Recent Tasks
          </h2>

          <div className="space-y-5">

            {/* Task */}

            <div className="bg-[#162117] border border-green-900 rounded-2xl p-5 sm:p-6 hover:border-green-500 transition">

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

                <div>

                  <h3 className="text-lg sm:text-xl font-semibold text-white">
                    Build MERN Authentication
                  </h3>

                  <p className="text-gray-400 mt-2">
                    Due Tomorrow
                  </p>

                </div>

                <span className="self-start sm:self-auto bg-red-500 px-3 py-2 rounded-full text-sm font-semibold">
                  HIGH
                </span>

              </div>

            </div>

            {/* Task */}

            <div className="bg-[#162117] border border-green-900 rounded-2xl p-5 sm:p-6 hover:border-green-500 transition">

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

                <div>

                  <h3 className="text-lg sm:text-xl font-semibold text-white">
                    Finish Dashboard UI
                  </h3>

                  <p className="text-gray-400 mt-2">
                    Friday
                  </p>

                </div>

                <span className="self-start sm:self-auto bg-yellow-500 text-black px-3 py-2 rounded-full text-sm font-semibold">
                  MEDIUM
                </span>

              </div>

            </div>

            {/* Task */}

            <div className="bg-[#162117] border border-green-900 rounded-2xl p-5 sm:p-6 hover:border-green-500 transition">

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

                <div>

                  <h3 className="text-lg sm:text-xl font-semibold text-white">
                    Connect MongoDB
                  </h3>

                  <p className="text-gray-400 mt-2">
                    Next Week
                  </p>

                </div>

                <span className="self-start sm:self-auto bg-green-500 text-black px-3 py-2 rounded-full text-sm font-semibold">
                  LOW
                </span>

              </div>

            </div>

          </div>

        </section>

      </div>
    </MainLayout>
  );
}

export default Dashboard;