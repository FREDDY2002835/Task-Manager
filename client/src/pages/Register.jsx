import { Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserPlus,
} from "react-icons/fa";

function Register() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#08110A]">

      {/* LEFT SIDE */}
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden">

        <div className="absolute w-[700px] h-[700px] rounded-full bg-green-500 opacity-20 blur-[150px]"></div>

        <div className="absolute inset-0 bg-gradient-to-br from-[#08110A] via-[#102417] to-[#18452A]"></div>

        <div className="relative z-10 max-w-xl px-10">

          <div className="w-20 h-1 bg-green-500 rounded mb-8"></div>

          <h1 className="text-6xl font-extrabold text-white">
            TaskFlow
          </h1>

          <h2 className="text-5xl font-bold text-green-400 mt-8 leading-tight">
            Plan.
            <br />
            Track.
            <br />
            Achieve.
          </h2>

          <p className="mt-8 text-lg text-gray-300 leading-8">
            Create your free account and start organizing your work,
            managing projects, and tracking your progress with TaskFlow.
          </p>

          <div className="mt-12 flex gap-10">

            <div>

              <h3 className="text-4xl font-bold text-green-400">
                10K+
              </h3>

              <p className="text-gray-400 mt-2">
                Happy Users
              </p>

            </div>

            <div>

              <h3 className="text-4xl font-bold text-green-400">
                99%
              </h3>

              <p className="text-gray-400 mt-2">
                Productivity Boost
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="flex items-center justify-center px-6 py-10">

        <div className="w-full max-w-md bg-[#162117] border border-green-900 rounded-3xl shadow-2xl p-10">

          <h2 className="text-4xl font-bold text-white">
            Create Account
          </h2>

          <p className="text-gray-400 mt-3">
            Join TaskFlow and boost your productivity.
          </p>

          {/* Full Name */}

          <div className="mt-8">

            <label className="block mb-2 text-gray-300">
              Full Name
            </label>

            <div className="flex items-center bg-[#1D2C20] rounded-xl border border-green-900 px-4">

              <FaUser className="text-gray-500" />

              <input
                type="text"
                placeholder="John Doe"
                className="w-full bg-transparent p-4 outline-none text-white placeholder:text-gray-500"
              />

            </div>

          </div>

          {/* Email */}

          <div className="mt-5">

            <label className="block mb-2 text-gray-300">
              Email Address
            </label>

            <div className="flex items-center bg-[#1D2C20] rounded-xl border border-green-900 px-4">

              <FaEnvelope className="text-gray-500" />

              <input
                type="email"
                placeholder="john@example.com"
                className="w-full bg-transparent p-4 outline-none text-white placeholder:text-gray-500"
              />

            </div>

          </div>

          {/* Password */}

          <div className="mt-5">

            <label className="block mb-2 text-gray-300">
              Password
            </label>

            <div className="flex items-center bg-[#1D2C20] rounded-xl border border-green-900 px-4">

              <FaLock className="text-gray-500" />

              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent p-4 outline-none text-white placeholder:text-gray-500"
              />

            </div>

          </div>

          {/* Confirm Password */}

          <div className="mt-5">

            <label className="block mb-2 text-gray-300">
              Confirm Password
            </label>

            <div className="flex items-center bg-[#1D2C20] rounded-xl border border-green-900 px-4">

              <FaLock className="text-gray-500" />

              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent p-4 outline-none text-white placeholder:text-gray-500"
              />

            </div>

          </div>

          {/* Terms */}

          <div className="mt-6">

            <label className="flex items-center gap-3 text-gray-400">

              <input
                type="checkbox"
                className="accent-green-500"
              />

              I agree to the Terms & Conditions

            </label>

          </div>

          {/* Register Button */}

          <button
            className="w-full mt-8 bg-green-500 hover:bg-green-600 transition py-4 rounded-xl font-semibold flex justify-center items-center gap-3"
          >

            <FaUserPlus />

            Create Account

          </button>

          {/* Login Link */}

          <p className="text-center text-gray-400 mt-8">

            Already have an account?

            <Link
              to="/login"
              className="ml-2 text-green-400 hover:text-green-300 font-semibold"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;