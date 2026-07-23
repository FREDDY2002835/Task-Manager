import MainLayout from "../layouts/MainLayout";
import { FaTasks, FaCheckCircle, FaClock, FaPlus } from "react-icons/fa";

function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-8">

        {/* Hero Section */}
        <section
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#08110A] via-[#0D1F10] to-[#12351A] p-12"
        >
          {/* Background Glow */}
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-green-500 opacity-20 blur-3xl"></div>

          <div className="absolute right-20 bottom-0 h-72 w-72 rounded-full bg-emerald-400 opacity-20 blur-3xl"></div>

          <div className="relative z-10 max-w-2xl">

            <div className="w-20 h-1 bg-green-500 rounded mb-8"></div>

            <h1 className="text-6xl font-extrabold leading-tight text-white">
              Organize.
              <br />
              Focus.
              <br />
              Deliver.
            </h1>

            <p className="mt-8 text-lg text-gray-300 leading-8">
              Welcome back 👋
              <br />
              Stay productive and keep track of everything in one place.
            </p>

            <button
              className="mt-10 flex items-center gap-3 border border-green-500 px-8 py-4 rounded-xl text-white hover:bg-green-500 transition duration-300"
            >
              <FaPlus />
              Create Task
            </button>

          </div>
        </section>

        {/* Statistics */}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-[#162117] border border-green-900 rounded-2xl p-6 hover:-translate-y-1 transition">

            <FaTasks className="text-4xl text-green-400 mb-6" />

            <h3 className="text-gray-400">Total Tasks</h3>

            <p className="text-5xl font-bold text-white mt-2">
              12
            </p>

          </div>

          <div className="bg-[#162117] border border-green-900 rounded-2xl p-6 hover:-translate-y-1 transition">

            <FaCheckCircle className="text-4xl text-green-400 mb-6" />

            <h3 className="text-gray-400">Completed</h3>

            <p className="text-5xl font-bold text-green-400 mt-2">
              7
            </p>

          </div>

          <div className="bg-[#162117] border border-green-900 rounded-2xl p-6 hover:-translate-y-1 transition">

            <FaClock className="text-4xl text-yellow-400 mb-6" />

            <h3 className="text-gray-400">Pending</h3>

            <p className="text-5xl font-bold text-yellow-400 mt-2">
              5
            </p>

          </div>

        </section>

        {/* Recent Tasks */}

        <section>

          <h2 className="text-3xl font-bold text-white mb-6">
            Recent Tasks
          </h2>

          <div className="space-y-5">

            <div className="bg-[#162117] border border-green-900 rounded-2xl p-6 flex justify-between items-center hover:border-green-500 transition">

              <div>

                <h3 className="text-xl font-semibold text-white">
                  Build MERN Authentication
                </h3>

                <p className="text-gray-400 mt-2">
                  Due Tomorrow
                </p>

              </div>

              <span className="bg-red-500 px-4 py-2 rounded-full text-sm font-semibold">
                HIGH
              </span>

            </div>

            <div className="bg-[#162117] border border-green-900 rounded-2xl p-6 flex justify-between items-center hover:border-green-500 transition">

              <div>

                <h3 className="text-xl font-semibold text-white">
                  Finish Dashboard UI
                </h3>

                <p className="text-gray-400 mt-2">
                  Friday
                </p>

              </div>

              <span className="bg-yellow-500 px-4 py-2 rounded-full text-sm font-semibold text-black">
                MEDIUM
              </span>

            </div>

            <div className="bg-[#162117] border border-green-900 rounded-2xl p-6 flex justify-between items-center hover:border-green-500 transition">

              <div>

                <h3 className="text-xl font-semibold text-white">
                  Connect MongoDB
                </h3>

                <p className="text-gray-400 mt-2">
                  Next Week
                </p>

              </div>

              <span className="bg-green-500 px-4 py-2 rounded-full text-sm font-semibold text-black">
                LOW
              </span>

            </div>

          </div>

        </section>

      </div>
    </MainLayout>
  );
}

export default Dashboard;