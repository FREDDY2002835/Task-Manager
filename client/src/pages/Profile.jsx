import MainLayout from "../layouts/MainLayout";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaEdit,
} from "react-icons/fa";

function Profile() {
  return (
    <MainLayout>
      <div className="space-y-8">

        {/* Profile Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#08110A] via-[#102417] to-[#18452A] p-10 border border-green-900">

          <div className="absolute -top-20 -right-20 w-80 h-80 bg-green-500 opacity-20 rounded-full blur-3xl"></div>

          <div className="relative flex flex-col md:flex-row items-center gap-8">

            <img
              src="https://i.pravatar.cc/300"
              alt="Profile"
              className="w-36 h-36 rounded-full border-4 border-green-500 object-cover"
            />

            <div className="flex-1">

              <h1 className="text-5xl font-bold text-white">
                Frederick
              </h1>

              <p className="text-green-400 mt-2 text-lg">
                Full Stack Developer
              </p>

              <p className="text-gray-300 mt-4 max-w-xl">
                Passionate about building modern web applications using
                React, Node.js, Express and MongoDB.
              </p>

            </div>

            <button className="flex items-center gap-3 bg-green-500 hover:bg-green-600 transition px-6 py-3 rounded-xl font-semibold">

              <FaEdit />

              Edit Profile

            </button>

          </div>

        </div>

        {/* Statistics */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-[#162117] rounded-2xl border border-green-900 p-6">

            <FaTasks className="text-4xl text-green-400 mb-5" />

            <p className="text-gray-400">Total Tasks</p>

            <h2 className="text-5xl font-bold text-white mt-2">
              42
            </h2>

          </div>

          <div className="bg-[#162117] rounded-2xl border border-green-900 p-6">

            <FaCheckCircle className="text-4xl text-green-400 mb-5" />

            <p className="text-gray-400">Completed</p>

            <h2 className="text-5xl font-bold text-green-400 mt-2">
              36
            </h2>

          </div>

          <div className="bg-[#162117] rounded-2xl border border-green-900 p-6">

            <FaClock className="text-4xl text-yellow-400 mb-5" />

            <p className="text-gray-400">Pending</p>

            <h2 className="text-5xl font-bold text-yellow-400 mt-2">
              6
            </h2>

          </div>

        </div>

        {/* Profile Details */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Personal Information */}

          <div className="bg-[#162117] rounded-2xl border border-green-900 p-8">

            <h2 className="text-2xl font-bold text-white mb-8">
              Personal Information
            </h2>

            <div className="space-y-6">

              <div className="flex items-center gap-4">

                <FaUser className="text-green-400 text-xl" />

                <div>

                  <p className="text-gray-400">Full Name</p>

                  <h3 className="text-white font-semibold">
                    Frederick
                  </h3>

                </div>

              </div>

              <div className="flex items-center gap-4">

                <FaEnvelope className="text-green-400 text-xl" />

                <div>

                  <p className="text-gray-400">Email</p>

                  <h3 className="text-white">
                    fred@example.com
                  </h3>

                </div>

              </div>

              <div className="flex items-center gap-4">

                <FaPhone className="text-green-400 text-xl" />

                <div>

                  <p className="text-gray-400">Phone</p>

                  <h3 className="text-white">
                    +256 700 000000
                  </h3>

                </div>

              </div>

              <div className="flex items-center gap-4">

                <FaMapMarkerAlt className="text-green-400 text-xl" />

                <div>

                  <p className="text-gray-400">Location</p>

                  <h3 className="text-white">
                    Kampala, Uganda
                  </h3>

                </div>

              </div>

              <div className="flex items-center gap-4">

                <FaCalendarAlt className="text-green-400 text-xl" />

                <div>

                  <p className="text-gray-400">Member Since</p>

                  <h3 className="text-white">
                    July 2026
                  </h3>

                </div>

              </div>

            </div>

          </div>

          {/* Productivity */}

          <div className="bg-[#162117] rounded-2xl border border-green-900 p-8">

            <h2 className="text-2xl font-bold text-white mb-8">
              Productivity
            </h2>

            <div className="space-y-8">

              <div>

                <div className="flex justify-between">

                  <span className="text-gray-300">
                    Weekly Goal
                  </span>

                  <span className="text-green-400">
                    80%
                  </span>

                </div>

                <div className="mt-2 bg-gray-700 rounded-full h-3">

                  <div className="bg-green-500 h-3 rounded-full w-4/5"></div>

                </div>

              </div>

              <div>

                <div className="flex justify-between">

                  <span className="text-gray-300">
                    Monthly Progress
                  </span>

                  <span className="text-green-400">
                    65%
                  </span>

                </div>

                <div className="mt-2 bg-gray-700 rounded-full h-3">

                  <div className="bg-green-500 h-3 rounded-full w-2/3"></div>

                </div>

              </div>

              <div className="bg-[#1D2C20] rounded-xl p-6">

                <h3 className="text-xl text-white font-semibold">
                  Achievement
                </h3>

                <p className="text-gray-300 mt-3">
                  🎉 You completed 15 tasks this week.
                  Keep up the amazing work!
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default Profile;